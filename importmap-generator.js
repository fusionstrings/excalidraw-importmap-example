import { Generator } from "https://cdn.jsdelivr.net/gh/fusionstrings/dependencies@36513823bc98061f2f84e1c3fd6352f711146aa2/dist/deno/jspm.js";

async function main(subpath = "./js/main.js") {
    const generator = new Generator({
        env: ['production', 'browser'],
    });

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
    const importmap = await main();
    console.log('importmap: ', importmap);
}

export { main }