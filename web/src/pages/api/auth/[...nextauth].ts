import NextAuth, {Session} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";

import MySqlAdapter from "./MySqlAdapter";

import {createPool} from "mysql2";
import {User} from "@/types";

// check to make sure all environment variables are set
if (
    !(
        process.env.DB_HOST &&
        process.env.DB_USER &&
        process.env.DB_SCHEMA &&
        process.env.DB_PASSWORD &&
        process.env.DB_PORT
    )
) {
    console.log("Error: Environment variables for the database are not set.");
    process.exit(1);
}

// create the connection to database
export const db = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_SCHEMA,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT), // Convert the port value to a number
    waitForConnections: true,
    connectionLimit: 180, // Arbitrarily picked, likely will be fine for the database size we have
    queueLimit: 0
});

export const authOptions = {
    adapter: MySqlAdapter(db),
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
            console.log("SONGSCOPE: Session callback", user);
            session.user = user;
            // Convert the date to a string so it can be serialized to prevent error
            session.user.join_date = JSON.stringify(user.join_date);
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
