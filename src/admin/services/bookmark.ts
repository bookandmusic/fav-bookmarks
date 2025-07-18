import { BookMark } from '@prisma/client';

import prisma from '@/admin/lib/prisma';
import { BookmarkCreate, BookmarkFormValue } from '@/admin/types/bookmark/form';

export const bookmarkService = {
  // 分页获取书签
  async findByMany({
    categoryId,
    page,
    size,
    keyword,
    isPublic,
    isDeleted,
    userId,
  }: {
    page: number;
    size: number;
    categoryId?: number;
    keyword?: string;
    isPublic?: boolean;
    isDeleted?: boolean;
    userId: number;
  }): Promise<{
    data: BookMark[];
    pagination: {
      total: number;
      page: number;
      size: number;
      totalPages: number;
    };
  }> {
    let isPublicCondition = {};
    if (isPublic !== undefined) {
      isPublicCondition = { isPublic: isPublic };
    }
    let isDeletedCondition = {};
    if (isDeleted !== undefined) {
      isDeletedCondition = { isDeleted: isDeleted };
    }

    const where = {
      userId: userId,
      ...(categoryId ? { categoryId } : {}),
      ...isPublicCondition,
      ...isDeletedCondition,
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
        orderBy: { id: 'desc' },
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
  async get_by_url(url: string, userId: number): Promise<BookMark | null> {
    return await prisma.bookMark.findFirst({
      where: {
        url,
        userId,
      },
    });
  },
  async create_or_update(data: BookmarkCreate): Promise<BookMark> {
    const bookmark = await this.get_by_url(data.url, data.userId);
    if (bookmark) {
      return await this.update(bookmark.id, {
        ...data,
      });
    }
    return await this.create(data);
  },
  async createMany(data: BookmarkCreate[]): Promise<{ count: number }> {
    return await prisma.bookMark.createMany({ data });
  },

  // 更新书签
  async update(
    id: number,
    data: Partial<BookmarkFormValue>
  ): Promise<BookMark> {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    return prisma.bookMark.update({
      where: { id },
      data: updateData,
    });
  },
  // 逻辑删除所有书签
  async deleteAll(): Promise<{ count: number }> {
    return prisma.bookMark.updateMany({ data: { isDeleted: true } });
  },
  // 删除书签
  async delete(id: number): Promise<BookMark> {
    return prisma.bookMark.delete({
      where: { id },
    });
  },
  async get_by_id(id: number): Promise<BookMark | null> {
    return prisma.bookMark.findUnique({
      where: { id },
    });
  },
  async findPublicMany({ userId }: { userId?: number }): Promise<BookMark[]> {
    return userId
      ? prisma.bookMark.findMany({
          where: { userId },
        })
      : prisma.bookMark.findMany({
          where: { isPublic: true },
        });
  },
};
