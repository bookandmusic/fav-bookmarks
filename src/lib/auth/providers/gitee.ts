import { OAuthConfig } from 'next-auth/providers/oauth';

export interface GiteeProfile {
  id: number;
  name: string;
  login: string;
  email: string;
  phone: string;
  avatar_url: string;
}

export const giteeProvider = {
  id: 'gitee',
  name: 'Gitee',
  type: 'oauth',
  authorization: {
    url: 'https://gitee.com/oauth/authorize',
    params: {
      scope: 'user_info', // ✅ 注意这里 scope 必须有效
      response_type: 'code',
    },
  },
  token: 'https://gitee.com/oauth/token',
  userinfo: 'https://gitee.com/api/v5/user',
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
