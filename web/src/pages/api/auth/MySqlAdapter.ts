import {AdapterSession, AdapterUser, VerificationToken, type Adapter} from "@auth/core/adapters";
import {Pool, RowDataPacket} from "mysql2";

export function mapExpiresAt(account: any): any {
    const expires_at: number = parseInt(account.expires_at);
    return {
        ...account,
        expires_at
    };
}

// TODO --> Update the user table in the database to support blob types rather than having image be a text field
export default function MySqlAdapter(db: Pool): Adapter {
    // Instantiate a client/ORM here with the provided config, or pass it in as a parameter.
    // Usually, you might already have a client instance elsewhere in your application,
    // so you should only create a new instance if you need to or you don't have one.
    return {
        async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
            console.log("Attempting to create user....");
            const {name, email, emailVerified, image} = user;

            const sql = `
                INSERT INTO users (name, email, emailVerified, image) 
                VALUES (?, ?, ?, ?)`;
            try {
                await db
                    .promise()
                    .execute(sql, [
                        name,
                        email,
                        emailVerified ? new Date(emailVerified) : null,
                        image
                    ]);
                // TODO: Double check this query, not sure if it will work as intended, may be vulnerable? Would be ideal to base this off of userId
                const [rows] = await db
                    .promise()
                    .execute(`SELECT * FROM users WHERE email = ?`, [email]);

                // Ensure that 'rows' is treated as an array of RowDataPacket
                const users = rows as RowDataPacket[];
                if (users.length === 0) throw new Error("User creation failed");

                const newUser = users[0];
                console.log("User created: ", newUser);
                return newUser as AdapterUser;
            } catch (error: any) {
                console.error("Error creating user:", error.message);
                throw new Error(error.message);
            }
        },
        async getUser(id): Promise<AdapterUser> {
            const sql = `select * from users where id = ?`;
            try {
                const [rows] = await db.promise().execute(sql, [id]);
                const user = (rows as RowDataPacket[])[0];
                console.log("User found (by id): ", user);
                return user as AdapterUser;
            } catch (error: any) {
                console.error("Error creating user:", error.message);
                throw new Error(error.message);
            }
        },
        // May have error
        async getUserByEmail(email): Promise<AdapterUser> {
            const sql = `select * from users where email = ?`;
            try {
                const [rows] = await db.promise().execute(sql, [email]);
                const user = (rows as RowDataPacket[])[0];
                console.log("User found (by email): ", user);
                return user as AdapterUser;
            } catch (error: any) {
                console.error("Error finding user (by email):", error.message);
                throw new Error(error.message);
            }
        },
        async getUserByAccount({providerAccountId, provider}): Promise<AdapterUser | null> {
            // syntax might be wrong
            const sql = `
                select u.* from users u join accounts a on u.id = a.userId
                where 
                a.provider = ?
                and 
                a.providerAccountId = ?`;

            try {
                const [rows] = await db.promise().execute(sql, [provider, providerAccountId]);
                const user = (rows as RowDataPacket[])[0];
                console.log("User found (by account): ", user);
                return user as AdapterUser;
            } catch (error: any) {
                console.error("Error finding user (by email):", error.message);
                throw new Error(error.message);
            }
        },
        async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
            const fetchSql = `select * from users where id = ?`;
            try {
                const [rows, fields] = await db.promise().execute(fetchSql, [user.id]);
                const oldUser = (rows as RowDataPacket[])[0];
                const newUser = {
                    ...oldUser,
                    ...user
                };

                const {id, name, email, emailVerified, image} = newUser;

                const updateSql = `
                    UPDATE users set
                    name = ?, email = ? emailVerified = ?, image = ?
                    where id = ?
                `;
                try {
                    await db.promise().execute(updateSql, [name, email, emailVerified, image, id]);

                    const [rows] = await db
                        .promise()
                        .execute(`select * from users where id = ?`, [id]);
                    return (rows as RowDataPacket[])[0] as AdapterUser;
                } catch (error: any) {
                    console.error("Error updating user:", error.message);
                    throw new Error(error.message);
                }
            } catch (error: any) {
                console.error("Error fetching old user:", error.message);
                throw new Error(error.message);
            }
        },
        async deleteUser(userId: string) {
            await db.promise().execute(`delete from users where id = ?`, [userId]);
            await db.promise().execute(`delete from sessions where userId = ?`, [userId]);
            await db.promise().execute(`delete from accounts where userId = ?`, [userId]);
        },
        async linkAccount(account) {
            console.log("Linking account: ", account);
            const sql = `
            insert into accounts (
                userId, provider, type, providerAccountId, 
                access_token, expires_at, refresh_token,
                id_token, scope, session_state,
                token_type
            )
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                account.userId,
                account.provider,
                account.type,
                account.providerAccountId,
                account.access_token,
                account.expires_at,
                account.refresh_token ? account.refresh_token : null,
                account.id_token ? account.id_token : null,
                account.scope,
                account.session_state ? account.session_state : null,
                account.token_type
            ];

            try {
                await db.promise().execute(sql, params);
                const [rows] = await db
                    .promise()
                    .execute(
                        `select * from accounts where userId = ? and provider = ? and providerAccountId = ?`,
                        [account.userId, account.provider, account.providerAccountId]
                    );
                return mapExpiresAt((rows as RowDataPacket[])[0]);
            } catch (error: any) {
                console.error("Error linking account:", error.message);
                throw new Error(error.message);
            }
        },
        async unlinkAccount(partialAccount) {
            const {provider, providerAccountId} = partialAccount;
            const sql = `delete from accounts where providerAccountId = ? and provider = ?`;
            await db.promise().execute(sql, [providerAccountId, provider]);
        },
        async createSession({sessionToken, userId, expires}): Promise<AdapterSession> {
            console.log("Attemping to create session....");
            console.log("SessionInfo: ", sessionToken, userId, expires);
            if (userId === undefined) {
                throw Error(`userId is undef in createSession`);
            }
            const sql = `insert into sessions (userId, expires, sessionToken) values (?, ?, ?)`;

            try {
                await db.promise().execute(sql, [userId, expires, sessionToken]);

                const [rows] = await db
                    .promise()
                    .execute(`select * from sessions where userId = ? and sessionToken = ?`, [
                        userId,
                        sessionToken
                    ]);
                const session = (rows as RowDataPacket[])[0];
                console.log("Session created: ", session);
                // TODO --> Handle this case better, likely means error occurred while inserting user
                if (!session) throw new Error("Session creation failed");
                return session as AdapterSession;
            } catch (error: any) {
                console.error("Error creating session:", error.message);
                throw new Error(error.message);
            }
        },
        async getSessionAndUser(sessionToken: string | undefined): Promise<{
            session: AdapterSession;
            user: AdapterUser;
        } | null> {
            if (sessionToken === undefined) return null;

            try {
                let [rows] = await db
                    .promise()
                    .execute(`select * from sessions where sessionToken = ?`, [sessionToken]);

                // TODO: Double check the !rows[0] on this, this should effectively return null if there is no session (rowCount == 0)

                let session = (rows as RowDataPacket[])[0] as AdapterSession;
                if (!session) return null;

                [rows] = await db
                    .promise()
                    .execute(`select * from users where id = ?`, [session.userId]);

                // TODO: Double check the !rows[0] on this, this should effectively return null if there is no user (rowCount == 0)

                let user = (rows as RowDataPacket[])[0] as AdapterUser;
                if (!user) return null;

                return {
                    session,
                    user
                };
            } catch (error: any) {
                console.error("Error getting session:", error.message);
                throw new Error(error.message);
            }
        },
        async updateSession(
            session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
        ): Promise<AdapterSession | null | undefined> {
            const {sessionToken} = session;
            try {
                const [rows] = await db
                    .promise()
                    .execute(`select * from sessions where sessionToken = ?`, [sessionToken]);
                const originalSession = (rows as RowDataPacket)[0] as AdapterSession;
                if (!originalSession) return null;
                const newSession: AdapterSession = {
                    ...originalSession,
                    ...session
                };

                const sql = `
                    UPDATE sessions set
                    expires = ?
                    where sessionToken = ?
                `;
                try {
                    await db.promise().execute(sql, [newSession.expires, newSession.sessionToken]);

                    const [rows] = await db
                        .promise()
                        .execute(`select * from sessions where sessionToken = ?`, [sessionToken]);
                    const session = (rows as RowDataPacket)[0] as AdapterSession;
                    if (!session) return null;
                    return session;
                } catch (error: any) {
                    console.error("Error updating session:", error.message);
                    throw new Error(error.message);
                }
            } catch (error: any) {
                console.error("Error fetching old session:", error.message);
                throw new Error(error.message);
            }
        },
        async deleteSession(sessionToken) {
            const sql = `delete from sessions where sessionToken = ?`;
            await db.promise().execute(sql, [sessionToken]);
        },
        async createVerificationToken(
            verificationToken: VerificationToken
        ): Promise<VerificationToken> {
            const {identifier, expires, token} = verificationToken;
            const sql = `
                INSERT INTO verification_token ( identifier, expires, token ) 
                VALUES (?, ?, ?)
                `;
            await db.promise().execute(sql, [identifier, expires, token]);
            return verificationToken;
        },
        async useVerificationToken({
            identifier,
            token
        }: {
            identifier: string;
            token: string;
        }): Promise<VerificationToken> {
            // First, select the token data
            const selectSql = `SELECT identifier, expires, token FROM verification_token WHERE identifier = ? AND token = ?`;
            const [selectRows] = await db.promise().execute(selectSql, [identifier, token]);
            const verificationToken = (selectRows as RowDataPacket)[0];

            // If the token exists, delete it
            // TODO: Double check the existence check on this, not sure if this will work as intended (i.e. if a row is returned)
            if (verificationToken) {
                const deleteSql = `DELETE FROM verification_token WHERE identifier = ? AND token = ?`;
                await db.promise().execute(deleteSql, [identifier, token]);
                return verificationToken; // Return the first (and should be only) row
            } else {
                throw new Error("Token not found"); // No token found
            }
        }
    };
}

// TODO --> update database schema to support these queries: https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-pg/src/index.ts
