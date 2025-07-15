import { Category } from '@prisma/client';

import prisma from '@/lib/prisma';
import { CategoryCreate, CategoryFormValue, CateType } from '@/types/category';

export const categoryService = {
  // 创建分类
  async create(data: CategoryCreate): Promise<Category> {
    return await prisma.category.create({
      data,
    });
  },

  async get_by_name(
    name: string,
    type: CateType,
    userId: number
  ): Promise<Category | null> {
    return await prisma.category.findFirst({
      where: {
        name,
        type,
        userId,
      },
    });
  },
  async get_or_create(data: CategoryCreate): Promise<Category> {
    const category = await this.get_by_name(data.name, data.type, data.userId);
    if (category) {
      return category;
    }
    return this.create(data);
  },
  async hasChildren(id: number): Promise<boolean> {
    const count = await prisma.category.count({
      where: {
        pid: id,
      },
    });
    return count > 0;
  },
  async hasBookMarks(categoryId: number): Promise<boolean> {
    const count = await prisma.bookMark.count({
      where: {
        categoryId: categoryId,
      },
    });
    return count > 0;
  },

  async hasProjects(categoryId: number): Promise<boolean> {
    const count = await prisma.project.count({
      where: {
        categoryId: categoryId,
      },
    });
    return count > 0;
  },

  //   批量添加
  async createMany(data: CategoryCreate[]): Promise<{ count: number }> {
    return await prisma.category.createMany({
      data,
    });
  },

  // 查询当前用户或公开的分类
  async findMany(
    type: CateType,
    userId: number,
    isPublic?: boolean
  ): Promise<Category[]> {
    let isPublicCondition = {};
    if (isPublic !== undefined) {
      isPublicCondition = { isPublic: isPublic };
    }

    // 如果有 userId，则只查询该用户的数据
    return await prisma.category.findMany({
      where: { userId, type, ...isPublicCondition },
      orderBy: [{ id: 'desc' }],
    });
  },

  // 更新分类
  async update(
    id: number,
    data: Partial<CategoryFormValue>
  ): Promise<Category> {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    return await prisma.category.update({
      where: { id },
      data: updateData,
    });
  },

  // 删除分类
  async delete(id: number): Promise<Category> {
    return await prisma.category.delete({
      where: { id },
    });
  },
};
