"use client";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  ColorPicker,
  ConfigProvider,
  Drawer,
  Layout,
  Popover,
} from "antd";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import React, { useMemo, useState } from "react";

import { useCategory } from "@/hooks/useCategory";
import { useLayoutContext } from "@/hooks/useLayoutContext";
import { useErrorNotification } from "@/hooks/useNotification";

import { CategoryMenu, toMenuItems } from "./menu";

// UserInfoItem 组件
const UserInfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <dt className="text-gray-500 font-medium">{label}</dt>
    <dd className="text-right">{value}</dd>
  </div>
);

const UserProfile = ({ user }: { user: User }) => {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    signOut({ redirect: true, callbackUrl: "/login" });
  };
  const handleAdmin = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    router.push("/admin");
  };
  return (
    <div className="p-4">
      <dl className="space-y-2">
        <UserInfoItem label="名字:" value={user.name} />
        <UserInfoItem label="身份:" value={user.role || "User"} />
        <UserInfoItem label="邮箱:" value={user.email} />
      </dl>
      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
        <Button icon={<Icon icon="mynaui:logout" />} onClick={handleLogout}>
          退出
        </Button>
        <Button
          icon={<Icon icon="weui:setting-outlined" />}
          onClick={handleAdmin}
        >
          后台
        </Button>
      </div>
    </div>
  );
};

export default function InnerLayout({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { primary, setPrimary, menuKey, setMenuKey } = useLayoutContext();
  const { categoryList, error } = useCategory();
  const contextHolder = useErrorNotification(error);

  const menuItems = useMemo(() => toMenuItems(categoryList), [categoryList]);

  const renderMenu = (collapsed: boolean, hiddenLogo: boolean) => (
    <CategoryMenu
      menuItems={menuItems}
      collapsed={collapsed}
      hiddenLogo={hiddenLogo}
      menuKey={menuKey}
      primary={primary}
      onClick={({ key }: { key: string }) => {
        setMenuKey(key);
        setOpen(false);
      }}
    />
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
      {contextHolder}
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
                content={<UserProfile user={user} />}
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
