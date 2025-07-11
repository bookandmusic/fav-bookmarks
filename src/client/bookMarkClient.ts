import { BookmarkFormValue } from "@/types/bookmark";

export async function fetchBookmarks({
  page = 1,
  size = 10,
  keyword = null,
  isPublic = null,
  categoryId = null,
}: {
  page?: number;
  size?: number;
  keyword?: string | null;
  isPublic?: boolean | null;
  categoryId?: number | null;
}) {
  // 构建查询参数对象
  const queryParams = new URLSearchParams();

  // 添加非空参数
  if (page) queryParams.append("page", page.toString());
  if (size) queryParams.append("size", size.toString());
  if (keyword) queryParams.append("keyword", keyword);
  if (isPublic !== null) queryParams.append("isPublic", isPublic.toString());
  if (categoryId) queryParams.append("categoryId", categoryId.toString());

  // 构建完整URL
  const url = `/api/bookmark?${queryParams.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "获取书签失败");
  }
  return res.json();
}

export async function createBookMark(data: BookmarkFormValue) {
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
  data: Partial<BookmarkFormValue>,
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
