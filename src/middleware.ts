import { withAuth } from "next-auth/middleware";

// 定义公开路径（未登录也可以访问）
const publicPaths = ["/login", "/register"];

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const pathname = req.nextUrl.pathname;

      // 如果是公开路径，放行
      const isPublic = publicPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
      );
      if (isPublic) return true;

      // 否则要求登录（token 必须存在）
      return !!token;
    },
  },
  pages: {
    signIn: "/login", // 未登录跳转页面
  },
});

export const config = {
  matcher: [
    // 拦截所有 HTML 页面请求（排除静态资源）
    "/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2|ttf|eot|otf|js|ts|css|map)).*)",
  ],
};
