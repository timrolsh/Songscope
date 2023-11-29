const express = require("express");
const next = require("next");
const db = require("./db_connect");
const port = 3000;

const devMode = process.argv[2] === "dev";
const nextApp = next({dev: devMode});

nextApp.prepare().then(() => {
    const server = express();
    // Establish database connection
    db.query("select NOW();")
        .then(() => {
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
        })
        .catch((err) => {
            console.error("SONGSCOPE: Unable to start server. Failed to connect to database", err);
            process.exit(1);
        });
});
