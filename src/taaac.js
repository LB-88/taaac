import Utils from "./utils.js";

export function taaac (context) {
	
	var utils = new Utils(context)

	utils.selection = context.actionContext.oldSelection

	taaacCheck = false

	// Iterate through previously selected objects
	utils.document.iterateWithNativeLayers(utils.selection, function(selectedObject) {

		// Check if selected object is a group
		if (selectedObject.isGroup) {
			log('enter')
			
			// Check if taaac was set
			taaacCheck = selectedObject.name.split("-t")[1];
			if (taaacCheck) {
				utils.spacing(selectedObject)
				utils.padding(selectedObject)
				taaacCheck = false
			}

		} else {
			log('enter2')

			selectedObject = selectedObject.container

			// Check if taaac was set
			taaacCheck = selectedObject.name.split("-t")[1];
			if (taaacCheck) {
				utils.spacing(selectedObject)
				utils.padding(selectedObject)
				taaacCheck = false
			}

		}

	})

}