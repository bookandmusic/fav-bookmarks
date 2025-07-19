'use client';
import { useState } from 'react';

import { Icon } from '@iconify/react';
import { FloatButton } from 'antd';

import { ContentHeight } from '../const';
import BookmarkFolderManager, {
  BookmarkFolderProperties,
} from './bookmark-folder/bookmark-manager';
import BookmarkTreeManager from './bookmark-tree/bookmark-manager';

export default function BookmarkFavNav({
  categories,
  bookmarks,
}: BookmarkFolderProperties) {
  const [style, setStyle] = useState<number>(1);
  return (
    <>
      <FloatButton
        icon={<Icon icon={'tabler:switch-3'} />}
        onClick={() => {
          setStyle(style == 1 ? 2 : 1);
        }}
      />
      <div style={{ width: '100%', height: ContentHeight, overflow: 'hidden' }}>
        {style == 1 && (
          <BookmarkTreeManager bookmarks={bookmarks} categories={categories} />
        )}
        {style == 2 && (
          <BookmarkFolderManager
            bookmarks={bookmarks}
            categories={categories}
          />
        )}
      </div>
    </>
  );
}
