export interface BookmarkFormValue {
  title: string;
  url: string;
  description?: string | null;
  icon?: string | null;
  categoryId: number;
  isPublic?: boolean;
  isDeleted?: boolean;
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
