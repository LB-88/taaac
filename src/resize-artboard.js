import Utils from "./utils.js";

export default function(context) {

	var utils = new Utils(context)

	utils.selection = utils.document.selectedLayers

	// Iterate through selected objects
	utils.selection.iterate(function(selectedObject) {

		// Check if selected object is artboard
		if (selectedObject.isArtboard) {

			utils.resizeArtboard(selectedObject)
		}

	})

}