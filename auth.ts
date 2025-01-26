import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Sendgrid from "next-auth/providers/sendgrid";

import { constants } from "@lib/constants";
import { prisma } from "@lib/prisma";
import { checkCredentials } from "@lib/server/checkCredentials";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    // @ts-expect-error ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    authorized: async ({ request, auth }) => {
      // Logged-in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        return checkCredentials(credentials);
      },
    }),
    // @see https://authjs.dev/getting-started/providers/sendgrid
    Sendgrid({
      apiKey: constants.integrations.sendGrid.apiKey,
      from: constants.integrations.sendGrid.from,
    }),
  ],
  pages: {
    // error: constants.routes.auth.error,
    signIn: constants.routes.auth.login,
    // signOut: constants.routes.auth.logout,
    verifyRequest: constants.routes.auth.verifyRequest,
  },
  debug: constants.env.dev,
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
