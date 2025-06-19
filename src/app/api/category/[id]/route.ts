import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { authenticateRequest } from "@/lib/auth/authMiddleware";
import { createErrorResponse } from "@/lib/httpHelper";
import { logger } from "@/lib/logger";
import { categoryService } from "@/services/category";

// 定义 PUT 请求的校验 Schema
const putSchema = z.object({
  name: z.string().min(1),
  pid: z.number().nullable(),
  icon: z.string().nullable(),
  isPublic: z.boolean(),
});

// PUT /api/category/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const userId = await authenticateRequest();
  if (!userId) {
    return createErrorResponse("用户未登录", 401);
  }

  const { id } = await context.params;
  const categoryId = Number(id);
  // 校验 id 是否合法
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return createErrorResponse("无效的分类 ID", 400);
  }

  try {
    const body = await request.json();
    logger.info(`更新分类请求 (ID: ${categoryId})`, { body });

    const result = putSchema.safeParse(body);

    if (!result.success) {
      return createErrorResponse("参数校验失败", 400, result.error.issues);
    }

    const updated = await categoryService.update(categoryId, result.data);
    return NextResponse.json(updated);
  } catch (error) {
    logger.error(`更新分类失败 (ID: ${categoryId})`, error);
    return createErrorResponse("更新分类失败", 500);
  }
}

// DELETE /api/category/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const userId = await authenticateRequest();
  if (!userId) {
    return createErrorResponse("用户未登录", 401);
  }

  const { id } = await context.params;
  const categoryId = Number(id);
  // 校验 id 是否合法
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return createErrorResponse("无效的分类 ID", 400);
  }
  // 判断是否有子类
  if (await categoryService.hasChildren(categoryId)) {
    return createErrorResponse("请先删除子类", 400);
  }
  if (await categoryService.hasProjects(categoryId)) {
    return createErrorResponse("请先删除项目", 400);
  }
  if (await categoryService.hasBookMarks(categoryId)) {
    return createErrorResponse("请先删除书签", 400);
  }
  try {
    const deleted = await categoryService.delete(categoryId);

    if (!deleted) {
      return createErrorResponse("分类不存在或已被删除", 404);
    }

    return NextResponse.json(deleted);
  } catch (error) {
    logger.error(`删除分类失败 (ID: ${categoryId})`, error);
    return createErrorResponse("删除分类失败", 500);
  }
}
