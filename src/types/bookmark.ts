export interface Bookmark {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  description: string | null;
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
  description?: string | null;
  icon?: string | null;
  categoryId: number;
}

export type BookmarkFormFields = {
  title: string;
  url: string;
  description?: string | null;
  icon?: string | null;
  categoryId: number[];
};

export interface BookmarkCreate extends BookmarkFormValue {
  userId: number;
}

export interface BookmarkSearchFormValue {
  keyword: string | null;
  categoryId: number | null;
  isPublic: boolean | null;
}
