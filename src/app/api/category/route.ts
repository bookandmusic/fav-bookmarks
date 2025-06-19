import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authenticateRequest } from "@/lib/auth/authMiddleware";
import { createErrorResponse } from "@/lib/httpHelper";
import { logger } from "@/lib/logger";
import { categoryService } from "@/services/category";
import { CateType } from "@/types/category";

const cateTypeEnum = z.enum(["Project", "BookMark"]);
// 定义 POST 请求的校验 Schema
const postSchema = z.object({
  name: z.string().min(1),
  pid: z.number().nullable(),
  icon: z.string().nullable(),
  isPublic: z.boolean(),
  type: cateTypeEnum,
});

// GET /api/category
export async function GET(request: NextRequest) {
  const userId = await authenticateRequest();
  if (!userId) {
    return createErrorResponse("用户未登录", 401);
  }
  const searchParams = Object.fromEntries(
    request.nextUrl.searchParams.entries(),
  );
  const rawType = searchParams.type;
  const parsedTypeResult = cateTypeEnum.safeParse(rawType);
  const cateType = (
    parsedTypeResult.success ? parsedTypeResult.data : "BookMark"
  ) as CateType;
  try {
    const categories = await categoryService.findMany(userId, cateType, true);
    return NextResponse.json(categories);
  } catch (error) {
    logger.error("查询分类失败", error);
    return createErrorResponse("查询分类失败", 500);
  }
}

// POST /api/category
export async function POST(request: NextRequest) {
  const userId = await authenticateRequest();
  if (!userId) {
    return createErrorResponse("用户未登录", 401);
  }

  try {
    const body = await request.json();
    logger.info("创建分类请求", { body });

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
