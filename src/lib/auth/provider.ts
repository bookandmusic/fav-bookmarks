import { Role } from "@prisma/client";
import { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider, { GithubProfile } from "next-auth/providers/github";

import { userService } from "@/service/user";

export const credentialsProvider = CredentialsProvider({
  name: "credentials",
  credentials: {
    name: { label: "Name", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials): Promise<User | null> {
    if (!credentials?.name || !credentials?.password) {
      throw new Error("凭证缺失");
    }

    const user = await userService.findUserByUniqueKey(credentials.name);
    if (
      !user ||
      !user.password ||
      !(await userService.validatePassword(
        { password: user.password! },
        credentials.password,
      ))
    ) {
      throw new Error("无效的凭证");
    }

    return {
      id: user.id.toString(),
      email: user.email ?? "",
      name: user.username ?? "",
      role: user.role,
    };
  },
});

export const githubAuthProvider = GitHubProvider({
  clientId: process.env.GITHUB_ID!,
  clientSecret: process.env.GITHUB_SECRET!,
  async profile(profile: GithubProfile) {
    let user = await userService.findUserByUniqueKey(profile.email!);
    if (!user) {
      user = await userService.findUserByUniqueKey(profile.phone!);
    }
    if (!user) {
      return {
        id: "",
        name: profile.username || "",
        email: profile.email || "",
        avatar: profile.avatar,
        phone: profile.phone,
        role: Role.USER,
      };
    }
    return {
      id: user.id.toString(),
      name: user.username || "",
      email: user.email || "",
      avatar: user.avatar,
      phone: user.phone,
      role: user.role,
    };
  },
});
