import prisma from "@/lib/prisma";

export const oauthService = {
  async findUserOAuthAccount(
    userId: number,
    provider: string,
    providerId: string,
  ) {
    return await prisma.userOAuth.findFirst({
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
    return await prisma.userOAuth.create({
      data,
    });
  },
};
