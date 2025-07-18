import { useMemo } from 'react';

import { Cascader } from 'antd';
import { DefaultOptionType } from 'antd/es/cascader';

import { Category } from '@/admin/types/category/base';
import { CategoryNode } from '@/admin/types/category/components';

const buildCategoryTree = (
  categories: Category[],
  parentId?: number
): CategoryNode[] =>
  categories
    .filter((item) => item.pid === parentId)
    .map((item) => ({
      value: item.id,
      label: item.name,
      children: buildCategoryTree(categories, item.id),
      ...item,
    }));

const filter = (inputValue: string, path: DefaultOptionType[]) =>
  path.some((option) =>
    (option.label as string).toLowerCase().includes(inputValue.toLowerCase())
  );
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
    [categoryList]
  );

  return (
    <Cascader
      style={{ width: '100%' }}
      value={value}
      showSearch={{ filter }}
      options={treeData}
      onChange={onChange}
      changeOnSelect
      placeholder="请选择分类"
    />
  );
};
