import BookmarkFolder from '@/frontend/components/bookmark-nav/bookmark-folder';
import { getBookmarkCategoryData } from '@/frontend/lib/utilities';

export default async function BookmarkNav() {
  const { categories, bookmarks } = await getBookmarkCategoryData();
  return <BookmarkFolder categories={categories} bookmarks={bookmarks} />;
}
