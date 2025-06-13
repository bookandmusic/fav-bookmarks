import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginCard } from "@/components/form";
import { authOptions } from "@/lib/auth/options";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // ✅ 正确处理异步searchParams
  const params = await searchParams;
  const error = params.error;
  // 获取session
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/");
  }
  return (
    <>
      <div
        className="w-full h-full min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url(/bg.jpg)",
        }}
      >
        <LoginCard error={error} />
      </div>
    </>
  );
}
