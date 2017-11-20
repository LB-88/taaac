import Utils from "./utils.js";

export function taaac (context) {

	var utils = new Utils(context)

	utils.selection = context.actionContext.oldSelection

	// Iterate through previously selected objects
	utils.document.iterateWithNativeLayers(utils.selection, function(selectedObject) {

		// Find objects to update including parents
		utils.objectsToUpdate = new Array()
		utils.findObjectsToUpdate(selectedObject)

		// Update objects
		utils.objectsToUpdate.forEach(function(objectToUpdate) {
			if (objectToUpdate.pluginUpdate) {
				if (utils.isSpacingSet(objectToUpdate.object)) {
					utils.spacing(objectToUpdate.object)
				}
				if (utils.isPaddingSet(objectToUpdate.object)) {
					utils.padding(objectToUpdate.object)
				}
			} else {
				objectToUpdate.object.adjustToFit();
			}
		})

	})

}