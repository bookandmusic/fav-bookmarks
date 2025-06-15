import { LoginCard } from "@/components/form";
import { BaseLayout } from "@/components/layout/base";
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
