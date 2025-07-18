import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { AdminLayout } from '@/admin/components/layout/layout';
import { authOptions } from '@/admin/lib/auth/options';
import { userService } from '@/admin/services/user';

import '@ant-design/v5-patch-for-react-19';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  const user = await userService.findUserByUniqueKey(session.user.name);
  if (!user) {
    redirect('/login');
  }
  return <AdminLayout user={user!}>{children}</AdminLayout>;
}
