import BookmarkFavNav from '@/frontend/components/bookmark-nav/nav';
import { getBookmarkCategoryData } from '@/frontend/lib/utilities';

export default async function BookmarkNav() {
  const { categories, bookmarks } = await getBookmarkCategoryData();
  return (
    <BookmarkFavNav
      categories={categories}
      bookmarks={bookmarks}
    ></BookmarkFavNav>
  );
}
