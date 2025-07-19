import { authenticateRequest } from '@/admin/lib/auth/auth-middleware';
import { replaceNullWithUndefined } from '@/admin/lib/null-to-undefined';
import { bookmarkService } from '@/admin/services/bookmark';
import { categoryService } from '@/admin/services/category';
import { Bookmark } from '@/admin/types/bookmark/base';
import { Category } from '@/admin/types/category/base';

export async function getBookmarkCategoryData() {
  try {
    const userId = await authenticateRequest();
    const bookmarks = await bookmarkService.findPublicMany({ userId });
    const categories = await categoryService.findPublicMany({ userId });

    // 获取所有有效的 category ID
    const categoryIds = new Set(categories.map((c) => c.id));
    // 过滤掉 categoryId 无效的书签
    const validBookmarks = bookmarks.filter(
      (bookmark) =>
        bookmark.categoryId !== null && categoryIds.has(bookmark.categoryId)
    );

    const transformedBookmarks = replaceNullWithUndefined(validBookmarks);
    const transformedCategories = replaceNullWithUndefined(categories);

    return {
      categories: transformedCategories as Category[],
      bookmarks: transformedBookmarks as Bookmark[],
    };
  } catch {
    return {
      categories: [] as Category[],
      bookmarks: [] as Bookmark[],
    };
  }
}
