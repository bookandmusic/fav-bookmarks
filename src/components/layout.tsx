"use client";
import React, { createContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ConfigProvider,
  ColorPicker,
  Layout,
  Menu,
  theme,
  Drawer,
  MenuTheme,
} from "antd";
import { Icon } from "@iconify/react";

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
  dark: boolean;
  color: string;
  bgColor: string;
  primary: string;
  menuKey: string;
  setDark: (value: boolean) => void;
  setColor: (value: string) => void;
  setBgColor: (value: string) => void;
  setPrimary: (value: string) => void;
  setMenuKey: (value: string) => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  dark: false,
  color: "#000",
  bgColor: "#fff",
  primary: "#1677ff",
  menuKey: "1",
  setDark: () => {},
  setColor: () => {},
  setBgColor: () => {},
  setPrimary: () => {},
  setMenuKey: () => {},
});

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [bgColor, setBgColor] = useState("#fff");
  const [color, setColor] = useState("#000");
  const [primary, setPrimary] = useState("#1677ff");
  const [open, setOpen] = useState(false);
  const [menuKey, setMenuKey] = useState("1");
  const [mode, setMode] = useState<MenuTheme>("light");

  const contextValue = useMemo(
    () => ({
      dark,
      setDark,
      color,
      setColor,
      bgColor,
      setBgColor,
      primary,
      setPrimary,
      menuKey,
      setMenuKey,
    }),
    [dark, color, bgColor, primary, menuKey]
  );
  useEffect(() => {
    setBgColor(dark ? "#001529" : "#fff");
    setColor(dark ? "#fff" : "#000");
    setMode(dark ? "dark" : "light");
  }, [dark]);

  return (
    <LayoutContext.Provider value={contextValue}>
      <ConfigProvider
        theme={{
          algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: { colorPrimary: primary },
          components: {
            Layout: { headerBg: bgColor, siderBg: bgColor },
            Menu: {
              colorBgContainer: bgColor,
              itemSelectedBg: primary,
              itemColor: color,
              itemSelectedColor: color,
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
              theme={mode}
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
                <span className="ml-2 md:block" style={{ color: color }}>
                  FavBookmarks
                </span>
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
                <div
                  onClick={() => {
                    setDark(!dark);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    icon="streamline-ultimate-color:light-mode-bright-dark"
                    width={24}
                    height={24}
                  />
                </div>
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
