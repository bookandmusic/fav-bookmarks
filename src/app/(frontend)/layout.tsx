import { getServerSession } from 'next-auth';

import { User } from '@prisma/client';

import { authOptions } from '@/admin/lib/auth/options';
import { userService } from '@/admin/services/user';
import { RootLayout } from '@/frontend/components/layout/layout';

import '@ant-design/v5-patch-for-react-19';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | undefined;
  const session = await getServerSession(authOptions);
  if (session) {
    const object = await userService.findUserByUniqueKey(session.user.name);
    if (object) {
      user = object;
    }
  }
  return <RootLayout user={user}>{children} </RootLayout>;
}
