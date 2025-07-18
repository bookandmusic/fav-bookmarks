import { BookmarkFormValue } from '@/admin/types/bookmark/form';

export async function fetchBookmarks({
  page = 1,
  size = 10,
  keyword,
  isPublic,
  categoryId,
  isDeleted,
}: {
  page?: number;
  size?: number;
  keyword?: string;
  isPublic?: boolean;
  categoryId?: number;
  isDeleted?: boolean;
}) {
  // 构建查询参数对象
  const queryParameters = new URLSearchParams();

  // 添加非空参数
  if (page) queryParameters.append('page', page.toString());
  if (size) queryParameters.append('size', size.toString());
  if (keyword) queryParameters.append('keyword', keyword);
  if (isPublic !== undefined)
    queryParameters.append('isPublic', isPublic.toString());
  if (categoryId) queryParameters.append('categoryId', categoryId.toString());
  if (isDeleted !== undefined)
    queryParameters.append('isDeleted', isDeleted.toString());

  // 构建完整URL
  const url = `/api/bookmark?${queryParameters.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error || '获取书签失败');
  }
  return response.json();
}

export async function createBookmark(data: BookmarkFormValue) {
  const response = await fetch('/api/bookmark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error || '创建书签失败');
  }
  return response.json();
}

export async function updateBookmark(
  id: number,
  data: Partial<BookmarkFormValue>
) {
  const response = await fetch(`/api/bookmark/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error || '更新书签失败');
  }
  return response.json();
}

export async function deleteBookmark(id: number) {
  const response = await fetch(`/api/bookmark/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error || '删除书签失败');
  }
  return response.json();
}
