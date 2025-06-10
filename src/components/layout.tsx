"use client";
import { Icon } from "@iconify/react";
import { ColorPicker, ConfigProvider, Drawer, Layout, Menu } from "antd";
import Image from "next/image";
import React, { createContext, useMemo, useState } from "react";

const { Header, Sider, Content } = Layout;

const items = [
  {
    key: "1",
    icon: <Icon icon="streamline-plump-color:home-1" />,
    label: "nav 1",
    children: [
      {
        key: "1-1",
        icon: <Icon icon="streamline-color:folder-1" />,
        label: "nav 1-1",
      },
      {
        key: "1-2",
        icon: <Icon icon="streamline-color:folder-2" />,
        label: "nav 1-2",
      },
      {
        key: "1-3",
        icon: <Icon icon="streamline-color:folder-3" />,
        label: "nav 1-3",
      },
      {
        key: "1-4",
        icon: <Icon icon="streamline-color:folder-4" />,
        label: "nav 1-4",
      },
    ],
  },
  {
    key: "2",
    icon: <Icon icon="streamline-flex-color:search-category-flat" />,
    label: "nav 2",
  },
  {
    key: "3",
    icon: <Icon icon="streamline-plump-color:tag-alt" />,
    label: "nav 3",
  },
];

interface LayoutContextType {
  primary: string;
  menuKey: string;
  setPrimary: (value: string) => void;
  setMenuKey: (value: string) => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  primary: "#1677ff",
  menuKey: "1",
  setPrimary: () => {},
  setMenuKey: () => {},
});

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [primary, setPrimary] = useState("#1677ff");
  const [open, setOpen] = useState(false);
  const [menuKey, setMenuKey] = useState("1");

  const contextValue = useMemo(
    () => ({
      primary,
      setPrimary,
      menuKey,
      setMenuKey,
    }),
    [primary, menuKey],
  );

  return (
    <LayoutContext.Provider value={contextValue}>
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
          {/* Drawer：移动端可见 */}
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
              defaultSelectedKeys={["1"]}
              items={items}
              className="border-none"
              onClick={({ key }: { key: string }) => {
                setMenuKey(key);
                setOpen(false);
              }}
            />
          </Drawer>

          {/* Sider：PC端可见 */}
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="hidden md:block overflow-auto border-r border-gray-200"
          >
            <div className="h-16 flex items-center justify-center text-lg font-semibold">
              <Image src="/logo.png" alt="logo" width={32} height={32} />
              {!collapsed && (
                <span className="ml-2 md:block">FavBookmarks</span>
              )}
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={items}
              className="border-none"
              onClick={({ key }: { key: string }) => {
                setMenuKey(key);
              }}
            />
          </Sider>

          <Layout className="w-full">
            <Header className="flex items-center px-1 h-16 w-full">
              {/* PC 端折叠按钮 */}
              <div className="hidden md:inline-flex">
                <div
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {collapsed ? (
                    <Icon icon="gg:menu-left" width={24} height={24} />
                  ) : (
                    <Icon icon="gg:menu-right" width={24} height={24} />
                  )}
                </div>
              </div>

              {/* Mobile 端 Drawer 按钮 */}
              <div
                className="inline-flex md:hidden"
                onClick={() => setOpen(true)}
              >
                <Icon icon="eva:menu-2-fill" width={24} height={24} />
              </div>

              {/* 右对齐 */}
              <div className="flex items-center gap-3 ms-auto ">
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
    </LayoutContext.Provider>
  );
}
