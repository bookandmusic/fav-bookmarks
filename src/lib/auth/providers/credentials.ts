import { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { userService } from '@/services/user';

export const credentialsProvider = CredentialsProvider({
  name: 'credentials',
  credentials: {
    name: { label: 'Name', type: 'text' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials): Promise<User | null> {
    if (!credentials?.name || !credentials?.password) {
      throw new Error('凭证缺失');
    }

    const user = await userService.findUserByUniqueKey(credentials.name);
    if (
      !user ||
      !user.password ||
      !(await userService.validatePassword(
        { password: user.password! },
        credentials.password
      ))
    ) {
      throw new Error('无效的凭证');
    }

    return {
      id: user.id.toString(),
      email: user.email ?? '',
      name: user.username ?? '',
      role: user.role,
    };
  },
});
