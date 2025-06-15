import { getServerSession } from "next-auth";

import { authOptions } from "./options";

export async function authenticateRequest(): Promise<number | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return null;
  }

  const userIdNumber = parseInt(userId, 10);
  if (isNaN(userIdNumber)) {
    return null;
  }

  return userIdNumber;
}
