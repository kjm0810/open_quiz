// /types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: number;
    } & DefaultSession["user"];
  }
}
