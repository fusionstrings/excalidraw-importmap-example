import { exportToSvg } from "@excalidraw/excalidraw";

async function main(params) {
    const file = await fetch('./data/jspm.org-ia.excalidraw');
    const json = await file.json(file.elements);
    const svg = await exportToSvg({
        elements: json.elements,
        appState: json.appState,
        // exportPadding?: number,
        // metadata?: string,
      });
      console.log(svg);
}

export {main}