import { useState } from 'react';

import { Icon } from '@iconify/react/dist/iconify.js';
import { Card, Modal } from 'antd';
import { twMerge } from 'tailwind-merge';

import { Bookmark } from '@/admin/types/bookmark/base';
import { Category } from '@/admin/types/category/base';

import './modal.css';

export interface FolderNode extends Category {
  children: FolderNode[];
  bookmarks: Bookmark[];
}

export function BookmarkCard({ node }: { node: FolderNode }) {
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
        // eslint-disable-next-line unicorn/no-null
        title={null}
        // eslint-disable-next-line unicorn/no-null
        footer={null}
        open={open}
        onCancel={() => setOpen(false)}
        wrapClassName="custom-fullscreen-modal"
      >
        <div className="w-full h-full overflow-y-auto flex justify-center">
          <div className="w-full max-w-[900px] px-4 py-6">
            {/* 自定义 Title 区域 */}
            <div className="text-xl font-semibold mb-4">{node.name}</div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
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
          </div>
        </div>
      </Modal>
    </>
  );
}
