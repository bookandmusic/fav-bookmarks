"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import InnerLayout from "@/components/layout";
import { FullScreenOverlay } from "@/components/loading";
import { useLayoutContext } from "@/hooks/useLayoutContext";

// 实际页面内容组件
export default function Home() {
  const { menuKey, primary } = useLayoutContext();
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "authenticated" && data?.user) {
    return (
      <InnerLayout user={data.user}>
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          分类{menuKey}-颜色{primary}
        </div>
      </InnerLayout>
    );
  }
  return (
    <>
      <FullScreenOverlay />
    </>
  );
}
