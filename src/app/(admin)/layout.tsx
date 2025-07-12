import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { AdminLayout } from '@/components/layout/admin/layout';
import { authOptions } from '@/lib/auth/options';
import { userService } from '@/services/user';

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
