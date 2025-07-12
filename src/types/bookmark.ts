export interface Bookmark {
  id: number;
  title: string;
  url: string;
  icon?: string;
  isPublic?: boolean;
  description?: string;
  categoryId: number;
}

export type BookmarkList = Bookmark[];

export interface BookmarResponse {
  data: BookmarkList;
  pagination: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

export interface BookmarkFormValue {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  categoryId: number;
  isPublic?: boolean;
}

export type BookmarkFormFields = {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  isPublic?: boolean;
  categoryId: number[];
};

export interface BookmarkCreate extends BookmarkFormValue {
  userId: number;
}

export interface BookmarkSearchFormValue {
  keyword?: string;
  categoryId?: number;
  isPublic?: boolean;
}
