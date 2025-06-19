export interface BookmarkCreate {
  title: string;
  url: string;
  description?: string | null;
  icon?: string | null;
  categoryId: number;
  userId: number;
}

export interface BookmarkUpdate {
  title: string;
  url: string;
  description: string | null;
  icon: string | null;
  categoryId: number | null;
}

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

export interface BookmarkForm {
  title: string;
  url: string;
  description?: string | null;
  icon?: string | null;
  categoryId: number;
}
