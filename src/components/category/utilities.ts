import { Category } from '@/types/category';

/**
 * 获取指定分类的路径
 * @param categoryId - 分类ID
 * @param categories - 所有分类列表
 */
export const getCategoryPath = (
  categories: Category[],
  categoryId?: number | null
): number[] => {
  const path: number[] = [];

  const findCategory = (id?: number | null): void => {
    if (id === undefined) return;

    const category = categories.find((item) => item.id === id);

    if (category) {
      path.unshift(category.id);
      findCategory(category.pid);
    }
  };

  findCategory(categoryId);

  return path;
};
