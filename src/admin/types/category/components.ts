import { Category } from './base';

export interface CategoryNode extends Category {
  label: string;
  value: number;
  children: CategoryNode[];
}
