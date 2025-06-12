"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { FullScreenOverlay } from "@/components/loading"; // 确保该组件存在

export default function LoginPage({ error: initialError }: { error?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }

    if (initialError) {
      const errorMap: Record<string, string> = {
        OAuthAccountNotLinked:
          "该 GitHub 账号已绑定其他登录方式，请使用原方式登录",
        AccessDenied: "访问被拒绝，请重试",
      };
      setError(errorMap[initialError] || "GitHub 登录失败，请稍后再试");
    }
  }, [status, router, initialError]);

  const handleEmailLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push("/");
      }
    } catch {
      setError("登录失败");
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError("");
    await signIn("github", { callbackUrl: "/" });
  };
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {isLoading && <FullScreenOverlay />}
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="邮箱"
                  autoFocus
                />
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? "隐藏" : "显示"}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  handleEmailLogin();
                }}
              >
                登录
              </button>
            </div>
          </form>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                忘记密码？
              </a>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                注册账号
              </a>
            </div>
          </div>
          <div className="text-sm flex items-center justify-center">
            其它社交帐号直接登录
          </div>
          <div className="mt-6 w-full flex items-center justify-center">
            <button
              type="button"
              onClick={handleGitHubLogin}
              className=" px-4 py-2 border border-gray-300 shadow-sm"
            >
              <Icon icon="mdi:github" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <FullScreenOverlay />
    </>
  );
}
