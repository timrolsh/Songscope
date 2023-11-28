import {Express, Request, Response} from "express";
import express from "express";
import {dirname} from "path";
const rootPath = dirname(__dirname);

const server: Express = express();
// check env variables
if (!(process.env.PORT && process.env.MODE && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)) {
    console.log("SONGSCOPE: Not all environment variables are set. Exiting...");
    process.exit(1);
}

// serve static files, includig the frontend bundle of all the Lit HTML components
server.use(express.static(`${rootPath}/frontend/static`));

// Home page web app route handler
server.get("/", (request: Request, response: Response) => {
    response.sendFile(`${rootPath}/frontend/pages/index.html`);
});

server.post("/google-auth", (request: Request, response: Response) => {
    
})

server.listen(process.env.PORT, () => {
    console.log(`Server launched on http://localhost:${process.env.PORT}`);
});
