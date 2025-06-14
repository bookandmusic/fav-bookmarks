import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { UserProfileCard } from "@/components/user-profile";
import { authOptions } from "@/lib/auth/options";
import { homeItems } from "@/lib/menu";
import { userService } from "@/service/user";

export default async function Home() {
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
          <div className="flex flex-wrap justify-center gap-6 px-4 py-6">
            {homeItems.map((item) => (
              <Link href={item.href} key={item.key}>
                <Card
                  hoverable
                  className="w-[260px]"
                  cover={
                    <Image
                      width={260}
                      height={260}
                      className="object-cover"
                      alt={item.title}
                      src={item.cover}
                    />
                  }
                >
                  <Meta title={item.title} description={item.description} />
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
