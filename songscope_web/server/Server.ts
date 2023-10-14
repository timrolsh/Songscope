import {Express, Request, Response} from "express";
import express from "express";
import {dirname} from "path";
const rootPath = dirname(__dirname);

const server: Express = express();

// serve static files, includig the frotend bundle of all the Lit HTML components
server.use(express.static(`${rootPath}/songscope_web/frontend/static`));

// Home page web app route handler
server.get("/", (request: Request, response: Response) => {
    response.sendFile(`${rootPath}/songscope_web/frontend/pages/index.html`);
});

server.listen(80, () => {
    console.log("server started");
});
