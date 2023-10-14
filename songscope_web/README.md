# Songscope Web App

This web app is built with Bun and Express. Lit HTML is used on the frontend and is served with express, which not only handles the web app client requests for the frontend, but handles API requests from the backend.

## Project Structure

All global files for this project like the [.prettierrc.json](`./.prettierrc.json`) formatting file, the [package.json](./package.json), etc. are in this directory. All server files necessary to run the Songscope web server are in the [server](./server) directory. All frontend files are in the [frontend](./frontend) directory.

## Bun

Bun is used as the runtime for this project, as well as the bundler for the frontend Lit HTML components. If there are issues with stability in the future, it can be replaced with another runtime like Node or Deno.

## Code Formatting

Prettier is the code formatter for this project, and a [.prettierrc.json](./.prettierrc.json) config file with the formatting style is defined.

## Bundling

Frontend Bundling is necessary for this project as Lit HTML is used and its code needs to be converted into Javascript before being executed in the browser. Bun's built in bundler is used to generate the bundle from the [Components.js](./frontend/Components.js) file, the role of which is to import all the Lit HTML components and add them add HTML custom tags.

## Server Running

To start the web server for devlopment, run the following command:

```bash
bun dev
```

This will run the development server on port 80 in watch mode to automatically restart upon any changes.
