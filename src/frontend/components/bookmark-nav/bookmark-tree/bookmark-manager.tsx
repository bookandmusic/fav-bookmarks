'use client';
import React, { useState } from 'react';

import { Icon } from '@iconify/react/dist/iconify.js';
import { Drawer, Grid } from 'antd';

import { Bookmark } from '@/admin/types/bookmark/base';
import { Category } from '@/admin/types/category/base';

import { ContentHeight } from '../../const';
import BookmarkList from './bookmark-list';
import CategoryTree from './category-tree';

const { useBreakpoint } = Grid;

interface BookmarkManagerProperties {
  bookmarks: Bookmark[];
  categories: Category[];
}

const BookmarkTreeManager: React.FC<BookmarkManagerProperties> = ({
  bookmarks,
  categories,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();

  const getAllSubCategoryIds = (id: number): number[] => {
    const children = categories.filter((c) => c.pid === id);
    return [id, ...children.flatMap((child) => getAllSubCategoryIds(child.id))];
  };

  const filtered =
    selectedCategoryId === undefined
      ? bookmarks
      : bookmarks.filter((b) =>
          getAllSubCategoryIds(selectedCategoryId).includes(b.categoryId)
        );

  if (screens.md) {
    // PC端
    return (
      <div className="flex overflow-hidden" style={{ height: ContentHeight }}>
        {/* 左侧分类树 */}
        <div className="w-[220px] bg-white shadow-sm overflow-auto h-full">
          <CategoryTree
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          <main className="p-4 overflow-auto flex-1">
            <BookmarkList bookmarks={filtered} />
          </main>
        </div>
      </div>
    );
  }

  // 移动端
  return (
    <>
      <div className="flex overflow-hidden" style={{ height: ContentHeight }}>
        {/* 左侧竖条，固定宽度，点击打开抽屉 */}
        <div
          className="w-6 h-full border-r border-gray-200 flex justify-center items-center cursor-pointer"
          onClick={() => setDrawerOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') setDrawerOpen(true);
          }}
          aria-label="打开分类菜单"
        >
          <Icon icon="mdi:chevron-right" width={20} height={20} color="black" />
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          <main className="p-4 overflow-auto flex-1">
            <BookmarkList bookmarks={filtered} />
          </main>
        </div>
      </div>

      <Drawer
        title="分类"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={220}
        styles={{
          body: {
            padding: '5px',
          },
        }}
      >
        <CategoryTree
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={(id) => {
            setSelectedCategoryId(id);
            setDrawerOpen(false);
          }}
        />
      </Drawer>
    </>
  );
};

export default BookmarkTreeManager;
