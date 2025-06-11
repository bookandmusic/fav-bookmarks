import { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider, { GithubProfile } from "next-auth/providers/github";

import { oauthService } from "@/service/oauth";
import { userService } from "@/service/user";

export const credentialsProvider = CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials): Promise<User | null> {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("凭证缺失");
    }

    const user = await userService.findUserByUniqueKey(credentials.email);
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
      // 用户不存在，创建新用户
      const randomSuffix = Math.floor(Math.random() * 1000);
      const randomName = `${profile.login}_user${randomSuffix}`;

      const newUser = await userService.createUser({
        email: profile.email!,
        name: randomName,
      });

      // 创建 OAuth 账户记录
      await oauthService.createUserOAuthAccount({
        provider: "github",
        providerId: profile.id.toString(),
        accessToken: "",
        refreshToken: "",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 假设30天有效期
        userId: newUser.id,
      });

      return {
        id: newUser.id.toString(),
        name: newUser.username!,
        email: newUser.email!,
        image: profile.avatar_url,
      };
    }

    // 如果用户已存在且没有关联的 OAuth 账户，创建一个
    const oauthAccount = await oauthService.findUserOAuthAccount(
      user.id,
      "github",
      profile.id.toString(),
    );
    if (!oauthAccount) {
      await oauthService.createUserOAuthAccount({
        provider: "github",
        providerId: profile.id.toString(),
        accessToken: "",
        refreshToken: "",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 假设30天有效期
        userId: user.id,
      });
    }

    return {
      id: profile.id.toString(),
      name: profile.name || profile.login,
      email: profile.email!,
      image: profile.avatar_url,
    };
  },
});
