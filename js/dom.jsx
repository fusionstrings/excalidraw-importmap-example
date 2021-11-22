import * as React from "react";
import * as ReactDOM from "react-dom";
import Draw from "./draw.jsx";

function main({ mountElementID, initialData } = { mountElementID: "root" }) {
	if (typeof document !== "undefined") {
		const rootElement = document.getElementById(mountElementID);
		ReactDOM.render(
			<React.StrictMode>
				<Draw initialData={initialData} />
			</React.StrictMode>,
			rootElement,
		);
	}
}

if (import.meta?.main) {
	main();
}

export { main };
