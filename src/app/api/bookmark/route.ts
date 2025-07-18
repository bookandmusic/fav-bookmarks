import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authenticateRequest } from '@/admin/lib/auth/auth-middleware';
import { logger } from '@/admin/lib/logger';
import { replaceNullWithUndefined } from '@/admin/lib/null-to-undefined';
import { createErrorResponse } from '@/admin/lib/response';
import { bookmarkService } from '@/admin/services/bookmark';

// ---------- 查询参数校验 Schema ----------
const querySchema = z
  .object({
    categoryId: z.preprocess((value) => {
      const number_ = Number(value);
      return Number.isNaN(number_) ? undefined : number_;
    }, z.number().optional()),
    page: z
      .preprocess((value) => {
        const number_ = Number(value);
        return Number.isNaN(number_) ? undefined : number_;
      }, z.number().min(1).max(100))
      .default(1),
    size: z
      .preprocess((value) => {
        const number_ = Number(value);
        return Number.isNaN(number_) ? undefined : number_;
      }, z.number().min(1).max(100))
      .default(10),
    keyword: z.string().optional(),
    isPublic: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (typeof value === 'boolean') return value;
    }, z.boolean().optional()),
    isDeleted: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (typeof value === 'boolean') return value;
    }, z.boolean().optional()),
  })
  .strict();

// ---------- 请求体校验 Schema ----------
const bodySchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  categoryId: z.number().int(),
  description: z.string().optional(),
  icon: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// ---------- GET /api/bookmark ----------
export async function GET(request: NextRequest) {
  try {
    const searchParameters = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const result = querySchema.safeParse(searchParameters);
    if (!result.success) {
      return createErrorResponse('查询参数校验失败', 400, result.error.issues);
    }
    const userId = await authenticateRequest();
    if (!userId) {
      return createErrorResponse('用户未登录', 401);
    }
    const data = await bookmarkService.findByMany({
      categoryId: result.data.categoryId,
      page: result.data.page,
      size: result.data.size,
      keyword: result.data.keyword,
      isPublic: result.data.isPublic,
      isDeleted: result.data.isDeleted ?? false,
      userId,
    });
    const transformedBookmarks = replaceNullWithUndefined(data);
    return NextResponse.json(transformedBookmarks);
  } catch (error) {
    const message = '查询书签失败，请稍后再试';
    logger.error(message, error);
    return createErrorResponse(message, 500);
  }
}

// ---------- POST /api/bookmark ----------
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateRequest();
    if (!userId) {
      return createErrorResponse('用户未登录', 401);
    }

    const body = await request.json();

    const result = bodySchema.safeParse(body);
    if (!result.success) {
      return createErrorResponse(
        '请求体参数校验失败',
        400,
        result.error.issues
      );
    }

    const created = await bookmarkService.create({
      ...result.data,
      userId,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = '添加书签失败，请检查参数或稍后再试';
    logger.error(message, error);
    return createErrorResponse(message, 500);
  }
}
