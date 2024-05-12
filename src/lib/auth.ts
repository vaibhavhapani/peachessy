import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { fetchRedis } from "@/app/helpers/redis";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("GOOGLE_CLIENT_ID is missing!");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("GOOGLE_CLIENT_SECRET is missing!");
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const res = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;

      if (!res) {
        token.id = user!.id;
        return token;
      }

      const dbUser = JSON.parse(res) as User;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        (session.user.id = token.id),
          (session.user.name = token.name),
          (session.user.email = token.email),
          (session.user.image = token.picture);
      }

      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
