import { bookmarkService } from '@/admin/services/bookmark';
import { categoryService } from '@/admin/services/category';
import { BookmarkNode } from '@/admin/types/bookmark/components';

import { fetchMetadata, MetadataResult } from './fetch-metadata';

// 递归保存 BookmarkNode 结构
export async function saveBookmarkNodes(
  nodes: BookmarkNode[],
  userId: number,
  parentId?: number
) {
  for (const node of nodes) {
    // 插入分类并拿到 id
    const category = await categoryService.get_or_create({
      name: node.name,
      pid: parentId,
      type: node.type,
      isPublic: node.isPublic,
      userId,
    });

    // 拿到主键 id
    const categoryId = category.id;

    // 插入该分类下的书签，关联 categoryId
    if (node.bookmarks?.length) {
      await Promise.all(
        node.bookmarks.map(async (bm) => {
          let meta: MetadataResult | undefined;
          try {
            meta = await fetchMetadata(bm.url);
          } catch {}
          const bookmark = {
            ...bm,
            title: meta?.title || bm.title,
            icon: meta?.icon,
            description: meta?.description,
            categoryId: category.id,
            userId,
            isDeleted: false,
          };
          await bookmarkService.create_or_update(bookmark);
        })
      );
    }

    // 递归插入子分类，传入当前分类 id 作为父级
    if (node.children?.length) {
      await saveBookmarkNodes(node.children, userId, categoryId);
    }
  }
}
