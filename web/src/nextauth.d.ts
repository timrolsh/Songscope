// ./types/nextauth.d.ts
import NextAuth from "next-auth";
import {User} from "./types";
declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }
}
