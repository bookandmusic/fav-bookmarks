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
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { UserProfileCard } from "@/components/user-profile";

const adminMenus = [
  {
    key: "dashboard",
    icon: <Icon icon="dashicons:dashboard" width={16} />,
    label: "仪表盘",
    path: "/admin/",
  },
  {
    key: "categories",
    icon: <Icon icon="dashicons:category" width={16} />,
    label: "分类",
    path: "/admin/categories",
  },
  {
    key: "tags",
    icon: <Icon icon="dashicons:tag" width={16} />,
    label: "标签",
    path: "/admin/tags",
  },
  {
    key: "bookmarks",
    icon: <Icon icon="bi:bookmark-dash-fill" width={16} />,
    label: "书签",
    path: "/admin/bookmarks",
  },
  {
    key: "projects",
    icon: <Icon icon="si:projects-fill" width={16} />,
    label: "项目",
    path: "/admin/projects",
  },
  {
    key: "users",
    icon: <Icon icon="dashicons:admin-users" width={16} />,
    label: "用户",
    path: "/admin/users",
  },
];

const Logo = ({
  collapsed,
  hiddenLogo,
}: {
  collapsed: boolean;
  hiddenLogo: boolean;
}) => (
  <Link
    href="/"
    className="h-16 flex items-center justify-center text-lg font-semibold bg-slate-100"
  >
    <Image src="/logo.svg" alt="logo" width={32} height={32} />
    {!hiddenLogo && !collapsed && (
      <span className="ml-2 md:block text-orange-500">FavBookmarks</span>
    )}
  </Link>
);

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
  const router = useRouter();
  const pathname = usePathname();
  const [menuKey, setMenuKey] = useState("dashboard");

  useEffect(() => {
    // 按 path 长度从长到短排序，确保精准匹配
    const sortedMenus = [...adminMenus].sort((a, b) =>
      b.path.localeCompare(a.path),
    );
    const matched = sortedMenus.find((item) => pathname.startsWith(item.path));
    if (matched) setMenuKey(matched.key);
  }, [pathname]);

  const renderMenu = (collapsed: boolean, hiddenLogo: boolean) => (
    <>
      <div className="h-full flex flex-col">
        <Logo collapsed={collapsed} hiddenLogo={hiddenLogo} />

        <Menu
          mode="inline"
          selectedKeys={[menuKey]}
          items={adminMenus}
          className="border-none"
          onClick={({ key }) => {
            setMenuKey(key);
            setOpen(false);
            const target = adminMenus.find((item) => item.key === key);
            if (target?.path) router.push(target.path);
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

          <Layout.Content className="m-4 overflow-auto rounded shadow h-[calc(100vh-64px)] bg-white">
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
