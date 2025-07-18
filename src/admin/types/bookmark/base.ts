export interface Bookmark {
  id: number;
  title: string;
  url: string;
  icon?: string;
  isPublic?: boolean;
  description?: string;
  categoryId: number;
}

export interface BookmarResponse {
  data: Bookmark[];
  pagination: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}
