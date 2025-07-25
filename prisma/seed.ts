// prisma/seed.ts
import { userService } from "@/admin/services/user";
import { Role } from "@/admin/types/user";

export async function main() {
  try {
    // 开启事务
    const user = await userService.findUserByUniqueKey("admin");
    if (!user) {
      await userService.createUser({
        email: "admin@example.com",
        name: "admin",
        password: "123456",
        role: Role.ADMIN,
      });
      console.log(`✅ Created user with name: admin, password: 123456`);
    }
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// 执行种子脚本
main();
