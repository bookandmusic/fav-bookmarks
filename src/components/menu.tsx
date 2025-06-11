import { Icon } from "@iconify/react";
import { Menu, Tooltip } from "antd";
import Image from "next/image";
import React from "react";

import { CategoryList, MenuList } from "@/types/menu";

// 转换分类数据为菜单数据
export function cateToMenu(cate: CategoryList): MenuList {
  return cate.map((item) => ({
    key: item.id,
    label: item.name,
    icon: (
      <Icon
        icon={
          item.icon ||
          (item.children ? "mdi:folder" : "iconamoon:category-thin")
        }
      />
    ),
    children: item.children ? cateToMenu(item.children) : undefined,
  }));
}

export function toMenuItems(categoryList: CategoryList) {
  return cateToMenu(categoryList);
}

export function CategoryMenu({
  menuItems,
  hiddenLogo,
  collapsed,
  menuKey,
  primary,
  onClick,
}: {
  menuItems: MenuList;
  hiddenLogo: boolean;
  collapsed: boolean;
  menuKey: string;
  primary: string;
  onClick: ({ key }: { key: string }) => void;
}) {
  const renderLogo = () => (
    <div className="h-16 flex items-center justify-center text-lg font-semibold bg-slate-100">
      <Image src="/logo.svg" alt="logo" width={32} height={32} />
      {(!hiddenLogo || !collapsed) && (
        <span className="ml-2 md:block">FavBookmarks</span>
      )}
    </div>
  );

  const AllCategory = (
    <div
      className={`flex py-2 px-6 items-center justify-start hover:bg-gray-100 cursor-pointer rounded-md ${
        menuKey === "0" ? "text-white" : ""
      }`}
      onClick={() => onClick({ key: "0" })}
      style={{
        backgroundColor: menuKey === "0" ? primary : undefined,
        color: "black",
      }}
    >
      <div>
        <Icon
          icon="material-symbols-light:select-all"
          width={collapsed ? 22 : 18}
        />
      </div>
      {!collapsed && <div className="w-full px-3">全部类别</div>}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {renderLogo()}
      <div className="w-full p-1">
        {collapsed ? (
          <Tooltip placement="right" title="全部类别">
            {AllCategory}
          </Tooltip>
        ) : (
          AllCategory
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          selectedKeys={[menuKey]}
          items={menuItems}
          className="border-none"
          onClick={onClick}
        />
      </div>
    </div>
  );
}
