import prisma from '@/admin/lib/prisma';

export const oauthService = {
  async findUserOAuthAccount(provider: string, providerId: string) {
    return await prisma.userOAuth.findFirst({
      where: {
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
  async updateUserOAuthAccount(parameters: {
    id: number;
    data: {
      accessToken: string;
      refreshToken?: string;
      expiresAt: Date;
    };
  }) {
    const { id, data } = parameters;

    return await prisma.userOAuth.update({
      where: {
        id,
      },
      data,
    });
  },
};
