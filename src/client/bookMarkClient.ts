import { BookmarkCreate, BookmarkUpdate } from "@/types/bookmark";

export async function fetchCategories() {
  const res = await fetch("/api/bookmark");
  if (!res.ok) throw new Error("获取分类失败");
  return res.json();
}

export async function createBookMark(data: BookmarkCreate) {
  const res = await fetch("/api/bookmark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("创建分类失败");
  return res.json();
}

export async function updateBookMark(
  id: number,
  data: Partial<BookmarkUpdate>,
) {
  const res = await fetch(`/api/bookmark/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("更新分类失败");
  return res.json();
}

export async function deleteBookMark(id: number) {
  const res = await fetch(`/api/bookmark/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("删除分类失败");
  return res.json();
}
