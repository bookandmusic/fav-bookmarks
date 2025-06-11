import prisma from "@/lib/prisma";

export const categoryService = {
  // 创建分类
  async create(data: {
    name: string;
    pid?: number;
    icon?: string;
    user_id: number;
  }) {
    return prisma.category.create({
      data,
    });
  },

  //   批量添加
  async createMany(
    data: { name: string; pid?: number; icon?: string; user_id: number }[],
  ) {
    return prisma.category.createMany({
      data,
    });
  },

  // 根据用户ID查询分类
  async findByUserId(user_id: number) {
    return prisma.category.findMany({
      where: { user_id },
    });
  },

  // 更新分类
  async update(
    id: number,
    data: { name?: string; pid?: number; icon?: string },
  ) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  // 删除分类
  async delete(id: number) {
    return prisma.category.delete({
      where: { id },
    });
  },
};
