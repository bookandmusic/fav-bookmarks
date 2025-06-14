import { NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { GithubProfile } from "next-auth/providers/github";

import { credentialsProvider } from "@/lib/auth/providers/credentials";
import { userService } from "@/service/user";

import {
  GiteeProfile,
  giteeProvider,
  handleGiteeLogin,
} from "./providers/gitee";
import { githubAuthProvider, handleGitHubLogin } from "./providers/github";

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
      if (account?.provider === "github") {
        await handleGitHubLogin({
          account,
          profile: profile as GithubProfile,
        });
      } else if (account?.provider === "gitee") {
        await handleGiteeLogin({
          account,
          profile: profile as GiteeProfile,
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
