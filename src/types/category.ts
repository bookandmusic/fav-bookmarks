export const CateType = {
  Project: "Project",
  BookMark: "BookMark",
} as const;

export type CateType = "Project" | "BookMark";

export interface CategoryCreate {
  name: string;
  icon: string | null;
  isPublic: boolean;
  userId: number;
  type: CateType;
  pid: number | null;
}

export interface CategoryUpdate {
  name: string | undefined;
  icon: string | undefined | null;
  isPublic: boolean | undefined;
  pid: number | undefined | null;
}

export interface Category {
  id: number;
  name: string;
  icon: string | null;
  pid: number | null;
}

export interface CategoryNode extends Category {
  title: string;
  key: string;
  children: CategoryNode[];
}
