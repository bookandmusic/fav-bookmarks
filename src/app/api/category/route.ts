import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authenticateRequest } from "@/lib/auth/authMiddleware";
import { createErrorResponse } from "@/lib/httpHelper";
import { logger } from "@/lib/logger";
import { categoryService } from "@/services/category";

const cateTypeEnum = z.enum(["Project", "BookMark"]);

// GET /api/category
const querySchema = z.object({
  type: cateTypeEnum.optional().default("BookMark"),
  isPublic: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});
export async function GET(request: NextRequest) {
  const userId = await authenticateRequest();
  if (!userId) {
    return createErrorResponse("用户未登录", 401);
  }

  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = querySchema.safeParse(searchParams);

  if (!result.success) {
    return createErrorResponse("查询参数无效", 400);
  }

  const { type: cateType, isPublic } = result.data;
  try {
    const categories = await categoryService.findMany(
      userId,
      cateType,
      isPublic,
    );
    return NextResponse.json(categories);
  } catch (error) {
    logger.error("查询分类失败", error);
    return createErrorResponse("查询分类失败", 500);
  }
}

// POST /api/category
const postSchema = z.object({
  name: z.string().min(1),
  pid: z.number().nullable(),
  icon: z.string().nullable(),
  isPublic: z.boolean(),
  type: cateTypeEnum,
});
export async function POST(request: NextRequest) {
  const userId = await authenticateRequest();
  if (!userId) {
    return createErrorResponse("用户未登录", 401);
  }

  try {
    const body = await request.json();

    const result = postSchema.safeParse(body);

    if (!result.success) {
      return createErrorResponse("参数校验失败", 400, result.error.issues);
    }
    const newCategory = await categoryService.create({
      ...result.data,
      userId: userId,
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    logger.error("创建分类失败", error);
    return createErrorResponse("创建分类失败", 500);
  }
}
