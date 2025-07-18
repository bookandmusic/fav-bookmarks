import { withAuth } from 'next-auth/middleware';

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
      const { pathname } = req.nextUrl;

      // 放行 webdav 路径
      if (pathname.includes('/webdav/')) return true;

      // 放行静态资源
      if (
        staticFileExtensions.some((extension) => pathname.endsWith(extension))
      )
        return true;

      // 放行公开路径
      const isPublic = publicPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
      );
      if (isPublic) return true;
      if (pathname.startsWith('/api') || pathname.startsWith('/admin'))
        return !!token;
      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export const config = {};
