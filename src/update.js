import Utils from "./utils.js";

export default function(context) {

	var utils = new Utils(context)

	utils.selection = utils.document.selectedLayers

	// Iterate through selected objects
	utils.selection.iterate(function(selectedObject) {

		// Check if Taaac is set
		if (utils.isTaaacSet(selectedObject)) {

			// Call spacing function
			utils.spacing(selectedObject)

			// Call padding function
			if (!selectedObject.isArtboard) {
				utils.padding(selectedObject)
			}

			// Call resize function
			if (selectedObject.isArtboard) {
				utils.resizeArtboard(selectedObject)
			}
		}

	})

}