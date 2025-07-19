import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@iconify/react';
import { User } from '@prisma/client';
import { Avatar, Button, Dropdown, Popover } from 'antd';

import { UserProfileCard } from '@/admin/components/user/user-profile';

export const headerMenuItems = [
  {
    key: '0',
    title: '首页',
    href: '/',
    icon: 'fluent-color:home-16',
  },
  {
    key: '1',
    title: '收藏夹',
    href: '/bookmarks',
    icon: 'fluent-color:bookmark-20',
  },
  {
    key: '2',
    title: '项目集',
    href: '/projects',
    icon: 'material-icon-theme:folder-project',
  },
];

// 统一菜单项样式类
const menuItemClass =
  'text-sm flex items-center gap-1.5 px-2 py-1.5 rounded-md';

const menuItems = headerMenuItems.map((item) => {
  return {
    key: item.key,
    label: (
      <Link href={item.href} className={menuItemClass} key={item.key}>
        <Icon
          icon={item.icon}
          width={16}
          className="shrink-0"
          style={{ verticalAlign: 'middle' }}
        />
        <span className="leading-none">{item.title}</span>
      </Link>
    ),
  };
});

export function Header({ user }: { user?: User }) {
  return (
    <header className="flex justify-between bg-gray-100 px-4 py-2 h-12">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="FavBookmarks"
            width={32}
            height={32}
            className="mr-2"
            priority
          />
        </Link>
        <h1 className="text-2xlfont-bold">FavBookmarks</h1>
      </div>
      <div className="flex space-around md:space-x-4">
        <div className="hidden sm:flex space-around items-center">
          {menuItems?.map((item) => item.label)}
        </div>
        <div className="sm:hidden">
          <Dropdown menu={{ items: menuItems }} placement="topRight" arrow>
            <Button
              type="text"
              icon={
                <Icon
                  icon="solar:menu-dots-bold"
                  style={{ verticalAlign: 'middle' }}
                />
              }
            ></Button>
          </Dropdown>
        </div>

        <div className="flex items-center">
          {user && (
            <Popover
              placement="bottomRight"
              content={<UserProfileCard user={user} />}
            >
              <Avatar
                size={24}
                icon={
                  <Icon
                    icon="radix-icons:avatar"
                    width={20}
                    style={{ verticalAlign: 'middle' }}
                  />
                }
              />
            </Popover>
          )}
          {!user && (
            <Link href="/login">
              <Avatar
                style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
                size={35}
              >
                登录
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
