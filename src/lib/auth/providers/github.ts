import type { Account } from "next-auth";
import GitHubProvider, { GithubProfile } from "next-auth/providers/github";

import { oauthService } from "@/service/oauth";
import { userService } from "@/service/user";

export const githubAuthProvider = GitHubProvider({
  clientId: process.env.GITHUB_ID!,
  clientSecret: process.env.GITHUB_SECRET!,
});

interface ExtendedGithubProfile extends GithubProfile {
  phone?: string;
}

export async function handleGitHubLogin({
  account,
  profile,
}: {
  account: Account;
  profile: ExtendedGithubProfile;
}) {
  if (!account || account.provider !== "github") return;

  const provider = "github";
  const providerId = profile.id.toString();

  // 提取 Token 信息
  const tokenPayload = {
    accessToken: account.access_token || "",
    refreshToken: account.refresh_token || "",
    expiresAt: account.expires_at
      ? new Date(account.expires_at * 1000)
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  // 查找用户
  const email = profile.email;
  const phone = profile.phone;
  let user = email ? await userService.findUserByUniqueKey(email) : undefined;

  if (!user && phone) {
    user = await userService.findUserByUniqueKey(phone);
  }

  // 如果用户不存在，创建用户
  if (!user) {
    const randomSuffix = Math.floor(Math.random() * 1000);
    const name = `${profile.login}_user${randomSuffix}`;
    user = await userService.createUser({
      email: email || "",
      name,
      phone: phone || undefined,
      avatar: profile.avatar_url,
    });
  }

  // 检查是否已有 OAuth 绑定
  const existingOAuth = await oauthService.findUserOAuthAccount(
    user.id,
    provider,
    providerId
  );

  if (!existingOAuth) {
    await oauthService.createUserOAuthAccount({
      provider,
      providerId,
      userId: user.id,
      ...tokenPayload,
    });
  } else {
    const { id } = existingOAuth;
    await oauthService.updateUserOAuthAccount({
      id,
      data: tokenPayload,
    });
  }
}
