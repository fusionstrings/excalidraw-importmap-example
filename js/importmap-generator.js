import { Generator } from "https://cdn.jsdelivr.net/gh/fusionstrings/dependencies@c59ae9dde8d5d339b3c0433d4b4f46e72739fafe/dist/deno/jspm.js";

async function main(subpath = "./js/main.js") {
    const generator = new Generator();

    await generator.install([
        {
            alias: "@fusionstrings/river",
            target: "./",
            subpath,
        },
    ]);
    const importMap = JSON.stringify(generator.getMap(), null, 2);
    return importMap;
}

if (import.meta.main) {
    main();
}

export { main }