import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authenticateRequest } from '@/admin/lib/auth/auth-middleware';
import { logger } from '@/admin/lib/logger';
import { replaceNullWithUndefined } from '@/admin/lib/null-to-undefined';
import { createErrorResponse } from '@/admin/lib/response';
import { categoryService } from '@/admin/services/category';

const cateTypeEnum = z.enum(['Project', 'BookMark']);

// GET /api/category
const querySchema = z.object({
  type: cateTypeEnum.optional().default('BookMark'),
  isPublic: z.preprocess((value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (typeof value === 'boolean') return value;
  }, z.boolean().optional()),
});
export async function GET(request: NextRequest) {
  const userId = await authenticateRequest();
  if (!userId) {
    return createErrorResponse('用户未登录', 401);
  }

  const searchParameters = Object.fromEntries(request.nextUrl.searchParams);
  const result = querySchema.safeParse(searchParameters);

  if (!result.success) {
    return createErrorResponse('查询参数无效', 400);
  }

  const { type: cateType, isPublic } = result.data;
  try {
    const categories = await categoryService.findMany(
      cateType,
      userId,
      isPublic
    );
    const transformedCategories = replaceNullWithUndefined(categories);
    return NextResponse.json(transformedCategories);
  } catch (error) {
    logger.error('查询分类失败', error);
    return createErrorResponse('查询分类失败', 500);
  }
}

// POST /api/category
const postSchema = z.object({
  name: z.string().min(1),
  pid: z.number().optional(),
  icon: z.string().optional(),
  isPublic: z.boolean().optional(),
  type: cateTypeEnum,
});
export async function POST(request: NextRequest) {
  const userId = await authenticateRequest();
  if (!userId) {
    return createErrorResponse('用户未登录', 401);
  }

  try {
    const body = await request.json();

    const result = postSchema.safeParse(body);

    if (!result.success) {
      return createErrorResponse('参数校验失败', 400, result.error.issues);
    }
    const newCategory = await categoryService.get_or_create({
      ...result.data,
      isPublic: result.data.isPublic ?? false,
      userId: userId,
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    logger.error('创建分类失败', error);
    return createErrorResponse('创建分类失败', 500);
  }
}
