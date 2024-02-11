// ./types/nextauth.d.ts
import NextAuth from 'next-auth';
import { User } from './types';
// TODO --> find a way to connect this user extension to the existing user type in types.ts... or just use this
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
            bio: string;
            join_date: string;
            role?: string;
            isAdmin: boolean;
        } & DefaultSession['user'];
    }
}