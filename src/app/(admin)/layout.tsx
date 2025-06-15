import { getServerSession } from "next-auth";

import { AdminLayout } from "@/components/layout/admin/layout";
import { authOptions } from "@/lib/auth/options";
import { userService } from "@/service/user";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = await userService.findUserByUniqueKey(session!.user.email);
  return <AdminLayout user={user!}>{children}</AdminLayout>;
}
