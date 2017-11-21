export default class Utils {




	// --------------------------------------------------------
	// CONSTRUCTOR
	// --------------------------------------------------------

	constructor(context) {
		this.sketch = context.api()
		this.document = this.sketch.selectedDocument
		this.doc = context.document
		this.objectsToUpdate = new Array()
	}




	// --------------------------------------------------------
	// VALIDATION FUNCTIONS
	// --------------------------------------------------------

	isPaddingSet(selectedObject) {
		value = (selectedObject.name.split("p[")[1]) ? true : false
		return value
	}

	isSpacingSet(selectedObject) {
		value = (selectedObject.name.split("s[")[1]) ? true : false
		return value
	}

	isAutoSet(selectedObject) {
		value = (selectedObject.name.split("-t")[1]) ? true : false
		return value
	}

	validatePadding(padding) {
		value = (/^([0-9]{1,3}){1}(\s{1}[0-9]{1,3}){0,3}$/.test(padding)) ? true : false
		return value
	}

	validateSpacing(spacing) {
		value = (/^[0-9]{1,3}$/.test(spacing)) ? true : false
		return value
	}




	// --------------------------------------------------------
	// FIND OBJECTS TO UPDATE Including parents
	// --------------------------------------------------------

	findObjectsToUpdate(selectedObject) {

		// Create object with selected object and plugin update value
		var objectToAdd = {object: selectedObject, pluginUpdate: false}

		// If object is group add it to objects to update
		if (selectedObject.isGroup) {

			// If auto update is set change plugin update value
			if (this.isAutoSet(selectedObject)) {
				objectToAdd.pluginUpdate = true
			}
			this.objectsToUpdate.push(objectToAdd)
		}

		// If parent is not page call function again
		if(!selectedObject.container.isPage) {
			this.findObjectsToUpdate(selectedObject.container)
		}
	}




	// --------------------------------------------------------
	// PADDING Set padding between group sub-layers and Bg
	// --------------------------------------------------------

	padding(selectedObject) {
		var self = this

		// Check if selectedObject is a group
		if (selectedObject.isGroup) {

			var firstInit = true,
				paddingString = '',
				padding = []

			// Check if padding is set or ask for the user to insert padding
			if (!self.isPaddingSet(selectedObject)) {

				// Ask user to insert padding
				paddingString = self.sketch.getStringFromUser('Insert separated padding values (es. 16 16 16 16).', '')

				// If padding is valid print padding in group name
				if (self.validatePadding(paddingString)) {
					selectedObject.name = selectedObject.name + ' p[' + paddingString + ']'
				}

			} else {

				// If padding is not set get padding values from layer name
				paddingString = selectedObject.name.split("p[")[1].split("]")[0]
			}

			// If padding string is valid transform into array
			if (self.validatePadding(paddingString)) {
				padding = paddingString.split(" ")
			}

			// If padding is valid execute plugin
			if ((padding.length > 0) && (padding.length <= 4)) {

				// Assign padding values based on input format
				if (padding.length == 1) {
					var paddingT = Number(padding[0]),
						paddingR = Number(padding[0]),
						paddingB = Number(padding[0]),
						paddingL = Number(padding[0])
				} else if (padding.length == 2) {
					var paddingT = Number(padding[0]),
						paddingR = Number(padding[1]),
						paddingB = Number(padding[0]),
						paddingL = Number(padding[1])
				} else if (padding.length == 3) {
					var paddingT = Number(padding[0]),
						paddingR = Number(padding[1]),
						paddingB = Number(padding[2]),
						paddingL = Number(padding[1])
				} else if (padding.length == 4) {
					var paddingT = Number(padding[0]),
						paddingR = Number(padding[1]),
						paddingB = Number(padding[2]),
						paddingL = Number(padding[3])
				}

				// Set vars
				var firstChild = true,
					bgCount = 0,
					wrapperX = 0,
					wrapperY = 0,
					wrapperWidth = 0,
					wrapperHeight = 0,
					groupFrame = selectedObject.frame,
					groupAbsoluteRect = selectedObject.sketchObject.absoluteRect(),
					groupAbsoluteXpos = groupAbsoluteRect.x(),
					groupAbsoluteYpos = groupAbsoluteRect.y()

				// Iterate through object sub-layers and get content dimensions excluding background
				selectedObject.iterate(function(layer) {

					// Get layer class name
					var layerClass = layer.sketchObject.class()

					// If selected object is symbol use old API to set vars else use new API
					if (layerClass == "MSSymbolInstance") {
						
						var object = layer.sketchObject,
							objectRect = object.absoluteRect(),
							objectWidth = objectRect.width(),
							objectHeight = objectRect.height(),
							objectX = objectRect.x() - groupAbsoluteXpos,
							objectY = objectRect.y() - groupAbsoluteYpos

							log('X: ' + objectX + ', Y: ' + objectY + ', W: ' + objectWidth + ', H: ' + objectHeight)

					} else {

						var object = layer,
							objectRect = layer.frame,
							objectWidth = objectRect.width,
							objectHeight = objectRect.height,
							objectX = objectRect.x,
							objectY = objectRect.y

					}

					// Check if sub-layer is not background
					if(layer.name != "Bg") {

						// If first child assign variables else calulate new frame position and dimension
						if (firstChild) {

							wrapperX = objectX
							wrapperY = objectY
							wrapperWidth = objectWidth
							wrapperHeight = objectHeight
							firstChild = false

						} else {

							if (objectX < wrapperX) {
								deltaX = wrapperX - objectX
								wrapperX = objectX
								wrapperWidth = wrapperWidth + deltaX
							}

							if (objectY < wrapperY) {
								deltaY = wrapperY - objectY
								wrapperY = objectY
								wrapperHeight = wrapperHeight + deltaY
							}

							if (objectX + objectWidth > wrapperX + wrapperWidth) {
								wrapperWidth = objectX + objectWidth - wrapperX
							}
							if (objectY + objectHeight > wrapperY + wrapperHeight) {
								wrapperHeight = objectY + objectHeight - wrapperY
							}
						}
					}

				});

				// Calculate background dimensions
				backgroundX = wrapperX - paddingL
				backgroundY = wrapperY - paddingT
				backgroundWidth = wrapperWidth + paddingL + paddingR
				backgroundHeight = wrapperHeight + paddingT + paddingB

				// Get group background and set its dimensions and position
				selectedObject.iterate(function(layer) {
					if (layer.name == "Bg") {
						bgCount++
						layer.frame = new self.sketch.Rectangle(backgroundX,backgroundY,backgroundWidth,backgroundHeight)
					}
				})

				// If there's no background create one
				if(!bgCount) {
					newLayer = selectedObject.newShape({frame: new self.sketch.Rectangle(backgroundX,backgroundY,backgroundWidth,backgroundHeight), name:"Bg"})
					newLayer.addToSelection()
					newLayer.moveToBack()
				}

				// Resize group to fit children
				selectedObject.adjustToFit()

			} else {

				// Fallback message if padding value is not valid
				self.showMessage("Invalid padding value")

			}

		} else {

			// Fallback message if selcted object is not a group
			self.showMessage("You must select a group")

		}
	}





	// --------------------------------------------------------
	// SPACING Set vertical spacing between group sub-layers
	// --------------------------------------------------------

	spacing(selectedObject) {
		var self = this

		var spacingString = '',
			spacing = -1,
			firstSpacing = 0,
			subLayers = [],
			layerOffset = []

		// Check if selectedObject is a group
		if (selectedObject.isGroup) {


			// Check if spacing is set or ask for the user to insert spacing
			if (!self.isSpacingSet(selectedObject)) {

				// Ask user to insert spacing
				spacingString = self.sketch.getStringFromUser('Insert spacing value (es. 16).', '')

				// If spacing is valid print spacing in group name
				if (self.validateSpacing(spacingString)) {
					selectedObject.name = selectedObject.name + ' s[' + spacingString + ']'
				}

			} else {

				// If spacing is not set get spacing values from layer name
				spacingString = selectedObject.name.split("s[")[1].split("]")[0]
			}

			// If spacing string is valid transform into array
			if (self.validateSpacing(spacingString)) {
				spacing = Number(spacingString)
			}

			// If spacing is valid execute plugin
			if (spacing>=0) {

				// Check if padding was set and add padding to first spacing
				if (self.isPaddingSet(selectedObject)) {
					padding = selectedObject.name.split("p[")[1].split("]")[0].split(" ")
					firstSpacing = Number(padding[0])
				}

				// Initial offset y
				var offsetY = firstSpacing,
					groupFrame = selectedObject.frame,
					groupAbsoluteRect = selectedObject.sketchObject.absoluteRect(),
					groupAbsoluteXpos = groupAbsoluteRect.x(),
					groupAbsoluteYpos = groupAbsoluteRect.y()

				// Order sub-layers based on their y position
				selectedObject.iterate(function(layer) {

					// Get layer class name
					var layerClass = layer.sketchObject.class()

					// If selected object is symbol use old API to set vars else use new API
					if (layerClass == "MSSymbolInstance") {
						var object = layer.sketchObject,
							objectRect = object.absoluteRect(),
							objectX = objectRect.x() - groupAbsoluteXpos,
							objectY = objectRect.y() - groupAbsoluteYpos,
							objectWidth = objectRect.width(),
							objectHeight = objectRect.height()
					} else {
						var object = layer,
							objectRect = object.frame,
							objectX = objectRect.x,
							objectY = objectRect.y,
							objectWidth = objectRect.width,
							objectHeight = objectRect.height
					}

					// Push vars into sub layer array
					subLayers.push([layer, objectX, objectY, objectWidth, objectHeight])
				})

				// Sort sub layers array by object y position
				subLayers = subLayers.sort(self.comparator)

				// Cycle through layers array and set y position
				var arrayLength = subLayers.length
				for (var i = 0; i < arrayLength; i++) {
					var layer = subLayers[i][0]

					// Get layer class name
					var layerClass = layer.sketchObject.class()

					// Set new object y to previous offset
					newObjectY = offsetY

					// If selected object is symbol use old API to set new values
					if (layerClass == "MSSymbolInstance") {

						object = layer.sketchObject
						objectRect = object.absoluteRect()
						objectRect.x = subLayers[i][1] + groupAbsoluteXpos
						objectRect.y = newObjectY + groupAbsoluteYpos
						objectRect.width = subLayers[i][3]
						objectRect.height = subLayers[i][4]

					} else if (layer.name != "Bg") {

						layer.frame = new self.sketch.Rectangle(subLayers[i][1], newObjectY, subLayers[i][3], subLayers[i][4])

					}

					offsetY = newObjectY + subLayers[i][4] + spacing
						
				}

				// Resize group to fit children
				selectedObject.adjustToFit();

			} else {

				// Fallback message if spacing value is not valid
				self.showMessage("Invalid spacing value");

			}

		} else {

			// Fallback message if selcted object is not a group
			self.showMessage("You must select a group");

		}
	}




	// --------------------------------------------------------
	// SERVICE FUNCTIONS
	// --------------------------------------------------------

	showMessage(message){
		this.doc.showMessage(message)
	}

	comparator(a, b) {
		if (a[2] < b[2]) return -1
		if (a[2] > b[2]) return 1
		return 0
	}
}