import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/src/lib/axios";
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role?: string;
      name: string;
    };
  }

  interface User {
    accessToken?: string;
    role?: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    name: string;
  }
}
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const res = await api.post("/auth/login", {
            username: credentials?.username,
            password: credentials?.password,
          });

          const data = res.data;

          if (!data) return null;

          return {
            id: data.admin.id,
            name: data.admin.username,
            role: "ADMIN",
            accessToken: data.access_token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub as string,
        role: token.role as string,
        name: token.name as string,
      };

      session.accessToken = token.accessToken as string;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
