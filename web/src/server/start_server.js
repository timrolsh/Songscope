import express, {json} from "express";
import next from "next";
import db from "./db_connect";
const port = 3000;

const devMode = process.argv[2] === "dev";
const nextApp = next({dev: devMode});

async function startServer() {
    try {
        await nextApp.prepare();
        const server = express();
        server.use(json());

        const bodyParser = require("body-parser");
        server.use(bodyParser.urlencoded({extended: true}));

        db.query("select NOW();", (error, results, fields) => {
            if (error) {
                console.error(
                    "SONGSCOPE: Unable to start server. Failed to connect to database",
                    error
                );
                process.exit(1);
            }
            // Handle both get and post requests with Next.js API system
            server.get("*", (request, response) => {
                return nextApp.getRequestHandler()(request, response);
            });
            server.post("*", (request, response) => {
                return nextApp.getRequestHandler()(request, response);
            });
            server.listen(port, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`SONGSCOPE: Started server on http://localhost:${port}`);
            });
        });
    } catch (error) {
        console.error("SONGSCOPE: Unable to start server.", error);
        process.exit(1);
    }
}

startServer();
