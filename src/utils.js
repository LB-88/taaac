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
				padding = [];

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
						paddingL = Number(padding[0]);
				} else if (padding.length == 2) {
					var paddingT = Number(padding[0]),
						paddingR = Number(padding[1]),
						paddingB = Number(padding[0]),
						paddingL = Number(padding[1]);
				} else if (padding.length == 3) {
					var paddingT = Number(padding[0]),
						paddingR = Number(padding[1]),
						paddingB = Number(padding[2]),
						paddingL = Number(padding[1]);
				} else if (padding.length == 4) {
					var paddingT = Number(padding[0]),
						paddingR = Number(padding[1]),
						paddingB = Number(padding[2]),
						paddingL = Number(padding[3]);
				}

				// Set vars
				var firstChild = true,
					bgCount = 0,
					wrapperX = 0,
					wrapperY = 0,
					wrapperWidth = 0,
					wrapperHeight = 0,
					groupFrame = selectedObject.frame


				// Iterate through object sub-layers and get content dimensions excluding background
				selectedObject.iterate(function(layer) {
					var layerClass = layer.sketchObject.class()

					// If selected object is symbol use old API
					if (layerClass == "MSSymbolInstance") {
						var symbol = layer.sketchObject,
							symbolAbsoluteRect = symbol.absoluteRect(),
							symbolAbsoluteWidth = symbolAbsoluteRect.width(),
							symbolAbsoluteHeight = symbolAbsoluteRect.height(),
							symbolAbsoluteXpos = symbolAbsoluteRect.x(),
							symbolAbsoluteYpos = symbolAbsoluteRect.y();


						log('X: ' + symbolAbsoluteXpos)

					} else {

						// If selected object is not symbol use new API
						log('default')
						frame = layer.frame;

						// Check if sub-layer is not background
						if(layer.name != "Bg") {
							if (firstChild) {
								// If first child assign variables
								wrapperX = frame.x;
								wrapperY = frame.y;
								wrapperWidth = frame.width;
								wrapperHeight = frame.height;
								firstChild = false;
							} else {
								// If not first child calculate frame new position and width

								if (frame.x < wrapperX) {
									deltaX = wrapperX - frame.x;
									wrapperX = frame.x;
									wrapperWidth = wrapperWidth + deltaX;
								}
								if (frame.y < wrapperY) {
									deltaY = wrapperY - frame.y;
									wrapperY = frame.y;
									wrapperHeight = wrapperHeight + deltaY;
								}
								if (frame.x + frame.width > wrapperX + wrapperWidth) {
									wrapperWidth = frame.x + frame.width - wrapperX;
								}
								if (frame.y + frame.height > wrapperY + wrapperHeight) {
									wrapperHeight = frame.y + frame.height - wrapperY;
								}
							}
						}

					}
				});

				// // Calculate background dimensions
				// backgroundX = wrapperX - paddingL;
				// backgroundY = wrapperY - paddingT;
				// backgroundWidth = wrapperWidth + paddingL + paddingR;
				// backgroundHeight = wrapperHeight + paddingT + paddingB;

				// // Get group background and set its dimensions and position
				// selectedObject.iterate(function(layer) {
				// 	if(layer.name == "Bg") {
				// 		bgCount++;
				// 		layer.frame = new self.sketch.Rectangle(backgroundX,backgroundY,backgroundWidth,backgroundHeight);
				// 	}
				// });

				// // If there's no background create one
				// if(!bgCount) {

				// 	newLayer = selectedObject.newShape({frame: new self.sketch.Rectangle(backgroundX,backgroundY,backgroundWidth,backgroundHeight), name:"Bg"});

				// 	newLayer.addToSelection();
				// 	newLayer.moveToBack();
				// }

				// // Resize group to fit children
				// selectedObject.adjustToFit();

			} else {

				// Fallback message if padding value is not valid
				self.showMessage("Invalid padding value");

			}

		} else {

			// Fallback message if selcted object is not a group
			self.showMessage("You must select a group");

		}
	}





	// --------------------------------------------------------
	// SPACING Set vertical spacing between group sub-layers
	// --------------------------------------------------------

	spacing(selectedObject) {
		// var self = this

		// var spacingString = '',
		// 	spacing = -1,
		// 	firstSpacing = 0,
		// 	subLayers = [],
		// 	layerOffset = [];

		// // Check if selectedObject is a group
		// if (selectedObject.isGroup) {


		// 	// Check if spacing is set or ask for the user to insert spacing
		// 	if (!self.isSpacingSet(selectedObject)) {

		// 		// Ask user to insert spacing
		// 		spacingString = self.sketch.getStringFromUser('Insert spacing value (es. 16).', '')

		// 		// If spacing is valid print spacing in group name
		// 		if (self.validateSpacing(spacingString)) {
		// 			selectedObject.name = selectedObject.name + ' s[' + spacingString + ']'
		// 		}

		// 	} else {

		// 		// If spacing is not set get spacing values from layer name
		// 		spacingString = selectedObject.name.split("s[")[1].split("]")[0]
		// 	}

		// 	// If spacing string is valid transform into array
		// 	if (self.validateSpacing(spacingString)) {
		// 		spacing = Number(spacingString)
		// 	}

		// 	// If spacing is valid execute plugin
		// 	if (spacing>=0) {

		// 		// Check if padding was set and add padding to first spacing
		// 		if (self.isPaddingSet(selectedObject)) {
		// 			padding = selectedObject.name.split("p[")[1].split("]")[0].split(" ")
		// 			firstSpacing = Number(padding[0])
		// 		}

		// 		// Initial offset y
		// 		var offsetY = firstSpacing;

		// 		// Order sub-layers based on their y position
		// 		selectedObject.iterate(function(layer) {
		// 			subLayers.push([layer, layer.frame.y]);
		// 		});
		// 		subLayers = subLayers.sort(self.comparator);

		// 		// Cycle through layers array and set y position
		// 		var arrayLength = subLayers.length
		// 		for (var i = 0; i < arrayLength; i++) {
		// 			layer = subLayers[i][0]
		// 			if(layer.name != "Bg") {
		// 				frame = layer.frame
		// 				newFrameY = offsetY
		// 				offsetY = newFrameY + frame.height + spacing
		// 				layer.frame = new self.sketch.Rectangle(frame.x,newFrameY,frame.width,frame.height)
		// 			}
		// 		}

		// 		// Resize group to fit children
		// 		selectedObject.adjustToFit();

		// 	} else {

		// 		// Fallback message if spacing value is not valid
		// 		self.showMessage("Invalid spacing value");

		// 	}

		// } else {

		// 	// Fallback message if selcted object is not a group
		// 	self.showMessage("You must select a group");

		// }
	}




	// --------------------------------------------------------
	// SERVICE FUNCTIONS
	// --------------------------------------------------------

	showMessage(message){
		this.doc.showMessage(message)
	}

	comparator(a, b) {
		if (a[1] < b[1]) return -1
		if (a[1] > b[1]) return 1
		return 0
	}
}