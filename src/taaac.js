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

			// Check if plugin update is set to true
			if (objectToUpdate.pluginUpdate) {

				// Check if Taaac is set and auto update is true
				if ((utils.isTaaacSet(objectToUpdate.object)) && (utils.isAutoUpdateSet(objectToUpdate.object))) {

					// Call spacing and padding functions
					utils.spacing(objectToUpdate.object)
					utils.padding(objectToUpdate.object)
				}

			// Else adjust size to fit children
			} else {
				objectToUpdate.object.adjustToFit()
			}
		})

	})

}