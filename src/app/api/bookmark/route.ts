import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authenticateRequest } from "@/lib/auth/authMiddleware";
import { createErrorResponse } from "@/lib/httpHelper";
import { logger } from "@/lib/logger";
import { bookmarkService } from "@/services/bookmark";

// ---------- 查询参数校验 Schema ----------
const querySchema = z
  .object({
    categoryId: z.preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().optional()),
    page: z
      .preprocess((val) => {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }, z.number().min(1).max(100))
      .default(1),
    size: z
      .preprocess((val) => {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }, z.number().min(1).max(100))
      .default(10),
    keyword: z.string().optional().nullable(),
    isPublic: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      if (typeof val === "boolean") return val;
      return null;
    }, z.boolean().nullable().optional()),
  })
  .strict();

// ---------- 请求体校验 Schema ----------
const bodySchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  categoryId: z.number().int(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

// ---------- GET /api/bookmark ----------
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    );

    const result = querySchema.safeParse(searchParams);
    if (!result.success) {
      return createErrorResponse("查询参数校验失败", 400, result.error.issues);
    }

    const data = await bookmarkService.findByMany({
      categoryId: result.data.categoryId ?? null,
      page: result.data.page,
      size: result.data.size,
      keyword: result.data.keyword,
      isPublic: result.data.isPublic,
    });

    return NextResponse.json(data);
  } catch (error) {
    const message = "查询书签失败，请稍后再试";
    logger.error({ message, error });
    return createErrorResponse(message, 500);
  }
}

// ---------- POST /api/bookmark ----------
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateRequest();
    if (!userId) {
      return createErrorResponse("用户未登录", 401);
    }

    const body = await request.json();

    const result = bodySchema.safeParse(body);
    if (!result.success) {
      return createErrorResponse(
        "请求体参数校验失败",
        400,
        result.error.issues,
      );
    }

    const created = await bookmarkService.create({
      ...result.data,
      userId,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = "添加书签失败，请检查参数或稍后再试";
    logger.error({ message, error });
    return createErrorResponse(message, 500);
  }
}
