"use Client";

import { useEffect, useState } from "react";

import { CategoryList } from "@/types/menu";

export function useCategory() {
  const [categoryList, setCategoryList] = useState<CategoryList>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch("/api/category")
      .then((res) => {
        if (!res.ok) throw new Error("获取分类列表失败,状态码: " + res.status);
        return res.json();
      })
      .then(setCategoryList)
      .catch((err) => {
        setError(err);
        setCategoryList([]);
      });
  }, []);
  return { categoryList, error };
}
