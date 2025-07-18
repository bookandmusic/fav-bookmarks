import { CateType } from './base';

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
