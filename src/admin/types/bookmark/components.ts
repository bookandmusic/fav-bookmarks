import { CateType } from '../category/base';

export interface BookmarkSearchFormValue {
  keyword?: string;
  categoryId?: number;
  isPublic?: boolean;
  isDeleted?: boolean;
}

export interface BookmarkNode {
  name: string;
  icon?: string;
  isPublic: boolean;
  type: CateType;
  bookmarks: {
    title: string;
    url: string;
    icon?: string;
    isPublic?: boolean;
    description?: string;
  }[];
  children?: BookmarkNode[];
}
