import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { CategoryList } from "@/types/menu";

// 构建树形结构的递归函数
function buildCategoryTree(
  categories: CategoryList,
  parentId: number | null = null,
): CategoryList {
  return categories
    .filter((category) => category.pid === parentId)
    .map((category) => {
      const children = buildCategoryTree(categories, category.id);
      return {
        ...category,
        ...(children.length > 0 ? { children } : {}),
      };
    });
}

export async function GET() {
  try {
    // 查询所有分类
    const categories = await prisma.category.findMany({
      orderBy: [{ pid: "asc" }, { id: "asc" }],
    });

    // 构建树形结构
    const treeData = buildCategoryTree(categories);

    return NextResponse.json(treeData);
  } catch {
    return NextResponse.json({ error: "查询分类失败" }, { status: 500 });
  }
}
