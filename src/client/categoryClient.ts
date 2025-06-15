import { CategoryCreate, CategoryUpdate } from "@/types/category";

export async function fetchCategories() {
  const res = await fetch("/api/category");
  if (!res.ok) throw new Error("获取分类失败");
  return res.json();
}

export async function createCategory(data: CategoryCreate) {
  const res = await fetch("/api/category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("创建分类失败");
  return res.json();
}

export async function updateCategory(
  id: number,
  data: Partial<CategoryUpdate>,
) {
  const res = await fetch(`/api/category/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("更新分类失败");
  return res.json();
}

export async function deleteCategory(id: number) {
  const res = await fetch(`/api/category/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("删除分类失败");
  return res.json();
}
