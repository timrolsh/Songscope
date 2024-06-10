# Songscope

A music discussion platform for everyone.
Easily find, discuss, and review the singles, artists, albums, and EPs you listen to, and discover the communities associated with all kinds of music.
Connect your Spotify account for easy integration with your Spotify library and music.
This project is open source, and everyone is welcome to contribute by opening issues and PRs.

## Code Formatting

All Typescript and Javascript files should be formatted using the Prettier configuration defined by the [prettierrc.json](./web/prettierrc.json) file in the root of the web directory. All TS/TSX and JS/JSX files should be in this folder.

* Prettier comes as an extension for VSCode, but can also be added as a dev dependency if necessary
If iOS/Android Apps are ever made, there will be a formatting guide for those as well

## Technologies Used

* **Next.js**: Utilized for server-side rendering for the React-based web application
* **React**: Allows for dynamic and interactive web pages with reusable components
* **Express**: Used to handle HTTP requests and send them to Next.js's request handler
* **MySQL**: Used for relational database management system
* **TailwindCSS**: Used for styling the web application
* **Spotify API**: Used to fetch music data

## Runtime Agnostic

* This Nexjs app is designed to work with any runtime, (Node, Bun, Deno, Serverless, etc.) and therefore has no lock files attached. This is to allow for the most flexibility in deployment and runtime.

## Instructions for Setting up a Local Server

* In case the production server is down or you want to create a local instance of the project, follow these steps:
* **Set up env file**: The template is here, visit [Google's Cloud Platform](https://console.cloud.google.com/apis/dashboard) and [Spoify's Developer Dashboard](https://developer.spotify.com/dashboard) to create and get keys from Spotify and google for Oath and web api access
  * Place this .env file in the root of the Songscope project folder. Where the db and web folders are. This will allow [docker-compose](./docker-compose.yml) to access the environment variables.
  * The web project also needs access to the env file in its folder. Either copy the .env file to the web folder or create a symlink to the root .env file using the following command:

    ```bash
    ln -s ../.env .env
    ```

  * Here is a template for the contents of the .env file:

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
PGUSER=songscope
PGPASSWORD=
PGHOST=localhost
PGPORT=26257
PGDATABASE=defaultdb
GOOGLE_CLIENT_ID=197627608254-101bmkl3g7cr6v780l8vku2t9vsokvfa.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_SECRET=w9BcqHKmK+yVyH1o1tAVg+UVabGm9m10/gIglifxXfI=
NEXTAUTH_URL=http://localhost:3000
```

* **Initialize the Database**: After you've set the environment variables with the .env file, you can easily initialize a local Postgres database using Docker and docker-compose. Run the following command in the root of the project:

```bash
docker-compose up
```

* Note: We were given and used a school issued MySQL database for the project during the school year. However, the database is now being hosted on a CockroachDB instance in production, and we use postgres to have a common sql syntax that will work with both CockroachDB in production and a Postgres local server in development. The instructions above are for creating this lcoal Postgres server.

* **Set up the web project**: After the database is running, you can set up the web project by running the following commands in the web folder. The project is runtime agnostic and can be run with any runtime, but the following commands are for Node.js with NPM:

```bash
cd web;
npm install;
npm run build;
npm run prod;
```

* Or for the development server, run the following commands:

```bash
cd web;
npm install;
npm run dev;
```

## Contact

* If you have any questions, contact me at @timrolsh on discord snap insta or email at <tim.rolsh@gmail.com>
