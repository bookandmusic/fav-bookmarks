import { Account } from 'next-auth';

import { oauthService } from '@/services/oauth';
import { userService } from '@/services/user';

export type OAuthProfile = {
  id: string | number;
  login: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  provider: string;
};

export async function handleOAuthLogin({
  account,
  profile,
}: {
  account: Account;
  profile: OAuthProfile;
}) {
  const providerId = profile.id.toString();
  const provider = account.provider;
  const tokenPayload = {
    accessToken: account.access_token || '',
    refreshToken: account.refresh_token || '',
    expiresAt: account.expires_at
      ? new Date(account.expires_at * 1000)
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  //   查找是否绑定过
  const existingOAuth = await oauthService.findUserOAuthAccount(
    provider,
    providerId
  );

  if (existingOAuth) {
    await oauthService.updateUserOAuthAccount({
      id: existingOAuth.id,
      data: tokenPayload,
    });
    return;
  }

  //   未绑定
  const email = profile.email;
  const phone = profile.phone;
  let user = email ? await userService.findUserByUniqueKey(email) : undefined;

  if (!user && phone) {
    user = await userService.findUserByUniqueKey(phone);
  }

  if (!user) {
    const randomSuffix = Math.floor(Math.random() * 1000);
    const name = `${profile.login}_user${randomSuffix}`;
    const randomPassword = Math.random().toString(36).slice(-8);
    user = await userService.createUser({
      email: email || '',
      name,
      password: randomPassword,
      phone: phone || '',
      avatar: profile.avatar_url,
    });
  }

  await oauthService.createUserOAuthAccount({
    provider,
    providerId,
    userId: user.id,
    ...tokenPayload,
  });
}
