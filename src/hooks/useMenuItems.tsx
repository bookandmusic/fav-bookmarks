import { Icon } from "@iconify/react";
import { useMemo } from "react";

import { useCategory } from "@/hooks/useCategory";
import { CategoryList, MenuList } from "@/types/menu";

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

export function useMenuItems() {
  const { categoryList, error } = useCategory();

  const menuItems = useMemo(() => {
    const menus = cateToMenu(categoryList);
    menus.unshift({
      key: "0",
      label: "全部类别",
      icon: <Icon icon="material-symbols-light:select-all" />,
    });
    return menus;
  }, [categoryList]);

  return { menuItems, error };
}
