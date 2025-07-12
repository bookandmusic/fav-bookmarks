'use client';
import { useState } from 'react';

import { Icon } from '@iconify/react';
import { Pagination } from 'antd';

import {
  createBookmark,
  deleteBookmark,
  updateBookmark,
} from '@/client/book-mark-client';
import {
  BookmarkEditDrawer,
  BookmarkList,
  BookmarkSearch,
  BookmarkToolbar,
} from '@/components/bookmark/index';
import { FullScreenOverlay } from '@/components/loading';
import { useBookMarkData } from '@/hooks/use-bookmark';
import { useCategoryData } from '@/hooks/use-category';
import { useNotification } from '@/hooks/use-notification';
import { asyncWrapper } from '@/lib/utilities';
import { Bookmark, BookmarkFormValue } from '@/types/bookmark';

export default function BookMarks() {
  const { setError, setInfo, contextHolder } = useNotification();
  const { categoryList } = useCategoryData(setError);
  const {
    reload,
    setReload,
    page,
    setPage,
    size,
    total,
    bookmarkList,
    setSearchParams,
  } = useBookMarkData(setError);
  const [modalOpen, setModalOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [currentBookMark, setCurrentBookMark] = useState<
    Bookmark | undefined
  >();

  const handleCreate = (values: BookmarkFormValue) => {
    setIsLoading(true);
    asyncWrapper(createBookmark(values), {
      onSuccess: () => {
        setInfo(`书签：${values.title}，添加成功`);
        setReload(!reload);
        setModalOpen(false);
      },
      onError: setError,
      onFinally: () => setIsLoading(false),
    });
  };

  const handleUpdate = (id: number, values: BookmarkFormValue) => {
    setIsLoading(true);
    asyncWrapper(updateBookmark(id, values), {
      onSuccess: () => {
        setInfo(`书签：${values.title}，修改成功`);
        setReload(!reload);
        setModalOpen(false);
      },
      onError: setError,
      onFinally: () => setIsLoading(false),
    });
  };

  const delBookMark = (item: Bookmark) => {
    setIsLoading(true);
    asyncWrapper(deleteBookmark(item.id), {
      onSuccess: () => {
        setInfo(`书签：${item.title}，删除成功`);
        setReload(!reload);
      },
      onError: setError,
      onFinally: () => setIsLoading(false),
    });
  };

  const editBookMark = (item: Bookmark) => {
    setMode('edit');
    setCurrentBookMark(item);
    setModalOpen(true);
  };

  const addBookMark = () => {
    setCurrentBookMark(undefined);
    setMode('create');
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {contextHolder}
      {isLoading && <FullScreenOverlay />}
      <div className="flex flex-col gap-4 h-full w-full lg:w-[900px] p-6">
        <BookmarkToolbar
          onAddClick={addBookMark}
          onSearchClick={() => setShowSearch(!showSearch)}
          onAllClick={() => {
            setSearchParams(undefined);
            setShowSearch(false);
          }}
        ></BookmarkToolbar>
        {showSearch && (
          <BookmarkSearch
            categoryList={categoryList}
            onFinish={(values) => {
              setSearchParams(values);
            }}
          />
        )}

        <div className="flex flex-1 overflow-y-auto border border-gray-200">
          <BookmarkList
            bookmarkList={bookmarkList}
            onEdit={editBookMark}
            onDelete={delBookMark}
          />
        </div>

        <Pagination
          pageSize={size}
          current={page}
          total={total}
          showSizeChanger={false}
          onChange={setPage}
        />
      </div>
      <div className="hidden lg:flex flex-1 w-full h-full items-center justify-center">
        <div className="w-1/2 max-w-[200px]">
          <Icon
            width={200}
            height={200}
            icon="material-icon-theme:folder-core"
            className="w-full h-auto"
          />
        </div>
      </div>
      <BookmarkEditDrawer
        categoryList={categoryList}
        initialValues={currentBookMark}
        onFinish={(values) => {
          if (mode === 'edit' && currentBookMark) {
            handleUpdate(currentBookMark.id, values);
          } else {
            handleCreate(values);
          }
        }}
        open={modalOpen}
        setOpen={setModalOpen}
        setError={setError}
      />
    </div>
  );
}
