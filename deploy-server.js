import { listenAndServe } from "https://deno.land/std@0.111.0/http/server.ts";
import { MEDIA_TYPES } from './media-type.js';

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

/**
 * A `maidenPathname` is a `URL.pathname` without any path prefix, relative or absolute.
 * e.g. 👇
 * ```
 * https://www.example.com/js/main.js -> js/main.js
 * /js/main.js -> js/main.js
 * ./js/main.js -> js/main.js
 * js/main.js -> js/main.js
 * ```
 * @param {string} maidenPathname 
 * @returns {string}
 */
function getFileExtensionFromPath(maidenPathname) {
    const [fileExtension] = maidenPathname.split('.').reverse();
    return `.${fileExtension}`;
}

/**
* @param {Request} request
* @returns {Promise<Response>}
*/
async function requestHandler(request) {
    const { pathname } = new URL(request.url);

    const { sessionStorage, localStorage } = globalThis;

    const storage = sessionStorage || localStorage;

    if (storage) {
        const storedFileKey = removeSlashes(pathname);
        const storedFile = storage.getItem(storedFileKey);

        if (storedFile) {
            return new Response(storedFile, {
                // @ts-ignore
                headers: {
                    // @ts-ignore
                    "content-type": MEDIA_TYPES[getFileExtensionFromPath(storedFileKey)],
                    "x-cache": 'HIT'
                }
            });
        }
    }

    const assetPath = assetMap[pathname];

    if (assetPath) {
        try {

            const mode = request.headers.get('sec-fetch-mode');
            const dest = request.headers.get('sec-fetch-dest');
            const contentTypeHTML = mode === 'navigate' || dest === 'document';

            if (contentTypeHTML) {
                const content = await Deno.readTextFile(assetPath);
                const { main } = await import('./js/importmap-generator.js');
                const importMap = await main();

                const [beforeImportmap, afterImportmap] = content.split("//__importmap");
                const html = `${beforeImportmap}${importMap}${afterImportmap}`;

                return new Response(html, {
                    headers: {
                        "content-type": MEDIA_TYPES['.html'],
                    }
                });
            }

            const content = Deno.readFile(assetPath);
            const textDecodedContent = new TextDecoder().decode(fileContent);
            const maidenPathname = removeSlashes(assetPath);

            return new Response(textDecodedContent, {
                headers: {
                    "content-type": MEDIA_TYPES[getFileExtensionFromPath(maidenPathname)],
                }
            });
        } catch (error) {
            return new Response(error.message || error.toString(), { status: 500 });
        }
    }


    const site = request.headers.get('sec-fetch-site');
    const contentTypeCompiledJSX = dest === 'script' && mode === 'cors' && site === 'same-origin' && pathname.endsWith(".jsx.js");

    if (contentTypeCompiledJSX) {
        try {
            const { files, diagnostics } = await Deno.emit(`.${pathname}`.slice(0, -3));

            if (diagnostics.length) {
                // there is something that impacted the emit
                console.warn(Deno.formatDiagnostics(diagnostics));
            }
            // @ts-ignore
            const [, content] = Object.entries(files).find(([fileName]) => {
                const cwd = toFileUrl(Deno.cwd()).href;
                const commonPath = common([
                    cwd,
                    fileName,
                ]);
                const shortFileName = fileName.replace(commonPath, `/`);

                return shortFileName === pathname;
            });
            return new Response(content);
        } catch (error) {
            return new Response(error.message || error.toString(), { status: 500 })
        }
    }

    if (pathname.endsWith(".jsx")) {
        try {
            if (storage) {
                const { files, diagnostics } = await Deno.emit(`.${pathname}`);

                if (diagnostics.length) {
                    // there is something that impacted the emit
                    console.warn(Deno.formatDiagnostics(diagnostics));
                }

                for (const [fileName, text] of Object.entries(files)) {

                    const cwd = toFileUrl(Deno.cwd()).href;
                    const commonPath = common([
                        cwd,
                        fileName,
                    ]);
                    const maidenPathname = fileName.replace(commonPath, ``);

                    storage.setItem(maidenPathname, text);
                }
            }

            return new Response(pathname, {
                status: 303,
                headers: {
                    "location": `${request.url}.js`,
                },
            });
        } catch (error) {
            return new Response(error.message || error.toString(), { status: 500 })
        }
    }

    return new Response(null, {
      status: 404,
    });
}

if (import.meta.main) {
    const PORT = Deno.env.get("PORT") || 1729;
    const timestamp = Date.now();
    const humanReadableDateTime = new Date(timestamp).toLocaleString();
    console.log('Current Date: ', humanReadableDateTime)
    console.info(`Server Listening on http://localhost:${PORT}`);
    listenAndServe(`:${PORT}`, requestHandler);
}
