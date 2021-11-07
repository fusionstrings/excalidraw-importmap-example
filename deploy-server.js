import { listenAndServe } from "https://deno.land/std@0.111.0/http/server.ts";

const assetMap = {
    '/': './deploy.html',
    '/README.md': './README.md'
}

async function handler(request) {
    const { pathname } = new URL(request.url);
  // Let's read the README.md file available at the root
  // of the repository to explore the available methods.

  // Relative paths are relative to the root of the repository
  // const readmeRelative = await Deno.readFile("./README.md");
  const assetPath = assetMap[pathname]
  const testFile = await Deno.readTextFile(assetPath);
  // Absolute paths.
  // The content of the repository is available under at Deno.cwd().
  // const readmeAbsolute = await Deno.readFile(`${Deno.cwd()}/README.md`);
  // File URLs are also supported.
//   const readmeFileUrl = await Deno.readFile(
//     new URL(`file://${Deno.cwd()}/README.md`),
//   );

  // Decode the Uint8Array as string.
  // const readme = new TextDecoder().decode(readmeRelative);
  return new Response(testFile);
}

console.log("Listening on http://localhost:8080");
await listenAndServe(":8080", handler);
