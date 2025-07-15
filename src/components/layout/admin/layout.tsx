'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Icon } from '@iconify/react';
import { User } from '@prisma/client';
import {
  Avatar,
  ColorPicker,
  ConfigProvider,
  Drawer,
  Layout,
  Menu,
  Popover,
} from 'antd';

import { UserProfileCard } from '@/components/user/user-profile';

// ===========================
// key ↔ path 映射（固定菜单）
// ===========================
const keyToPath: Record<string, string> = {
  dashboard: '/admin/',
  categories: '/admin/categories',
  tags: '/admin/tags',
  bookmarks: '/admin/bookmarks',
  projects: '/admin/projects',
  profile: '/admin/profile',
};

const pathToKey: Record<string, string> = Object.fromEntries(
  Object.entries(keyToPath).map(([key, path]) => [path, key])
);

// ===========================
// 菜单定义
// ===========================
const adminMenus = [
  {
    key: 'dashboard',
    icon: <Icon icon="streamline:dashboard-3" width={16} />,
    label: '仪表盘',
    path: '/admin/',
  },
  {
    key: 'resources',
    icon: <Icon icon="gg:folder" width={16} />,
    label: '资源管理',
    children: [
      {
        key: 'categories',
        icon: <Icon icon="dashicons:category" width={16} />,
        label: '分类',
      },
      {
        key: 'tags',
        icon: <Icon icon="dashicons:tag" width={16} />,
        label: '标签',
      },
      {
        key: 'bookmarks',
        icon: <Icon icon="bi:bookmark-dash-fill" width={16} />,
        label: '书签',
      },
      {
        key: 'projects',
        icon: <Icon icon="si:projects-fill" width={16} />,
        label: '项目',
      },
    ],
  },
  {
    key: 'settings',
    icon: <Icon icon="rivet-icons:settings" width={16} />,
    label: '系统管理',
    children: [
      {
        key: 'profile',
        icon: <Icon icon="fluent:person-24-filled" width={16} />,
        label: '个人资料',
      },
    ],
  },
];

// ===========================
// Logo 组件
// ===========================
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

// ===========================
// 主布局组件
// ===========================
export function AdminLayout({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [primary, setPrimary] = useState('#1677ff');
  const router = useRouter();
  const pathname = usePathname();
  const [menuKey, setMenuKey] = useState('dashboard');

  // 根据 pathname 匹配 key
  useEffect(() => {
    const matchedPath = Object.keys(pathToKey)
      .sort((a, b) => b.length - a.length)
      .find((p) => pathname.startsWith(p));

    if (matchedPath) setMenuKey(pathToKey[matchedPath]);
  }, [pathname]);

  // 渲染菜单组件
  const renderMenu = (collapsed: boolean, hiddenLogo: boolean) => (
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
          const path = keyToPath[key];
          if (path) router.push(path);
        }}
      />
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: primary },
        components: {
          Layout: { headerBg: '#fff', siderBg: '#fff' },
          Menu: {
            colorBgContainer: '#fff',
            itemSelectedBg: primary,
            itemColor: '#000',
            itemSelectedColor: '#000',
          },
        },
      }}
    >
      <Layout className="h-screen w-full">
        {/* 移动端菜单 */}
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

        {/* PC 侧边栏 */}
        <Layout.Sider
          // eslint-disable-next-line unicorn/no-null
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="hidden md:block overflow-auto border-r border-gray-200"
        >
          {renderMenu(collapsed, true)}
        </Layout.Sider>

        {/* 主内容区域 */}
        <Layout>
          <div className="flex items-center h-16 w-full px-6 bg-white">
            <div
              className="hidden md:inline-flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Icon
                icon={collapsed ? 'gg:menu-left' : 'gg:menu-right'}
                width={24}
                height={24}
                style={{ verticalAlign: 'middle' }}
              />
            </div>
            <div
              className="inline-flex md:hidden"
              onClick={() => setOpen(true)}
            >
              <Icon icon="eva:menu-2-fill" width={24} height={24} />
            </div>

            {/* 右上角操作 */}
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
                  style={{ verticalAlign: 'middle' }}
                />
              </Popover>
            </div>
          </div>

          <Layout.Content className="overflow-auto border-t border-slate-200 h-[calc(100vh-64px)] bg-white p-6">
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
