// prisma/seed.ts
import prisma from "@/lib/prisma";
import { userService } from "@/service/user";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// 密码加密函数
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function main() {
  try {
    // 开启事务
    await prisma.$transaction(async (tx) => {
      const user = userService.findUserByUniqueKey("admin");
      if (!user) {
        const hashedPassword = await hashPassword("123456");
        await tx.user.create({
          data: {
            email: "admin",
            password: hashedPassword,
            role: Role.ADMIN,
          },
          include: {
            categories: true,
          },
        });
        console.log(`✅ Created user with name: admin, password: 123456`);
      }
    });
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// 执行种子脚本
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
