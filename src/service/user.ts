import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

export const userService = {
  async findUserByUniqueKey(key: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: key }, { username: key }, { phone: key }],
      },
    });
    return user;
  },

  async validatePassword(user: { password: string }, password: string) {
    try {
      return await bcrypt.compare(password, user.password);
    } catch {
      return false;
    }
  },
  async createUser(data: {
    email: string;
    name: string;
    phone?: string;
    password?: string;
    role?: Role;
  }) {
    const { email, name, phone, password, role } = data;
    // 生成随机密码，因为 OAuth 用户不需要密码登录
    const randomPassword = Math.random().toString(36).slice(-8);
    const pwd = password || randomPassword;
    const hashedPassword = await bcrypt.hash(pwd, 10);

    return await prisma.user.create({
      data: {
        email,
        username: name,
        password: hashedPassword,
        phone,
        role: role || Role.USER,
      },
    });
  },
};
