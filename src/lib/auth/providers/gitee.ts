import type { Account } from "next-auth";
import { OAuthConfig } from "next-auth/providers/oauth";

import { oauthService } from "@/service/oauth";
import { userService } from "@/service/user";

export interface GiteeProfile {
  id: number;
  name: string;
  login: string;
  email: string;
  phone: string;
  avatar_url: string;
}

export const giteeProvider = {
  id: "gitee",
  name: "Gitee",
  type: "oauth",
  authorization: {
    url: "https://gitee.com/oauth/authorize",
    params: {
      scope: "user_info", // ✅ 注意这里 scope 必须有效
      response_type: "code",
    },
  },
  token: "https://gitee.com/oauth/token",
  userinfo: "https://gitee.com/api/v5/user",
  clientId: process.env.GITEE_CLIENT_ID,
  clientSecret: process.env.GITEE_CLIENT_SECRET,
  async profile(profile: GiteeProfile) {
    return {
      id: profile.id.toString(),
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar_url,
      login: profile.login,
    };
  },
} satisfies OAuthConfig<GiteeProfile>;

export async function handleGiteeLogin({
  account,
  profile,
}: {
  account: Account;
  profile: GiteeProfile;
}) {
  if (!account || account.provider !== "gitee") return;
  const provider = "gitee";
  const providerId = profile.id.toString();

  const tokenPayload = {
    accessToken: account.access_token || "",
    refreshToken: account.refresh_token || "",
    expiresAt: account.expires_at
      ? new Date(account.expires_at * 1000)
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  let user = profile.email
    ? await userService.findUserByUniqueKey(profile.email)
    : undefined;
  if (!user) {
    const randomSuffix = Math.floor(Math.random() * 1000);
    const name = `${profile.login}_user${randomSuffix}`;

    user = await userService.createUser({
      email: profile.email || "",
      name,
      avatar: profile.avatar_url,
    });
  }

  const existingOAuth = await oauthService.findUserOAuthAccount(
    user.id,
    provider,
    providerId,
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
