"use client";
import { Icon } from "@iconify/react";
import { User } from "@prisma/client";
import {
  Avatar,
  ColorPicker,
  ConfigProvider,
  Drawer,
  Layout,
  Menu,
  Popover,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { UserProfileCard } from "@/components/user-profile";

const adminMeuns = [
  {
    key: 0,
    icon: <Icon icon={"dashicons:dashboard"} width={16} />,
    label: "仪表盘",
  },
  {
    key: 1,
    icon: <Icon icon={"dashicons:book-alt"} width={16} />,
    label: "书签",
  },
  {
    key: 2,
    label: "项目",
    icon: <Icon icon={"dashicons:index-card"} width={16} />,
  },
  {
    key: 3,
    label: "用户",
    icon: <Icon icon={"dashicons:admin-users"} width={16} />,
  },
];

const adminMenuMap: Record<string, string> = {
  "0": "/admin",
  "1": "/admin/bookmarks",
  "2": "/admin/projects",
  "3": "/admin/users",
};
export function AdminLayout({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [primary, setPrimary] = useState("#1677ff");
  const [menuKey, setMenuKey] = useState("0");
  const router = useRouter();
  const renderMenu = (collapsed: boolean, hiddenLogo: boolean) => (
    <>
      <div className="h-full flex flex-col">
        <Link
          href="/"
          className="h-16 flex items-center justify-center text-lg font-semibold bg-slate-100"
        >
          <Image src="/logo.svg" alt="logo" width={32} height={32} />
          {(!hiddenLogo || !collapsed) && (
            <span className="ml-2 md:block text-orange-500">FavBookmarks</span>
          )}
        </Link>

        <Menu
          mode="inline"
          selectedKeys={[menuKey]}
          items={adminMeuns}
          className="border-none"
          onClick={({ key }: { key: string }) => {
            setMenuKey(key);
            setOpen(false);
            const href = adminMenuMap[key];
            if (href) {
              router.push(href);
            }
          }}
        />
      </div>
    </>
  );

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: primary },
        components: {
          Layout: { headerBg: "#fff", siderBg: "#fff" },
          Menu: {
            colorBgContainer: "#fff",
            itemSelectedBg: primary,
            itemColor: "#000",
            itemSelectedColor: "#000",
          },
        },
      }}
    >
      <Layout className="h-screen w-full">
        {/* 移动端抽屉菜单 */}
        <Drawer
          placement="left"
          onClose={() => setOpen(false)}
          open={open}
          closable={false}
          className="block md:hidden"
          styles={{ body: { padding: 0 } }}
        >
          {renderMenu(collapsed, false)}
        </Drawer>

        {/* PC 端侧边栏菜单 */}
        <Layout.Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="hidden md:block overflow-auto border-r border-gray-200"
        >
          {renderMenu(collapsed, true)}
        </Layout.Sider>

        <Layout>
          <Layout.Header className="flex items-center px-1 h-16 w-full">
            {/* 展开/收起图标 */}
            <div
              className="hidden md:inline-flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Icon
                icon={collapsed ? "gg:menu-left" : "gg:menu-right"}
                width={24}
                height={24}
              />
            </div>
            <div
              className="inline-flex md:hidden"
              onClick={() => setOpen(true)}
            >
              <Icon icon="eva:menu-2-fill" width={24} height={24} />
            </div>

            {/* 右侧操作 */}
            <div className="flex items-center gap-3 ms-auto">
              <ColorPicker
                size="small"
                value={primary}
                onChange={(color) => setPrimary(color.toHexString())}
              />
              <Popover
                content={<UserProfileCard user={user} />}
                placement="topRight"
              >
                <Avatar
                  size={32}
                  icon={<Icon icon="radix-icons:avatar" width={32} />}
                />
              </Popover>
            </div>
          </Layout.Header>

          <Layout.Content className="m-6 p-6 overflow-auto rounded shadow h-[calc(100vh-64px)]">
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
