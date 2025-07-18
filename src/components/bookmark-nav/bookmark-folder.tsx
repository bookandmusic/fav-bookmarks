'use client';
import { useMemo, useState } from 'react';

import { Icon } from '@iconify/react/dist/iconify.js';
import { Card, Modal } from 'antd';
import { twMerge } from 'tailwind-merge';

import { Bookmark } from '@/types/bookmark';
import { Category } from '@/types/category';

interface FolderNode extends Category {
  children: FolderNode[];
  bookmarks: Bookmark[];
}

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

interface BookmarkFolderProperties {
  categories: Category[];
  bookmarks: Bookmark[];
}

export default function BookmarkFolder({
  categories,
  bookmarks,
}: BookmarkFolderProperties) {
  const tree = useBookmarkFolder(categories, bookmarks);

  return (
    <div className="p-4 w-full max-w-5xl mx-auto flex justify-center items-start">
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto grid gap-3 grid-cols-1 sm:grid-cols-3 p-2 w-full max-w-[900px]">
        {tree.map((node) => (
          <BookmarkCard key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

function BookmarkCard({ node }: { node: FolderNode }) {
  const [open, setOpen] = useState(false);

  const isFolder = node.children.length > 0 || node.bookmarks.length > 0;

  const content = (
    <Card
      hoverable
      className={twMerge(
        'text-center h-32 flex flex-col justify-center items-center cursor-pointer',
        isFolder ? 'bg-blue-50' : 'bg-white'
      )}
      onClick={() => {
        if (isFolder) setOpen(true);
      }}
    >
      <div className="text-2xl mb-1 flex items-center justify-center w-full gap-1 px-2">
        {isFolder ? (
          <Icon icon="solar:folder-broken" width={30} />
        ) : (
          <Icon icon="solar:link-round-bold-duotone" width={30} />
        )}
        <span className="truncate w-full">{node.name}</span>
      </div>
    </Card>
  );

  return (
    <>
      {content}
      <Modal
        title={node.name}
        open={open}
        onCancel={() => setOpen(false)}
        // eslint-disable-next-line unicorn/no-null
        footer={null}
        width={900}
        style={{ top: '20px' }}
        styles={{
          body: {
            height: 'calc(95vh - 75px)',
            overflowY: 'auto',
          },
        }}
      >
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 p-2">
          {node.bookmarks.map((b) => (
            <Card
              key={b.id}
              hoverable
              className="bg-white"
              onClick={() => window.open(b.url, '_blank')}
            >
              <div
                className="text-base font-semibold mb-1 truncate"
                title={b.title}
              >
                {b.title}
              </div>
              <div className="text-sm text-gray-500 truncate" title={b.url}>
                {b.url}
              </div>
            </Card>
          ))}
          {node.children.map((c) => (
            <BookmarkCard key={c.id} node={c} />
          ))}
        </div>
      </Modal>
    </>
  );
}
