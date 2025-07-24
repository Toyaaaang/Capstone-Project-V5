// lib/auth.ts
import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { identifier, password } = credentials!;

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { username: identifier },
            ],
          },
        });

        if (!user) throw new Error("Invalid credentials");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Incorrect password");

        if (!user.isRoleConfirmed) {
          throw new Error("Your role is not yet confirmed by admin");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {};
      }
      (session.user as { id?: string; role?: string }).id = token.id as string;
      (session.user as { id?: string; role?: string }).role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/login", // your login page path
  },
  secret: process.env.NEXTAUTH_SECRET,
};
