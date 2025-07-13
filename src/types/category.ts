export const CateType = {
  Project: 'Project',
  BookMark: 'BookMark',
} as const;

export type CateType = 'Project' | 'BookMark';

export interface CategoryFormValue {
  name: string;
  icon?: string | null;
  isPublic: boolean;
  type: CateType;
  pid?: number | null;
}

export type CategoryFormFields = {
  name: string;
  pid?: number[];
  icon?: string;
  isPublic: boolean;
  type: CateType;
};

export interface CategoryCreate extends CategoryFormValue {
  userId: number;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  pid?: number;
  isPublic: boolean;
  type: CateType;
}

export interface CategoryNode extends Category {
  label: string;
  value: number;
  children: CategoryNode[];
}
