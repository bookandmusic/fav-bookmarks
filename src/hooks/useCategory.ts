"use Client";

import { Category } from "@/types/category";
import { useEffect, useState } from "react";


export function useCategory() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
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
