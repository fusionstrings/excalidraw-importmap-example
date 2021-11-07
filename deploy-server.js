import { listenAndServe } from "https://deno.land/std@0.113.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.113.0/http/file_server.ts";

const staticAssets = {
    "/": "./deploy.html",
    "/deploy.html": "./deploy.html"
};

/**
* @param {Request} request
* @returns {Promise<Response>}
*/
async function requestHandler(request) {
    const mode = request.headers.get('sec-fetch-mode');
    const dest = request.headers.get('sec-fetch-dest');
    const site = request.headers.get('sec-fetch-site');

    const { pathname } = new URL(request.url);
    const staticFile = staticAssets[pathname];

    if (staticFile) {
        try {
            return serveFile(request, staticFile);
        } catch (error) {
            return new Response(error.message || error.toString(), { status: 500 })
        }
    }
}

if (import.meta.main) {
    const PORT = Deno.env.get("PORT") || 8080;
    const timestamp = Date.now();
    const humanReadableDateTime = new Date(timestamp).toLocaleString();
    console.log('Current Date: ', humanReadableDateTime)
    console.info(`Server Listening on http://localhost:${PORT}`);
    listenAndServe(`:${PORT}`, requestHandler);
}