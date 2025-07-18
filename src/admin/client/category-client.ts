import { CateType } from '@/admin/types/category/base';
import { CategoryFormValue } from '@/admin/types/category/form';

export async function fetchCategories(categoryType: CateType) {
  const response = await fetch(`/api/category?type=${categoryType}`);

  if (!response.ok) {
    const json = await response.json();
    throw new Error(
      json?.error || '获取分类列表失败,状态码: ' + response.status
    );
  }

  return response.json();
}

export async function createCategory(data: CategoryFormValue) {
  const response = await fetch('/api/category', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json?.error || '创建分类失败');
  }
  return response.json();
}

export async function updateCategory(
  id: number,
  data: Partial<CategoryFormValue>
) {
  const response = await fetch(`/api/category/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json?.error || '更新分类失败');
  }
  return response.json();
}

export async function deleteCategory(id: number) {
  const response = await fetch(`/api/category/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json?.error || '删除分类失败');
  }
  return response.json();
}
