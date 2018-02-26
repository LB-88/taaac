import Utils from "./utils.js";

export default function(context) {

	var utils = new Utils(context)

	utils.selection = utils.document.selectedLayers

	// Iterate through selected objects
	utils.selection.iterate(function(selectedObject) {

		// Check if selected object is group
		if (selectedObject.isGroup) {

			// Check if selected object is artboard
			if (selectedObject.isArtboard) {
				utils.showMessage("Artboard");
			}

			// Show dialog
			utils.showDialog(selectedObject)

		// Else show fallback message
		} else {

			// Fallback message if selcted object is not a group
			utils.showMessage("You must select a group")
		}

	})
}