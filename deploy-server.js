import { listenAndServe } from "https://deno.land/std@0.111.0/http/server.ts";

const assetMap = {
    '/': './deploy.html',
    '/README.md': './README.md'
}

/**
 * @param {string} path 
 * @returns {string}
 */
function removeLeadingSlash(path) {
    if (path.startsWith("/")) {
        return path.slice(1);
    }
    return path;
}

/**
 * @param {string} path 
 * @returns {string}
 */
function removeTrailingSlash(path) {
    if (path.endsWith("/")) {
        return path.slice(0, -1);
    }
    return path;
}

/**
 * @param {string} path 
 * @returns {string}
 */
function removeSlashes(path) {
    return removeTrailingSlash(removeLeadingSlash(path));
}

async function handler(request) {
    const mode = request.headers.get('sec-fetch-mode');
    const dest = request.headers.get('sec-fetch-dest');
    const site = request.headers.get('sec-fetch-site');

    const { pathname } = new URL(request.url);
    const assetPath = assetMap[pathname];
    const maidenPathname = removeSlashes(assetPath);
    const [fileExtension] = maidenPathname.split('.').reverse();

    console.log('mode: ', mode);
    console.log('pathname: ', pathname);
    console.log('assetPath: ', assetPath);
    console.log('maidenPathname: ', maidenPathname);
    console.log('fileExtension: ', fileExtension);

    const textFileContent = await Deno.readTextFile(assetPath);
    // Absolute paths.
    // The content of the repository is available under at Deno.cwd().
    // const readmeAbsolute = await Deno.readFile(`${Deno.cwd()}/README.md`);
    // File URLs are also supported.
    //   const readmeFileUrl = await Deno.readFile(
    //     new URL(`file://${Deno.cwd()}/README.md`),
    //   );

    // Decode the Uint8Array as string.
    // const readme = new TextDecoder().decode(readmeRelative);
    return new Response(textFileContent, {
        headers: {
            "content-type": MEDIA_TYPES[`.${fileExtension}`],
        }
    });
}

console.log("Listening on http://localhost:8080");
await listenAndServe(":8080", handler);
