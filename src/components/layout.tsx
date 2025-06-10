"use client";
import { Icon } from "@iconify/react";
import { ColorPicker, ConfigProvider, Drawer, Layout, Menu } from "antd";
import Image from "next/image";
import React, { useState } from "react";

import { LayoutProvider, useLayoutContext } from "@/hooks/useLayoutContext";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useErrorNotification } from "@/hooks/useNotification";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { primary, setPrimary, menuKey, setMenuKey } = useLayoutContext();
  const { menuItems, error } = useMenuItems();
  const contextHolder = useErrorNotification(error);

  const { Header, Sider, Content } = Layout;

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
        <Drawer
          title="导航菜单"
          placement="left"
          onClose={() => setOpen(false)}
          open={open}
          className="block md:hidden"
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            mode="inline"
            selectedKeys={[menuKey]}
            items={menuItems}
            className="border-none"
            onClick={({ key }) => {
              setMenuKey(key);
              setOpen(false);
            }}
          />
        </Drawer>

        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="hidden md:block overflow-auto border-r border-gray-200"
        >
          <div className="h-16 flex items-center justify-center text-lg font-semibold">
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            {!collapsed && <span className="ml-2 md:block">FavBookmarks</span>}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[menuKey]}
            items={menuItems}
            className="border-none"
            onClick={({ key }) => setMenuKey(key)}
          />
        </Sider>

        <Layout className="w-full">
          <Header className="flex items-center px-1 h-16 w-full">
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
            <div className="flex items-center gap-3 ms-auto">
              <ColorPicker
                size="small"
                value={primary}
                onChange={(color) => setPrimary(color.toHexString())}
              />
            </div>
          </Header>

          <Content className="m-6 p-6 overflow-auto rounded shadow h-[calc(100vh-64px)]">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  );
}
