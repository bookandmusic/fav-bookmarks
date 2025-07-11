import { Cascader } from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { useMemo } from "react";

import { Category, CategoryNode } from "@/types/category";

const buildCategoryTree = (
  categories: Category[],
  parentId: number | null = null,
): CategoryNode[] =>
  categories
    .filter((item) => item.pid === parentId)
    .map((item) => ({
      value: item.id,
      label: item.name,
      children: buildCategoryTree(categories, item.id),
      ...item,
    }));

export const CategoryCascader = ({
  categoryList,
  value,
  onChange,
}: {
  categoryList: Category[];
  value?: number[];
  onChange?: (value: number[]) => void;
}) => {
  const treeData = useMemo(
    () => buildCategoryTree(categoryList),
    [categoryList],
  );

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some((option) =>
      (option.label as string).toLowerCase().includes(inputValue.toLowerCase()),
    );

  return (
    <Cascader
      style={{ width: "100%" }}
      value={value}
      showSearch={{ filter }}
      options={treeData}
      onChange={onChange}
      changeOnSelect
      placeholder="请选择分类"
    />
  );
};
