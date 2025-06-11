import { User as PrismaUser } from "@prisma/client";
import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

import { credentialsProvider, githubAuthProvider } from "@/lib/auth/provider";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [credentialsProvider, githubAuthProvider],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 同步会话时长
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | undefined }) {
      if (user) {
        const prismaUser = user as unknown as PrismaUser;
        token.id = prismaUser.id.toString(); // 确保id是字符串类型
        token.role = prismaUser.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
