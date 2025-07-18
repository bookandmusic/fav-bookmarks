import bcrypt from 'bcryptjs';

import prisma from '@/admin/lib/prisma';
import { Role } from '@/admin/types/user';

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
    password: string;
    role?: Role;
    avatar?: string;
  }) {
    const { email, name, phone, password, role, avatar } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        email,
        username: name,
        password: hashedPassword,
        phone,
        role: role || Role.USER,
        avatar,
      },
    });
  },
};
