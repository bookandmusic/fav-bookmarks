import { Category } from "@prisma/client";

import prisma from "@/lib/prisma";
import { CategoryCreate, CategoryFormValue, CateType } from "@/types/category";

export const categoryService = {
  // 创建分类
  async create(data: CategoryCreate): Promise<Category> {
    return await prisma.category.create({
      data,
    });
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
    userId: number | null,
    type: CateType,
    isPublic?: boolean,
  ): Promise<Category[]> {
    if (userId) {
      // 如果有 userId，则只查询该用户的数据
      return await prisma.category.findMany({
        where: { userId, type },
        orderBy: [{ pid: "asc" }, { id: "asc" }],
      });
    }

    if (isPublic) {
      // 没有 userId 但有 isPublic，则只查询公开的
      return await prisma.category.findMany({
        where: { isPublic: true, type },
        orderBy: [{ pid: "asc" }, { id: "asc" }],
      });
    }

    // 都没有则返回空数组
    return [];
  },

  // 更新分类
  async update(
    id: number,
    data: Partial<CategoryFormValue>,
  ): Promise<Category> {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
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
