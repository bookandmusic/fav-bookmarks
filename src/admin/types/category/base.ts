export const CateType = {
  Project: 'Project',
  BookMark: 'BookMark',
} as const;

export type CateType = 'Project' | 'BookMark';

export interface Category {
  id: number;
  name: string;
  icon?: string;
  pid?: number;
  isPublic: boolean;
  type: CateType;
}
