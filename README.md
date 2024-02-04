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
