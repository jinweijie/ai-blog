import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function createRefreshToken(userId: string) {
  const raw = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return raw;
}

async function rotateRefreshToken(userId: string, currentToken: string) {
  const tokenHash = hashToken(currentToken);
  const stored = await prisma.refreshToken.findFirst({
    where: {
      userId,
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!stored) {
    return null;
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  return createRefreshToken(userId);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: REFRESH_TOKEN_TTL_MS / 1000,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const jwt = token as JWT;
      if (user) {
        const refreshToken = await createRefreshToken(user.id as string);
        const accessToken = crypto.randomBytes(24).toString("base64url");
        const accessTokenExpires = Date.now() + ACCESS_TOKEN_TTL_MS;

        return {
          ...jwt,
          accessToken,
          accessTokenExpires,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: (user as { role?: string }).role ?? "admin",
          },
        } as JWT;
      }

      if (jwt.accessTokenExpires && Date.now() < jwt.accessTokenExpires) {
        return jwt as JWT;
      }

      if (!jwt.refreshToken || !jwt.user?.id) {
        return { ...jwt, error: "RefreshTokenMissing" } as JWT;
      }

      const nextRefresh = await rotateRefreshToken(jwt.user.id, jwt.refreshToken);
      if (!nextRefresh) {
        return { ...jwt, error: "RefreshTokenExpired" } as JWT;
      }

      return {
        ...jwt,
        accessToken: crypto.randomBytes(24).toString("base64url"),
        accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
        refreshToken: nextRefresh,
      } as JWT;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }

      return {
        ...session,
        accessToken: token.accessToken,
        accessTokenExpires: token.accessTokenExpires,
        error: token.error,
      };
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});
