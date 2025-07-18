'use client';
import { useEffect, useMemo, useState } from 'react';

import { fetchCategories } from '@/admin/client/category-client';
import { Category, CateType } from '@/admin/types/category/base';

export function useCategoryData(setError: (error: Error | undefined) => void) {
  const [reload, setReload] = useState(false);
  const [categoryType, setCategoryType] = useState<CateType>(CateType.BookMark);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories(categoryType)
      .then(setCategoryList)
      .catch((error) => {
        setError(error);
        setCategoryList([]);
      });
  }, [categoryType, reload, setError]);

  return {
    reload,
    setReload,
    categoryList,
    setCategoryType,
  };
}

export function usePagination(initialPage = 1, pageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSizeState] = useState(pageSize);

  // 重置页码
  const resetPage = () => setPage(1);

  return {
    page,
    setPage,
    pageSize: pageSizeState,
    resetPage,
  };
}

export function useCategoryNavigation(setPage: (page: number) => void) {
  const [currentPid, setCurrentPid] = useState<number | undefined>();
  const [prePid, setPrePid] = useState<number[]>([]);
  const [hasBack, setHasBack] = useState(false);

  // 点击分类项
  const handleItemClick = (item: Category) => {
    setPage(1);
    setCurrentPid(item.id);
    setPrePid((previous) => [...previous, item.id]);
    setHasBack(true);
  };

  // 返回上一级
  const handleGoBack = () => {
    if (prePid.length > 0) {
      setPage(1);
      const newPrePid = [...prePid];
      newPrePid.pop();
      const newCurrentPid = newPrePid.at(-1) ?? undefined;
      setCurrentPid(newCurrentPid);
      setPrePid(newPrePid);
      setHasBack(newPrePid.length > 0);
    }
  };

  // 重置导航状态
  const resetNavigation = () => {
    setCurrentPid(undefined);
    setPrePid([]);
    setHasBack(false);
  };

  return {
    currentPid,
    prePid,
    hasBack,
    handleItemClick,
    handleGoBack,
    resetNavigation,
  };
}

export function useCategory(setError: (error: Error | undefined) => void) {
  const { reload, setReload, categoryList, setCategoryType } =
    useCategoryData(setError);
  const { page, setPage, pageSize, resetPage } = usePagination();
  const {
    currentPid,
    hasBack,
    handleItemClick,
    handleGoBack,
    resetNavigation,
  } = useCategoryNavigation(setPage);

  // 数据筛选逻辑
  const { filteredItems, paginatedItems } = useMemo(() => {
    const filtered = categoryList.filter((item) => item.pid === currentPid);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    return { filteredItems: filtered, paginatedItems: paginated };
  }, [categoryList, currentPid, page, pageSize]);

  // 分类类型切换
  const cateTypeChange = (type: string) => {
    setCategoryType(type as CateType);
    resetNavigation();
    resetPage();
  };

  return {
    reload,
    setReload,
    categoryList,
    items: paginatedItems,
    total: filteredItems.length,
    page,
    setPage,
    pageSize,
    cateTypeChange,
    handleItemClick,
    handleGoBack,
    hasBack,
  };
}
