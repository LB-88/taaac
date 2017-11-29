export default class Utils {




	// --------------------------------------------------------
	// CONSTRUCTOR
	// --------------------------------------------------------

	constructor(context) {
		this.sketch = context.api()
		this.document = this.sketch.selectedDocument
		this.doc = (context.document) ? context.document : context.actionContext.document
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

			// If values are not null set fields values and call functions
			if ((spacingValue!="") && (spacingValue!=null)) {
				spacingTextField.setStringValue(spacingValue)
				this.spacing(selectedObject)
			}
			if ((paddingValue!="") && (paddingValue!=null)) {
				paddingTextField.setStringValue(paddingValue)
				this.padding(selectedObject)
			}
			if ((autoUpdateValue!="") && (autoUpdateValue!=null)) {
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
			if (((spacingString=="") || (spacingString==null)) && ((paddingString=="") || (paddingString==null))) {
				isTaaacSet = false
			}

			// Validate and store values
			this.command.setValue_forKey_onLayer_forPluginIdentifier(isTaaacSet, 'isTaaacSet', selectedObject.sketchObject, 'taaac')
			if ((spacingString=="") || (spacingString==null)) {
				this.command.setValue_forKey_onLayer_forPluginIdentifier('', 'spacing', selectedObject.sketchObject, 'taaac')
			} else if (this.validatePadding(spacingString)) {
				this.command.setValue_forKey_onLayer_forPluginIdentifier(spacingString, 'spacing', selectedObject.sketchObject, 'taaac')
				this.spacing(selectedObject)
			}
			if ((paddingString=="") || (paddingString==null)) {
				this.command.setValue_forKey_onLayer_forPluginIdentifier('', 'padding', selectedObject.sketchObject, 'taaac')
			} else if (this.validatePadding(paddingString)) {
				this.command.setValue_forKey_onLayer_forPluginIdentifier(paddingString, 'padding', selectedObject.sketchObject, 'taaac')
				this.padding(selectedObject)
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

	isAvoidPaddingSet(selectedObject) {
		if (selectedObject.name) {
			name = selectedObject.name
		} else {
			name = selectedObject.sketchObject.name()
		}
		value = (name.split("(-")[1]) ? true : false
		return value
	}

	isTaaacSet(selectedObject) {
		value = this.command.valueForKey_onLayer_forPluginIdentifier('isTaaacSet', selectedObject.sketchObject, 'taaac') ? true : false
		return value
	}

	isAutoUpdateSet(selectedObject) {
		autoUpdate = this.command.valueForKey_onLayer_forPluginIdentifier('autoUpdate', selectedObject.sketchObject, 'taaac')
		value = (autoUpdate == 1) ? true : false
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
			if (this.isAutoUpdateSet(selectedObject)) {
				objectToAdd.pluginUpdate = true
			}
			this.objectsToUpdate.push(objectToAdd)
		}

		// If selected object is not symbol and parent is not page call function again
		if ((selectedObject.sketchObject.class() == null) || (selectedObject.sketchObject.class() != "MSSymbolInstance")) {
			if (!selectedObject.container.isPage) {
				this.findObjectsToUpdate(selectedObject.container)
			}
		}


	}




	// --------------------------------------------------------
	// PADDING Set padding between group sub-layers and Bg
	// --------------------------------------------------------

	padding(selectedObject) {

		// Set vars
		var self = this
		var firstInit = true
		var paddingString = self.command.valueForKey_onLayer_forPluginIdentifier('padding', selectedObject.sketchObject, 'taaac')
		var paddingT = 0
		var paddingR = 0
		var paddingB = 0
		var paddingL = 0

		if ((paddingString!="") && (paddingString!=null)) {
			var padding = paddingString.split(" ")

			// Assign padding values based on input format
			if (padding.length == 1) {
				paddingT = Number(padding[0])
				paddingR = Number(padding[0])
				paddingB = Number(padding[0])
				paddingL = Number(padding[0])
			} else if (padding.length == 2) {
				paddingT = Number(padding[0])
				paddingR = Number(padding[1])
				paddingB = Number(padding[0])
				paddingL = Number(padding[1])
			} else if (padding.length == 3) {
				paddingT = Number(padding[0])
				paddingR = Number(padding[1])
				paddingB = Number(padding[2])
				paddingL = Number(padding[1])
			} else if (padding.length == 4) {
				paddingT = Number(padding[0])
				paddingR = Number(padding[1])
				paddingB = Number(padding[2])
				paddingL = Number(padding[3])
			}
		}

		// Set vars
		var firstChild = true
		var bgCount = 0
		var wrapperX = 0
		var wrapperY = 0
		var wrapperWidth = 0
		var wrapperHeight = 0
		var groupFrame = selectedObject.frame
		var groupAbsoluteRect = selectedObject.sketchObject.absoluteRect()
		var groupAbsoluteXpos = groupAbsoluteRect.x()
		var groupAbsoluteYpos = groupAbsoluteRect.y()

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

		})

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

		// Set vars
		var self = this
		var paddingString = self.command.valueForKey_onLayer_forPluginIdentifier('padding', selectedObject.sketchObject, 'taaac')
		var spacingString = self.command.valueForKey_onLayer_forPluginIdentifier('spacing', selectedObject.sketchObject, 'taaac')
		var spacing = -1
		var firstSpacing = 0
		var subLayers = []
		var offsetY = 0

		// Transform spacing into number
		spacing = Number(spacingString)

		// Check if padding was set and add padding to first spacing
		if ((paddingString!="") && (paddingString!=null)) {
			padding = paddingString.split(" ")
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