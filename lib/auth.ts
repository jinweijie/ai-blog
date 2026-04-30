import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
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
      if (user) {
        const refreshToken = await createRefreshToken(user.id as string);
        const accessToken = crypto.randomBytes(24).toString("base64url");
        const accessTokenExpires = Date.now() + ACCESS_TOKEN_TTL_MS;

        return {
          ...token,
          accessToken,
          accessTokenExpires,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: (user as { role?: string }).role ?? "admin",
          },
        };
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      if (!token.refreshToken || !token.user?.id) {
        return { ...token, error: "RefreshTokenMissing" };
      }

      const nextRefresh = await rotateRefreshToken(token.user.id as string, token.refreshToken);
      if (!nextRefresh) {
        return { ...token, error: "RefreshTokenExpired" };
      }

      return {
        ...token,
        accessToken: crypto.randomBytes(24).toString("base64url"),
        accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
        refreshToken: nextRefresh,
      };
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
    signIn: "/admin/sign-in",
  },
});
