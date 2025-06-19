import { CategoryFormValue, CateType } from "@/types/category";

export async function fetchCategories(categoryType: CateType) {
  const res = await fetch(`/api/category?type=${categoryType}`);

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error || "获取分类列表失败,状态码: " + res.status);
  }

  return res.json();
}

export async function createCategory(data: CategoryFormValue) {
  const res = await fetch("/api/category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error || "创建分类失败");
  }
  return res.json();
}

export async function updateCategory(
  id: number,
  data: Partial<CategoryFormValue>,
) {
  const res = await fetch(`/api/category/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error || "更新分类失败");
  }
  return res.json();
}

export async function deleteCategory(id: number) {
  const res = await fetch(`/api/category/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error || "删除分类失败");
  }
  return res.json();
}
