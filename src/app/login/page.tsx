import { LoginCard } from '@/admin/components/user/login-card';
import { BaseLayout } from '@/frontend/components/layout/base';

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
