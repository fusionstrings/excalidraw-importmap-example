import * as React from "react";
import * as ReactDOM from "react-dom";
import Draw from "./draw.jsx";

async function main({ mountElementID } = { mountElementID: "root" }) {
	if (typeof document !== "undefined") {
		const rootElement = document.getElementById(mountElementID);
		ReactDOM.render(
			<React.StrictMode>
				<Draw />
			</React.StrictMode>,
			rootElement,
		);
	}
}

if (import.meta.main) {
	main();
}

export { main };
