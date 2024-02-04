import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MySqlAdapter from "./MySqlAdapter";

import {createPool} from "mysql2";

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
    port: parseInt(process.env.DB_PORT) // Convert the port value to a number
});

export const authOptions = {
    adapter: MySqlAdapter(db),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        async session({session, token, user}: {session: any; token: any; user: any}) {
            session.user.id = user.id;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};

// @ts-expect-error
export default NextAuth(authOptions);
