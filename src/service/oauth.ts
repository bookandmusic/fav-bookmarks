import prisma from "@/lib/prisma";

export const oauthService = {
  async findUserOAuthAccount(
    userId: number,
    provider: string,
    providerId: string,
  ) {
    return prisma.userOAuth.findFirst({
      where: {
        userId,
        provider,
        providerId,
      },
    });
  },

  async createUserOAuthAccount(data: {
    provider: string;
    providerId: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
    userId: number;
  }) {
    return prisma.userOAuth.create({
      data,
    });
  },
};
