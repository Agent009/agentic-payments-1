"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@lib/prisma";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to view notifications");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
}

export async function markNotificationAsRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update notifications");
  }

  await prisma.notification.update({
    where: { id, userId: session.user.id },
    data: { read: true },
  });

  revalidatePath("/notifications");
}
