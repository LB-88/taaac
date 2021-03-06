import Utils from "./utils.js";

export function taaac (context) {

	var utils = new Utils(context)

	utils.selection = context.actionContext.oldSelection

	// Iterate through previously selected objects
	utils.document.iterateWithNativeLayers(utils.selection, function(selectedObject) {

		// Find objects to update including parents
		utils.objectsToUpdate = new Array()
		utils.findObjectsToUpdate(selectedObject, context)

		// Update objects
		utils.objectsToUpdate.forEach(function(objectToUpdate) {

			// Check if plugin update is set to true
			if (objectToUpdate.pluginUpdate) {

				// Check if Taaac is set and auto update is true
				if ((utils.isTaaacSet(objectToUpdate.object)) && (utils.isAutoUpdateSet(objectToUpdate.object))) {

					// If spacing is set call function
					var spacingValue = utils.command.valueForKey_onLayer_forPluginIdentifier('spacing', objectToUpdate.object.sketchObject, 'taaac')
					if ((spacingValue!="") && (spacingValue!=null)) {
						utils.spacing(objectToUpdate.object)
					}

					// If padding is set call function
					var paddingValue = utils.command.valueForKey_onLayer_forPluginIdentifier('padding', objectToUpdate.object.sketchObject, 'taaac')
					if ((paddingValue!="") && (paddingValue!=null)) {
						utils.padding(objectToUpdate.object)
					}

					// If artboard resize it
					if (objectToUpdate.object.isArtboard) {
						utils.resizeArtboard(objectToUpdate.object)
					}

				}

			// Else adjust size to fit children
			} else {
				objectToUpdate.object.adjustToFit()
			}
		})

	})

}