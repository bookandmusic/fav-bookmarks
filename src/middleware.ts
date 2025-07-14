import { withAuth } from 'next-auth/middleware';

// 定义公开路径（未登录也可以访问）
const publicPaths = ['/login', '/register'];
const staticFileExtensions = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webp',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.otf',
  '.json',
  '.map',
  '.txt',
];

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const pathname = req.nextUrl.pathname;
      if (pathname.includes('/webdav/')) {
        return true;
      }
      if (
        staticFileExtensions.some((extension) => pathname.endsWith(extension))
      ) {
        return true;
      }

      // 如果是公开路径，放行
      const isPublic = publicPaths.some(
        (path) => pathname === path || pathname.startsWith(path + '/')
      );
      if (isPublic) return true;

      // 否则要求登录（token 必须存在）
      return !!token;
    },
  },
  pages: {
    signIn: '/login', // 未登录跳转页面
  },
});

export const config = {};
