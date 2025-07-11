"use client";

import { useEffect, useState } from "react";

import { fetchBookmarks } from "@/client/bookMarkClient";
import { Bookmark, BookmarkSearchFormValue } from "@/types/bookmark";

export function useBookMarkData(setError: (error: Error | null) => void) {
  const [reload, setReload] = useState(false);
  const [searchParams, setSearchParams] =
    useState<BookmarkSearchFormValue | null>(null);
  const [bookmarkList, setbookmarkList] = useState<Bookmark[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchBookmarks({
      page,
      size,
      keyword: searchParams?.keyword,
      isPublic: searchParams?.isPublic,
      categoryId: searchParams?.categoryId,
    })
      .then((res) => {
        setbookmarkList(res.data);
        setTotal(res.pagination.total);
      })
      .catch((err) => {
        setError(err);
        setbookmarkList([]);
      });
  }, [searchParams, page, size, reload, setError]);

  return {
    reload,
    setReload,
    setSearchParams,
    bookmarkList,
    total,
    page,
    setPage,
    size,
    setSize,
  };
}
