import {dirname} from "path";
const rootPath = dirname(__dirname);
const buildOption = process.argv[2];

// frontend lit html bundle creator
if (buildOption === `bundle`) {
    await Bun.build({
        entrypoints: [`${rootPath}/songscope_web/frontend/Components.js`],
        outdir: `${rootPath}/songscope_web/frontend/static/bundle`,
        target: "browser",
        splitting: false,
        minify: true,
    });
}
