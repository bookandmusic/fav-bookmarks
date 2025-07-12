import { getServerSession } from 'next-auth';

import { authOptions } from './options';

export async function authenticateRequest(): Promise<number | undefined> {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return undefined;
  }

  const userIdNumber = Number.parseInt(userId, 10);
  if (Number.isNaN(userIdNumber)) {
    return undefined;
  }

  return userIdNumber;
}
