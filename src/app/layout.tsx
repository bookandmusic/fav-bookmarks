import "@ant-design/v5-patch-for-react-19";
import "./globals.css";

import type { Metadata } from "next";

import { ProvidreLayout } from "@/components/provider";

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
      <body className="antialiased">
        <ProvidreLayout>{children}</ProvidreLayout>
      </body>
    </html>
  );
}
