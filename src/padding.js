export default function(context) {

	var sketch = context.api();
	var document = sketch.selectedDocument;
	var selection = document.selectedLayers;
	var doc = context.document;

	// Iterate through selected objects
	selection.iterate(function(selectedObject) {

		// Check if selectedObject is a group
		if (selectedObject.isGroup) {

			var firstInit = true,
				padding = '';

			// Check if plugin was used or ask for the user to insert padding
			padding = selectedObject.name.split("p[")[1];
			if (!padding) {

				// Ask user to insert padding
				padding = sketch.getStringFromUser('Insert separated padding values (es. 16 16 16 16).', '');

				// Validate padding
				// TO DO

				// Print padding in group name
				selectedObject.name = selectedObject.name + ' p[' + padding + ']';

			}

			// Get padding values
			padding = selectedObject.name.split("p[")[1].split("]")[0].split(" ");

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
				groupFrame = selectedObject.frame;


			// Iterate through object sub-layers and get content dimensions excluding background
			selectedObject.iterate(function(layer) {
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
			});

			// Calculate background dimensions
			backgroundX = wrapperX - paddingL;
			backgroundY = wrapperY - paddingT;
			backgroundWidth = wrapperWidth + paddingL + paddingR;
			backgroundHeight = wrapperHeight + paddingT + paddingB;

			// Get group background and set its dimensions and position
			selectedObject.iterate(function(layer) {
				if(layer.name == "Bg") {
					bgCount++;
					layer.frame = new sketch.Rectangle(backgroundX,backgroundY,backgroundWidth,backgroundHeight);
				}
			});

			// If there's no background create one
			if(!bgCount) {

				newLayer = selectedObject.newShape({frame: new sketch.Rectangle(backgroundX,backgroundY,backgroundWidth,backgroundHeight), name:"Bg"});

				newLayer.addToSelection();
				newLayer.moveToBack();
			}

			// Resize group to fit children
			selectedObject.adjustToFit();

		} else {

			// Fallback message if selcted object is not a group
			doc.showMessage("You must select a group");

		}
	});


}
