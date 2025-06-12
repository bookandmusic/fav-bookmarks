// prisma/seed.ts
import { userService } from "@/service/user";
import { Role } from "@prisma/client";

export async function main() {
  try {
    // 开启事务
    const user = await userService.findUserByUniqueKey("admin");
    if (!user) {
      await userService.createUser({
        email: "admin",
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
main()
