import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FavBookmarks",
  description: "收藏夹管理网站",
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
