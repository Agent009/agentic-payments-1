"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@lib/prisma";

type UserSettings = {
  name?: string;
  emailNotifications?: boolean;
  darkMode?: boolean;
};

type UserProfile = {
  name?: string;
  email?: string;
  image?: string;
};

export async function updateUserSettings(settings: UserSettings) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update settings");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: settings,
  });

  revalidatePath("/settings");
}

export async function updateProfile(profile: UserProfile) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update your profile");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: profile,
  });

  revalidatePath("/profile");
}
