import { NextRequest, NextResponse } from 'next/server';

import z from 'zod';

import { logger } from '@/admin/lib/logger';
import { createErrorResponse } from '@/admin/lib/response';
import { bookmarkService } from '@/admin/services/bookmark';

// 定义 PUT 请求的校验 Schema
const putSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  categoryId: z.number().int(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

// 辅助函数：生成错误响应

// PUT /api/bookmark/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const bookmarkId = Number(id);

  // 校验 id 是否合法
  if (!Number.isInteger(bookmarkId) || bookmarkId <= 0) {
    return createErrorResponse('无效的书签 ID', 400);
  }

  try {
    const body = await request.json();

    const result = putSchema.safeParse(body);

    if (!result.success) {
      return createErrorResponse('参数校验失败', 400, result.error.issues);
    }

    const updated = await bookmarkService.update(bookmarkId, result.data);
    return NextResponse.json(updated);
  } catch (error) {
    logger.error(`更新书签失败 (ID: ${bookmarkId})`, error);
    return createErrorResponse('更新书签失败', 500);
  }
}

// DELETE /api/bookmark/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const bookmarkId = Number(id);

  // 校验 id 是否合法
  if (!Number.isInteger(bookmarkId) || bookmarkId <= 0) {
    return createErrorResponse('无效的书签 ID', 400);
  }

  try {
    const bookmark = await bookmarkService.get_by_id(bookmarkId);
    if (!bookmark) {
      return createErrorResponse('书签不存在', 404);
    }
    if (!bookmark.isDeleted) {
      await bookmarkService.update(bookmarkId, {
        isDeleted: true,
      });
      return NextResponse.json(bookmark);
    }
    await bookmarkService.delete(bookmarkId);

    return NextResponse.json(bookmark);
  } catch (error) {
    logger.error(`删除书签失败 (ID: ${bookmarkId})`, error);
    return createErrorResponse('删除书签失败', 500);
  }
}
