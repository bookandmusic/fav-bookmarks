import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@iconify/react';
import { Avatar, Button, Dropdown, Popover } from 'antd';

import { headerMenuItems } from '@/lib/menu';

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

export function Header({ userCard }: { userCard: React.ReactNode }) {
  return (
    <header className="flex justify-between bg-gray-100 px-4 py-2">
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
          <Popover placement="bottomRight" content={userCard}>
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
        </div>
      </div>
    </header>
  );
}
