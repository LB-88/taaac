import Utils from "./utils.js";

export default function(context) {

	var utils = new Utils(context)

	utils.selection = utils.document.selectedLayers

	// Iterate through selected objects
	utils.selection.iterate(function(selectedObject) {

		if (selectedObject.isGroup) {
			utils.settings(context)
		} else {
			// Fallback message if selcted object is not a group
			self.showMessage("You must select a group")
		}

	})
}