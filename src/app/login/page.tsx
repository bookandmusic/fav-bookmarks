import LoginPage from "./content";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // ✅ 正确处理异步searchParams
  const params = await searchParams;
  const error = params.error;

  return <LoginPage error={error} />;
}
