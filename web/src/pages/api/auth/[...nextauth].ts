import NextAuth, {Session} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";

import {Pool} from "pg";
import {User} from "@/types";
import PostgresAdapter from "@auth/pg-adapter";

// check to make sure all environment variables are set
if (
    !(
        process.env.PGHOST &&
        process.env.PGUSER &&
        process.env.PGDATABASE &&
        process.env.PGPASSWORD &&
        process.env.PGPORT
    )
) {
    console.log("Error: Environment variables for the database are not set.");
}

// create the connection to database
export const db = new Pool({
    ssl: process.env.PGHOST !== "localhost",
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT || "")
});

export const authOptions = {
    adapter: PostgresAdapter(db),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        // Using the session callback to add user data to the session so it can be easily accessed, the User type is our type for our database custom table for Users
        async session({session, user}: {session: Session; user: User}) {
            session.user = user;
            // Convert the date to a string so it can be serialized to prevent error
            session.user.join_date = JSON.stringify(user.join_date).slice(1, -1);
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin"
    },
    secret: process.env.NEXTAUTH_SECRET
};

// @ts-expect-error
export default NextAuth(authOptions);
