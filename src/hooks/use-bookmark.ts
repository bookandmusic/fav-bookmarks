'use client';

import { useEffect, useState } from 'react';

import { fetchBookmarks } from '@/client/book-mark-client';
import { Bookmark, BookmarkSearchFormValue } from '@/types/bookmark';

export function useBookMarkData(setError: (error: Error | undefined) => void) {
  const [reload, setReload] = useState(false);
  const [searchParameters, setSearchParameters] = useState<
    BookmarkSearchFormValue | undefined
  >();
  const [bookmarkList, setbookmarkList] = useState<Bookmark[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchBookmarks({
      page,
      size,
      keyword: searchParameters?.keyword,
      isPublic: searchParameters?.isPublic,
      categoryId: searchParameters?.categoryId,
      isDeleted: searchParameters?.isDeleted,
    })
      .then((response) => {
        setbookmarkList(response.data);
        setTotal(response.pagination.total);
      })
      .catch((error) => {
        setError(error);
        setbookmarkList([]);
      });
  }, [searchParameters, page, size, reload, setError]);

  return {
    reload,
    setReload,
    setSearchParams: setSearchParameters,
    bookmarkList,
    total,
    page,
    setPage,
    size,
    setSize,
  };
}
