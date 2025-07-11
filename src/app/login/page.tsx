import { BaseLayout } from "@/components/layout/base";
import { LoginCard } from "@/components/user/login-card";
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
      <BaseLayout>
        <LoginCard error={error} />
      </BaseLayout>
    </>
  );
}
