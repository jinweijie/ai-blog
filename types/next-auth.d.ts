import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    accessTokenExpires?: number;
    error?: string;
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    error?: string;
    user?: {
      id: string;
      email?: string | null;
      name?: string | null;
      role?: string | null;
    };
  }
}
