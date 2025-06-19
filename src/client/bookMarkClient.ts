import { BookmarkCreate, BookmarkUpdate } from "@/types/bookmark";

export async function fetchBookmarks() {
  const res = await fetch("/api/bookmark");
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "获取书签失败");
  }
  return res.json();
}

export async function createBookMark(data: BookmarkCreate) {
  const res = await fetch("/api/bookmark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "创建书签失败");
  }
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
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "更新书签失败");
  }
  return res.json();
}

export async function deleteBookMark(id: number) {
  const res = await fetch(`/api/bookmark/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "删除书签失败");
  }
  return res.json();
}
