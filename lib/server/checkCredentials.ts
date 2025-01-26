"use server";
import bcrypt from "bcrypt";

import { CredentialsType } from "@/types";
import { prisma } from "@lib/prisma";

export const checkCredentials = async (credentials: Partial<Record<keyof CredentialsType, unknown>>) => {
  // Validate provided credentials
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Invalid Credentials");
  }

  const user = await prisma.user.findUnique({
    where: {
      // @ts-expect-error ignore
      email: credentials.email,
    },
  });

  // If user not found or hashed password is missing, throw error
  if (!user || !user?.hashedPassword) {
    throw new Error("Invalid credentials");
  }

  // Compared provided password with hashed password
  // @ts-expect-error ignore
  const isCorrectPassword = bcrypt.compare(credentials.password, user.hashedPassword);

  // If passwords do not match, throw error
  if (!isCorrectPassword) {
    throw new Error("Invalid Credentials");
  }

  // Return user if authentication is successful
  return user;
};
