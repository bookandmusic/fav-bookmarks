export interface Category {
  id: number;
  name: string;
  icon: string | null;
  pid: number | null;
  user_id: number;
  children?: Category[]; // 支持子分类
}

export type CategoryList = Category[];

export interface MenuItem {
  key: number;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[]; // 支持子菜单
}

export type MenuList = MenuItem[];

export interface LayoutContextType {
  primary: string;
  menuKey: string;
  setPrimary: (value: string) => void;
  setMenuKey: (value: string) => void;
}
