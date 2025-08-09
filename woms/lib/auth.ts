import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAudit } from "@/lib/audit-log";

// 🔧 Extend the types for session and user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      firstName?: string;
      lastName?: string;
      department?: string | null;
      suboffice?: string | null;
    };
  }

  interface User {
    id: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    department?: string | null;
    suboffice?: string | null;
  }

  interface JWT {
    id?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    department?: string | null;
    suboffice?: string | null;
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
          firstName: user.firstName,
          lastName: user.lastName,
          department: user.department,
          suboffice: user.suboffice,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
  secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.department = user.department;
        token.suboffice = user.suboffice;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.department = token.department as string | null;
        session.user.suboffice = token.suboffice as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }) {
      await logAudit(
        "login",
        `User logged in with email: ${user.email}`,
        user.id
      );
    },
  },
};
