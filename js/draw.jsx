import * as React from "react";
import { useRef, useState } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import InitialData from "../data/initial-data.js";

function Draw() {
	const excalidrawRef = useRef(null);

	const [viewModeEnabled, setViewModeEnabled] = useState(false);
	const [zenModeEnabled, setZenModeEnabled] = useState(true);
	const [gridModeEnabled, setGridModeEnabled] = useState(false);

	return (
		<div className="excalidraw-wrapper">
			<Excalidraw.default
				ref={excalidrawRef}
				initialData={InitialData}
				onChange={(elements, state) =>
					console.log(
						"Elements :",
						elements,
						"State : ",
						state,
					)}
				onPointerUpdate={(payload) => console.log(payload)}
				onCollabButtonClick={() =>
					window.alert("You clicked on collab button")}
				viewModeEnabled={viewModeEnabled}
				zenModeEnabled={zenModeEnabled}
				gridModeEnabled={gridModeEnabled}
			/>
		</div>
	);
}
export default Draw;
