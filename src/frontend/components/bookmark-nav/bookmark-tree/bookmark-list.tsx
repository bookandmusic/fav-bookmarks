import React from 'react';
import Masonry from 'react-masonry-css';

import { Icon } from '@iconify/react';
import { Avatar, Card, Tooltip } from 'antd';

import { Bookmark } from '@/admin/types/bookmark/base';

import './masonry.css';

interface BookmarkListProperties {
  bookmarks: Bookmark[];
}

const BookmarkList: React.FC<BookmarkListProperties> = ({ bookmarks }) => {
  const breakpointColumnsObject = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObject}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {bookmarks.map((bm) => (
        <Card
          key={bm.id}
          title={
            <div className="flex items-center mr-4 gap-2">
              <Avatar
                size={20}
                src={bm.icon || undefined}
                icon={!bm.icon && <Icon icon="mdi:link" width={20} />}
              />
              <Tooltip title={bm.title}>
                <span className="text-sm truncate max-w-[160px] block">
                  {bm.title}
                </span>
              </Tooltip>
            </div>
          }
          extra={
            <a href={bm.url} target="_blank" rel="noopener noreferrer">
              访问
            </a>
          }
          hoverable
          className="mb-4"
        >
          <p className="text-gray-500 text-sm">{bm.description}</p>
        </Card>
      ))}
    </Masonry>
  );
};

export default BookmarkList;
