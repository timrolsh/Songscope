const express = require("express");
const next = require("next");
const db = require("./db_connect");
const port = 3000;

const devMode = process.argv[2] === "dev";
const nextApp = next({dev: devMode});

nextApp.prepare().then(() => {
    const server = express();
    server.use(express.json());
    const bodyParser = require("body-parser");
    server.use(bodyParser.urlencoded({extended: true}));
    // Establish database connection
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
});
