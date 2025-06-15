import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { createErrorResponse } from "@/lib/httpHelper";
import { logger } from "@/lib/logger";
import { bookmarkService } from "@/services/bookmark";

// 定义 PUT 请求的校验 Schema
const putSchema = z.object({
  title: z.string().min(1).optional(),
  url: z.string().url().optional(),
  categoryId: z.number().int().optional(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});

// 辅助函数：生成错误响应

// PUT /api/bookmark/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);

  // 校验 id 是否合法
  if (!Number.isInteger(id) || id <= 0) {
    return createErrorResponse("无效的书签 ID", 400);
  }

  try {
    const body = await request.json();
    logger.info(`更新书签请求 (ID: ${id})`, { body });

    const result = putSchema.safeParse(body);

    if (!result.success) {
      return createErrorResponse("参数校验失败", 400, result.error.issues);
    }

    const updated = await bookmarkService.update(id, result.data);
    return NextResponse.json(updated);
  } catch (err) {
    logger.error(`更新书签失败 (ID: ${id})`, err);
    return createErrorResponse("更新书签失败", 500);
  }
}

// DELETE /api/bookmark/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);

  // 校验 id 是否合法
  if (!Number.isInteger(id) || id <= 0) {
    return createErrorResponse("无效的书签 ID", 400);
  }

  try {
    const deleted = await bookmarkService.delete(id);

    if (!deleted) {
      return createErrorResponse("书签不存在或已被删除", 404);
    }

    return NextResponse.json(deleted);
  } catch (err) {
    logger.error(`删除书签失败 (ID: ${id})`, err);
    return createErrorResponse("删除书签失败", 500);
  }
}
