"use client";
import { useEffect, useMemo, useState } from "react";

import { fetchCategories } from "@/client/categoryClient";
import { Category, CateType } from "@/types/category";

export function useCategory(setError: (error: Error | null) => void) {
  const [reload, setReload] = useState(false);
  const [categoryType, setCategoryType] = useState<CateType>(CateType.BookMark);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [currentPid, setCurrentPid] = useState<number | null>(null);
  const [prePid, setPrePid] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 获取分类数据
  useEffect(() => {
    fetchCategories(categoryType)
      .then(setCategoryList)
      .catch((err) => {
        setError(err);
        setCategoryList([]);
      });
  }, [categoryType, reload, setError]);

  // 过滤与分页计算
  const { filteredItems, paginatedItems } = useMemo(() => {
    const filtered = categoryList.filter((item) => item.pid == currentPid);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    return { filteredItems: filtered, paginatedItems: paginated };
  }, [categoryList, currentPid, page]);

  // 列表点击处理
  const handleItemClick = (item: Category) => {
    setCurrentPid(item.id);
    setPage(1);
    setPrePid([...prePid, item.id]);
  };

  // 返回上一级处理
  const handleGoBack = () => {
    if (prePid.length > 0) {
      const newPrePid = [...prePid];
      newPrePid.pop();
      setCurrentPid(newPrePid[newPrePid.length - 1] || null);
      setPrePid(newPrePid);
    }
  };
  const hasBack = useMemo(() => prePid.length > 0, [prePid]);
  // 分类类型切换处理
  const cateTypeChange = (type: string) => {
    setCategoryType(type as CateType);
    setCurrentPid(null);
    setPrePid([]);
    setPage(1);
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
