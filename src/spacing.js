var global = {}

export default function(context) {

	var sketch = context.api();
	var document = sketch.selectedDocument;
	var selection = document.selectedLayers;
	var doc = context.document;
	var subLayers = [];
	var layerOffset = [];

	// Sub-layers ordering funcion
	function Comparator(a, b) {
		if (a[1] < b[1]) return -1;
		if (a[1] > b[1]) return 1;
		return 0;
	}

	// Iterate through selected objects
	selection.iterate(function(selectedObject) {

		// Check if selectedObject is a group
		if (selectedObject.isGroup) {

			// Check if plugin was used or ask for the user to insert flow gutter
			spacing = selectedObject.name.split("s[")[1];
			if (!spacing) {

				// Ask user to insert padding
				spacing = sketch.getStringFromUser('Insert spacing value (es. 16).', '');

				// Validate spacing
				// TO DO

				// Print spacing in group name
				selectedObject.name = selectedObject.name + ' s[' + spacing + ']';

			}

			// Get spacing value
			spacing = selectedObject.name.split("s[")[1].split("]")[0];

			// Check if padding was set and add padding top
			initialSpacing = 0;
			padding = selectedObject.name.split("p[")[1];
			if (padding) {
				padding = selectedObject.name.split("p[")[1].split("]")[0].split(" ");
				initialSpacing = Number(padding[0]);
			}

			// Initial spacing
			var prevY = initialSpacing;

			// Order sub-layers based on their y position
			selectedObject.iterate(function(layer) {
				subLayers.push([layer, layer.frame.y]);
			});
			subLayers = subLayers.sort(Comparator);

			// Cycle through layers array
			var arrayLength = subLayers.length;
			for (var i = 0; i < arrayLength; i++) {
				layer = subLayers[i][0];
				if(layer.name != "Bg") {
					frame = layer.frame;
					newFrameY = prevY;
					log(layer.frame.costraints);
					prevY = newFrameY + frame.height + Number(spacing);
					layer.frame = new sketch.Rectangle(frame.x,newFrameY,frame.width,frame.height);
				}
			}

			// Resize group to fit children
			selectedObject.adjustToFit();

		} else {

			// Fallback message if selcted object is not a group
			doc.showMessage("You must select a group");

		}
	});


}