import { Category } from "@/types/category";

export const getCategoryPath = (
  categoryId: number | null,
  categories: Category[],
): number[] => {
  const path: number[] = [];
  const findCategory = (id: number | null): void => {
    if (id === null) return;
    const category = categories.find((item) => item.id === id);
    if (category) {
      path.unshift(category.id);
      findCategory(category.pid);
    }
  };
  findCategory(categoryId);
  return path;
};
