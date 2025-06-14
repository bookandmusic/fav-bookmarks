import { NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";

import { credentialsProvider } from "@/lib/auth/providers/credentials";
import { userService } from "@/service/user";

import { handleOAuthLogin, OAuthProfile } from "./handler";
import { giteeProvider } from "./providers/gitee";
import { githubAuthProvider } from "./providers/github";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
      avatar?: string;
      phone?: string;
    };
  }
  interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    phone?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [credentialsProvider, githubAuthProvider, giteeProvider],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ user, token }: { user: User; token: JWT }) {
      if (user && user.email) {
        const existUser = await userService.findUserByUniqueKey(user.email);
        token.id = existUser?.id;
        token.role = existUser?.role;
        token.avatar = existUser?.avatar;
        token.phone = existUser?.phone;
        token.name = existUser?.username;
      }
      return token;
    },
    async signIn({ account, profile }) {
      if (account && profile) {
        await handleOAuthLogin({ account, profile: profile as OAuthProfile });
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
