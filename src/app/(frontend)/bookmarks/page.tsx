import BookmarkFolder from '@/components/bookmark-nav/bookmark-folder';
import { getBookmarkCategoryData } from '@/components/bookmark-nav/utilities';

export default async function BookmarkNav() {
  const { categories, bookmarks } = await getBookmarkCategoryData();
  return <BookmarkFolder categories={categories} bookmarks={bookmarks} />;
}
