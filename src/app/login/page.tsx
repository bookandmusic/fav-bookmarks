import { BaseLayout } from '@/components/layout/base';
import { LoginCard } from '@/components/user/login-card';
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // ✅ 正确处理异步searchParams
  const parameters = await searchParams;
  const error = parameters.error;
  return (
    <>
      <BaseLayout>
        <LoginCard error={error} />
      </BaseLayout>
    </>
  );
}
