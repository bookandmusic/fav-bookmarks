import { getServerSession } from "next-auth";

import { Footer } from "@/components/layout/frontend/footer";
import { Header } from "@/components/layout/frontend/header";
import { UserProfileCard } from "@/components/user-profile";
import { authOptions } from "@/lib/auth/options";
import { userService } from "@/service/user";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = await userService.findUserByUniqueKey(session!.user.email);

  return (
    <>
      <div
        className="flex flex-col w-full h-full min-h-screen"
        style={{ backgroundImage: 'url("/bg.jpg")' }}
      >
        <Header userCard={<UserProfileCard user={user!} />} />
        <div className="flex flex-1 items-center justify-center">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}
