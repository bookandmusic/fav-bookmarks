import { BookMark } from "@prisma/client";

import prisma from "@/lib/prisma";
import { BookmarkCreate, BookmarkUpdate } from "@/types/bookmark";

export const bookmarkService = {
  // 分页获取书签
  async findByMany({
    categoryId,
    page,
    size,
    keyword,
    isPublic,
  }: {
    categoryId: number | null;
    page: number;
    size: number;
    keyword: string | undefined | null;
    isPublic: boolean | undefined | null;
  }): Promise<{
    data: BookMark[];
    pagination: {
      total: number;
      page: number;
      size: number;
      totalPages: number;
    };
  }> {
    const where = {
      ...(categoryId ? { categoryId } : {}),
      ...(isPublic ? { isPublic: true } : {}),
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword } },
              { url: { contains: keyword } },
            ],
          }
        : {}),
    };

    const [bookmarks, total] = await Promise.all([
      prisma.bookMark.findMany({
        where,
        orderBy: { id: "desc" },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.bookMark.count({ where }),
    ]);

    return {
      data: bookmarks,
      pagination: {
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      },
    };
  },

  // 添加书签
  async create(data: BookmarkCreate): Promise<BookMark> {
    return await prisma.bookMark.create({ data });
  },

  async createMany(data: BookmarkCreate[]): Promise<{ count: number }> {
    return await prisma.bookMark.createMany({ data });
  },

  // 更新书签
  async update(id: number, data: Partial<BookmarkUpdate>): Promise<BookMark> {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );

    return prisma.bookMark.update({
      where: { id },
      data: updateData,
    });
  },

  // 删除书签
  async delete(id: number): Promise<BookMark> {
    return prisma.bookMark.delete({
      where: { id },
    });
  },
};
