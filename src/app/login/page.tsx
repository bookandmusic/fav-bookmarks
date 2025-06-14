import { LoginCard } from "@/components/form";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // ✅ 正确处理异步searchParams
  const params = await searchParams;
  const error = params.error;
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
