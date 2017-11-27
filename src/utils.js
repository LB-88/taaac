export default class Utils {




	// --------------------------------------------------------
	// CONSTRUCTOR
	// --------------------------------------------------------

	constructor(context) {
		this.sketch = context.api()
		this.document = this.sketch.selectedDocument
		this.doc = context.document
		this.objectsToUpdate = new Array()
		this.command = context.command
	}




	// --------------------------------------------------------
	// CREATE DIALOG WINDOW
	// --------------------------------------------------------

	createDialog(selectedObject) {
		
		// Setup the window
		var alert = COSAlertWindow.new()
		alert.setMessageText("Configure Taaac")
		alert.addButtonWithTitle("Ok")
		alert.addButtonWithTitle("Cancel")

		// Create the main view
		var viewWidth = 400,
			viewHeight = 150,
			viewSpacer = 10

		var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight))
		alert.addAccessoryView(view)

		// Create labels
		var description = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 33, (viewWidth - 100), 35))
		var paddingLabel = NSTextField.alloc().initWithFrame(NSMakeRect(-1, viewHeight - 65, (viewWidth / 2) - 10, 20))
		var spacingLabel = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 65, (viewWidth / 2) - 10, 20))

		// Configure labels
		description.setStringValue('Set values for padding and spacing. Check "Auto update" to refresh Taaac on selection change.')
		description.setSelectable(false)
		description.setEditable(false)
		description.setBezeled(false)
		description.setDrawsBackground(false)

		paddingLabel.setStringValue("Padding")
		paddingLabel.setSelectable(false)
		paddingLabel.setEditable(false)
		paddingLabel.setBezeled(false)
		paddingLabel.setDrawsBackground(false)

		spacingLabel.setStringValue("Spacing")
		spacingLabel.setSelectable(false)
		spacingLabel.setEditable(false)
		spacingLabel.setBezeled(false)
		spacingLabel.setDrawsBackground(false)

		// Add labels
		view.addSubview(description)
		view.addSubview(paddingLabel)
		view.addSubview(spacingLabel)

		// Create textfields
		paddingTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, 130, 20))
		spacingTextField = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 85, 130, 20))

		// Create checkboxes
		autoUpdateCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 125, viewWidth - viewSpacer, 20))

		// Configure checkboxes
		autoUpdateCheckbox.setButtonType(NSSwitchButton)
		autoUpdateCheckbox.setBezelStyle(0)
		autoUpdateCheckbox.setTitle("Auto update")
		autoUpdateCheckbox.setState(NSOnState)

		// Add fields
		view.addSubview(paddingTextField)
		view.addSubview(spacingTextField)
		view.addSubview(autoUpdateCheckbox)

		// Get selected object values
		var isTaaacSetValue = this.command.valueForKey_onLayer_forPluginIdentifier('isTaaacSet', selectedObject.sketchObject, 'taaac')
		if (isTaaacSetValue) {
			var paddingValue = this.command.valueForKey_onLayer_forPluginIdentifier('padding', selectedObject.sketchObject, 'taaac')
			var spacingValue = this.command.valueForKey_onLayer_forPluginIdentifier('spacing', selectedObject.sketchObject, 'taaac')
			var autoUpdateValue = this.command.valueForKey_onLayer_forPluginIdentifier('autoUpdate', selectedObject.sketchObject, 'taaac')

			// If values are not null set fields values
			if (paddingValue!="") {
				paddingTextField.setStringValue(paddingValue)
			}
			if (spacingValue!="") {
				spacingTextField.setStringValue(spacingValue)
			}
			if (autoUpdateValue!="") {
				if (autoUpdateValue=="1") {
					autoUpdateCheckbox.setState(NSOnState)
				} else {
					autoUpdateCheckbox.setState(NSOffState)
				}
			}
		}

		// Show the dialog
		return [alert]
	}





	// --------------------------------------------------------
	// STORE DIALOG WINDOW INPUT
	// --------------------------------------------------------

	storeDialogInput(response, selectedObject) {

		// Check if user clicked on Ok button
		if (response == "1000") {

			// Get values from fields
			var paddingString = paddingTextField.stringValue()
			var spacingString = spacingTextField.stringValue()
			var autoUpdate = autoUpdateCheckbox.stringValue()
			var isTaaacSet = true
			if ((spacingString=="") && (paddingString=="")) {
				isTaaacSet = false
			}

			// Validate and store values
			this.command.setValue_forKey_onLayer_forPluginIdentifier(isTaaacSet, 'isTaaacSet', selectedObject.sketchObject, 'taaac')
			if (spacingString=="") {
				this.command.setValue_forKey_onLayer_forPluginIdentifier('', 'spacing', selectedObject.sketchObject, 'taaac')
			} else if (this.validatePadding(spacingString)) {
				this.command.setValue_forKey_onLayer_forPluginIdentifier(spacingString, 'spacing', selectedObject.sketchObject, 'taaac')
			}
			if (paddingString=="") {
				this.command.setValue_forKey_onLayer_forPluginIdentifier('', 'padding', selectedObject.sketchObject, 'taaac')
			} else if (this.validatePadding(paddingString)) {
				this.command.setValue_forKey_onLayer_forPluginIdentifier(paddingString, 'padding', selectedObject.sketchObject, 'taaac')
			}
			this.command.setValue_forKey_onLayer_forPluginIdentifier(autoUpdate, 'autoUpdate', selectedObject.sketchObject, 'taaac')
		}
	}




	// --------------------------------------------------------
	// SHOW DIALOG WINDOW AND STORE VALUES
	// --------------------------------------------------------

	showDialog(selectedObject) {
		var window = this.createDialog(selectedObject)
		var alert = window[0]
		
		// Show dialog window and store the 'response' in a variable
		var response = alert.runModal()

		// Get user input and store it in selected object
		this.storeDialogInput(response, selectedObject)
	}




	// --------------------------------------------------------
	// VALIDATION FUNCTIONS
	// --------------------------------------------------------

	isPaddingSet(selectedObject) {
		value = (selectedObject.name.split("p[")[1]) ? true : false
		return value
	}

	isAvoidPaddingSet(selectedObject) {
		value = (selectedObject.name.split("p[-")[1]) ? true : false
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

		// If selcted object is not symbol and parent is not page call function again
		if ((selectedObject.sketchObject.class() != "MSSymbolInstance") && (!selectedObject.container.isPage)) {
			this.findObjectsToUpdate(selectedObject.container)
		}
	}




	// --------------------------------------------------------
	// PADDING Set padding between group sub-layers and Bg
	// --------------------------------------------------------

	padding(selectedObject) {
		var self = this

		var firstInit = true
		var paddingString = this.command.valueForKey_onLayer_forPluginIdentifier('padding', selectedObject.sketchObject, 'taaac')
		var padding = paddingString.split(" ")

		log(paddingString + ' ' + padding)

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

			} else {

				var object = layer,
					objectRect = layer.frame,
					objectWidth = objectRect.width,
					objectHeight = objectRect.height,
					objectX = objectRect.x,
					objectY = objectRect.y

			}

			// Check if sub-layer has avoid padding set
			if (self.isAvoidPaddingSet(layer)) {
				objectX = objectX + paddingL
				objectY = objectY + paddingT
				objectWidth = objectWidth - paddingL - paddingR
				objectHeight = objectHeight - paddingT - paddingB
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
			offsetY = 0

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

				// Set vars
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
				var arrayLength = subLayers.length,
					firstSubLayer = true

				for (var i = 0; i < arrayLength; i++) {
					var layer = subLayers[i][0]

					// Get layer class name
					var layerClass = layer.sketchObject.class()

					// Ignore background layer
					if (layer.name != "Bg") {

						// If first child has avoid padding set remove initial offset
						if (firstSubLayer) {
							if ((layerClass != "MSSymbolInstance") && (self.isAvoidPaddingSet(layer))) { offsetY = 0 }
							firstSubLayer = false
						}

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

						} else {

							layer.frame = new self.sketch.Rectangle(subLayers[i][1], newObjectY, subLayers[i][3], subLayers[i][4])

						}

						offsetY = newObjectY + subLayers[i][4] + spacing

					}

				}

				// Resize group to fit children
				selectedObject.adjustToFit()

			} else {

				// Fallback message if spacing value is not valid
				self.showMessage("Invalid spacing value")

			}

		} else {

			// Fallback message if selcted object is not a group
			self.showMessage("You must select a group")

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