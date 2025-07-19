'use client';
import { useMemo } from 'react';

import { Bookmark } from '@/admin/types/bookmark/base';
import { Category } from '@/admin/types/category/base';

import { ContentHeight } from '../../const';
import { BookmarkCard, FolderNode } from './bookmark-card';

function useBookmarkFolder(categories: Category[], bookmarks: Bookmark[]) {
  return useMemo(() => {
    const map = new Map<number, FolderNode>();
    const roots: FolderNode[] = [];

    for (const c of categories) {
      map.set(c.id, { ...c, children: [], bookmarks: [] });
    }

    for (const b of bookmarks) {
      const parent = map.get(b.categoryId);
      if (parent) {
        parent.bookmarks.push(b);
      }
    }

    for (const c of categories) {
      const node = map.get(c.id)!;
      if (c.pid) {
        const parent = map.get(c.pid);
        if (parent) parent.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }, [categories, bookmarks]);
}

export interface BookmarkFolderProperties {
  categories: Category[];
  bookmarks: Bookmark[];
}

export default function BookmarkFolderManager({
  categories,
  bookmarks,
}: BookmarkFolderProperties) {
  const tree = useBookmarkFolder(categories, bookmarks);

  return (
    <div
      className="p-4 w-full max-w-5xl mx-auto flex justify-center items-start overflow-y-auto"
      style={{ maxHeight: ContentHeight }}
    >
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 p-2 w-full max-w-[900px]">
        {tree.map((node) => (
          <BookmarkCard key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
