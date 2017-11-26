var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (context) {

	var utils = new _utils2["default"](context);

	utils.selection = utils.document.selectedLayers;

	// Iterate through selected objects
	utils.selection.iterate(function (selectedObject) {

		if (selectedObject.isGroup) {
			utils.settings(selectedObject);
		} else {
			// Fallback message if selcted object is not a group
			self.showMessage("You must select a group");
		}
	});
};

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/***/ }),
/* 1 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {

	// --------------------------------------------------------
	// CONSTRUCTOR
	// --------------------------------------------------------

	function Utils(context) {
		_classCallCheck(this, Utils);

		this.sketch = context.api();
		this.document = this.sketch.selectedDocument;
		this.doc = context.document;
		this.objectsToUpdate = new Array();
		this.command = context.command;
	}

	// --------------------------------------------------------
	// DIALOG WINDOW
	// --------------------------------------------------------

	_createClass(Utils, [{
		key: "createWindow",
		value: function () {
			function createWindow() {
				// Setup the window
				var alert = COSAlertWindow["new"]();
				alert.setMessageText("Configure Taaac");
				alert.addButtonWithTitle("Ok");
				alert.addButtonWithTitle("Cancel");

				// Create the main view
				var viewWidth = 400,
				    viewHeight = 150,
				    viewSpacer = 10;

				var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
				alert.addAccessoryView(view);

				// Create labels
				var description = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 33, viewWidth - 100, 35));
				var paddingLabel = NSTextField.alloc().initWithFrame(NSMakeRect(-1, viewHeight - 65, viewWidth / 2 - 10, 20));
				var spacingLabel = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 65, viewWidth / 2 - 10, 20));

				// Configure labels
				description.setStringValue('Set values for padding and spacing. Check "Auto update" to refresh Taaac on selection change.');
				description.setSelectable(false);
				description.setEditable(false);
				description.setBezeled(false);
				description.setDrawsBackground(false);

				paddingLabel.setStringValue("Padding");
				paddingLabel.setSelectable(false);
				paddingLabel.setEditable(false);
				paddingLabel.setBezeled(false);
				paddingLabel.setDrawsBackground(false);

				spacingLabel.setStringValue("Spacing");
				spacingLabel.setSelectable(false);
				spacingLabel.setEditable(false);
				spacingLabel.setBezeled(false);
				spacingLabel.setDrawsBackground(false);

				// Add labels
				view.addSubview(description);
				view.addSubview(paddingLabel);
				view.addSubview(spacingLabel);

				// Create textfields
				paddingTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, 130, 20));
				spacingTextField = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 85, 130, 20));

				// Add textfields
				view.addSubview(paddingTextField);
				view.addSubview(spacingTextField);

				// Create checkboxes
				autoUpdateCheckbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 125, viewWidth - viewSpacer, 20));

				// Configure checkboxes
				autoUpdateCheckbox.setButtonType(NSSwitchButton);
				autoUpdateCheckbox.setBezelStyle(0);
				autoUpdateCheckbox.setTitle("Auto update");
				autoUpdateCheckbox.setState(NSOnState);

				// Add checkboxes
				view.addSubview(autoUpdateCheckbox);

				// Show the dialog
				return [alert];
			}

			return createWindow;
		}()
	}, {
		key: "getUserInput",
		value: function () {
			function getUserInput(response, selectedObject) {

				// Check if user clicked on Ok button
				if (response == "1000") {

					// Get values from fields
					var paddingString = paddingTextField.stringValue();
					var spacingString = spacingTextField.stringValue();
					var autoUpdate = autoUpdateCheckbox.stringValue();

					// Validate and store values
					if (this.validatePadding(spacingString)) {
						this.command.setValue_forKey_onLayer_forPluginIdentifier(spacingString, 'spacing', selectedObject.sketchObject, 'taaac');
					}
					if (this.validatePadding(paddingString)) {
						this.command.setValue_forKey_onLayer_forPluginIdentifier(paddingString, 'padding', selectedObject.sketchObject, 'taaac');
					}
					this.command.setValue_forKey_onLayer_forPluginIdentifier(autoUpdate, 'autoUpdate', selectedObject.sketchObject, 'taaac');

					// Log variables
					log('Padding: ' + this.command.valueForKey_onLayer_forPluginIdentifier('padding', selectedObject.sketchObject, 'taaac'));
					log('Spacing: ' + this.command.valueForKey_onLayer_forPluginIdentifier('spacing', selectedObject.sketchObject, 'taaac'));
					log('Auto update: ' + this.command.valueForKey_onLayer_forPluginIdentifier('autoUpdate', selectedObject.sketchObject, 'taaac'));
				}
			}

			return getUserInput;
		}()
	}, {
		key: "settings",
		value: function () {
			function settings(selectedObject) {
				var window = this.createWindow();
				var alert = window[0];

				// Show dialog window and store the 'response' in a variable
				var response = alert.runModal();

				// Get user input and store it in selected object
				this.getUserInput(response, selectedObject);
			}

			return settings;
		}()

		// --------------------------------------------------------
		// VALIDATION FUNCTIONS
		// --------------------------------------------------------

	}, {
		key: "isPaddingSet",
		value: function () {
			function isPaddingSet(selectedObject) {
				value = selectedObject.name.split("p[")[1] ? true : false;
				return value;
			}

			return isPaddingSet;
		}()
	}, {
		key: "isAvoidPaddingSet",
		value: function () {
			function isAvoidPaddingSet(selectedObject) {
				value = selectedObject.name.split("p[-")[1] ? true : false;
				return value;
			}

			return isAvoidPaddingSet;
		}()
	}, {
		key: "isSpacingSet",
		value: function () {
			function isSpacingSet(selectedObject) {
				value = selectedObject.name.split("s[")[1] ? true : false;
				return value;
			}

			return isSpacingSet;
		}()
	}, {
		key: "isAutoSet",
		value: function () {
			function isAutoSet(selectedObject) {
				value = selectedObject.name.split("-t")[1] ? true : false;
				return value;
			}

			return isAutoSet;
		}()
	}, {
		key: "validatePadding",
		value: function () {
			function validatePadding(padding) {
				value = /^([0-9]{1,3}){1}(\s{1}[0-9]{1,3}){0,3}$/.test(padding) ? true : false;
				return value;
			}

			return validatePadding;
		}()
	}, {
		key: "validateSpacing",
		value: function () {
			function validateSpacing(spacing) {
				value = /^[0-9]{1,3}$/.test(spacing) ? true : false;
				return value;
			}

			return validateSpacing;
		}()

		// --------------------------------------------------------
		// FIND OBJECTS TO UPDATE Including parents
		// --------------------------------------------------------

	}, {
		key: "findObjectsToUpdate",
		value: function () {
			function findObjectsToUpdate(selectedObject) {

				// Create object with selected object and plugin update value
				var objectToAdd = { object: selectedObject, pluginUpdate: false

					// If object is group add it to objects to update
				};if (selectedObject.isGroup) {

					// If auto update is set change plugin update value
					if (this.isAutoSet(selectedObject)) {
						objectToAdd.pluginUpdate = true;
					}
					this.objectsToUpdate.push(objectToAdd);
				}

				// If selcted object is not symbol and parent is not page call function again
				if (selectedObject.sketchObject["class"]() != "MSSymbolInstance" && !selectedObject.container.isPage) {
					this.findObjectsToUpdate(selectedObject.container);
				}
			}

			return findObjectsToUpdate;
		}()

		// --------------------------------------------------------
		// PADDING Set padding between group sub-layers and Bg
		// --------------------------------------------------------

	}, {
		key: "padding",
		value: function () {
			function padding(selectedObject) {
				var self = this;

				// Check if selectedObject is a group
				if (selectedObject.isGroup) {

					var firstInit = true,
					    paddingString = '',
					    padding = [];

					// Check if padding is set or ask for the user to insert padding
					if (!self.isPaddingSet(selectedObject)) {

						// Ask user to insert padding
						paddingString = self.sketch.getStringFromUser('Insert separated padding values (es. 16 16 16 16).', '');

						// If padding is valid print padding in group name
						if (self.validatePadding(paddingString)) {
							selectedObject.name = selectedObject.name + ' p[' + paddingString + ']';
						}
					} else {

						// If padding is not set get padding values from layer name
						paddingString = selectedObject.name.split("p[")[1].split("]")[0];
					}

					// If padding string is valid transform into array
					if (self.validatePadding(paddingString)) {
						padding = paddingString.split(" ");
					}

					// If padding is valid execute plugin
					if (padding.length > 0 && padding.length <= 4) {

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
						    groupFrame = selectedObject.frame,
						    groupAbsoluteRect = selectedObject.sketchObject.absoluteRect(),
						    groupAbsoluteXpos = groupAbsoluteRect.x(),
						    groupAbsoluteYpos = groupAbsoluteRect.y();

						// Iterate through object sub-layers and get content dimensions excluding background
						selectedObject.iterate(function (layer) {

							// Get layer class name
							var layerClass = layer.sketchObject["class"]();

							// If selected object is symbol use old API to set vars else use new API
							if (layerClass == "MSSymbolInstance") {

								var object = layer.sketchObject,
								    objectRect = object.absoluteRect(),
								    objectWidth = objectRect.width(),
								    objectHeight = objectRect.height(),
								    objectX = objectRect.x() - groupAbsoluteXpos,
								    objectY = objectRect.y() - groupAbsoluteYpos;
							} else {

								var object = layer,
								    objectRect = layer.frame,
								    objectWidth = objectRect.width,
								    objectHeight = objectRect.height,
								    objectX = objectRect.x,
								    objectY = objectRect.y;
							}

							// Check if sub-layer has avoid padding set
							if (self.isAvoidPaddingSet(layer)) {
								objectX = objectX + paddingL;
								objectY = objectY + paddingT;
								objectWidth = objectWidth - paddingL - paddingR;
								objectHeight = objectHeight - paddingT - paddingB;
							}

							// Check if sub-layer is not background
							if (layer.name != "Bg") {

								// If first child assign variables else calulate new frame position and dimension
								if (firstChild) {

									wrapperX = objectX;
									wrapperY = objectY;
									wrapperWidth = objectWidth;
									wrapperHeight = objectHeight;
									firstChild = false;
								} else {

									if (objectX < wrapperX) {
										deltaX = wrapperX - objectX;
										wrapperX = objectX;
										wrapperWidth = wrapperWidth + deltaX;
									}

									if (objectY < wrapperY) {
										deltaY = wrapperY - objectY;
										wrapperY = objectY;
										wrapperHeight = wrapperHeight + deltaY;
									}

									if (objectX + objectWidth > wrapperX + wrapperWidth) {
										wrapperWidth = objectX + objectWidth - wrapperX;
									}
									if (objectY + objectHeight > wrapperY + wrapperHeight) {
										wrapperHeight = objectY + objectHeight - wrapperY;
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
						selectedObject.iterate(function (layer) {
							if (layer.name == "Bg") {
								bgCount++;
								layer.frame = new self.sketch.Rectangle(backgroundX, backgroundY, backgroundWidth, backgroundHeight);
							}
						});

						// If there's no background create one
						if (!bgCount) {
							newLayer = selectedObject.newShape({ frame: new self.sketch.Rectangle(backgroundX, backgroundY, backgroundWidth, backgroundHeight), name: "Bg" });
							newLayer.addToSelection();
							newLayer.moveToBack();
						}

						// Resize group to fit children
						selectedObject.adjustToFit();
					} else {

						// Fallback message if padding value is not valid
						self.showMessage("Invalid padding value");
					}
				} else {

					// Fallback message if selcted object is not a group
					self.showMessage("You must select a group");
				}
			}

			return padding;
		}()

		// --------------------------------------------------------
		// SPACING Set vertical spacing between group sub-layers
		// --------------------------------------------------------

	}, {
		key: "spacing",
		value: function () {
			function spacing(selectedObject) {
				var self = this;

				var spacingString = '',
				    spacing = -1,
				    firstSpacing = 0,
				    subLayers = [],
				    offsetY = 0;

				// Check if selectedObject is a group
				if (selectedObject.isGroup) {

					// Check if spacing is set or ask for the user to insert spacing
					if (!self.isSpacingSet(selectedObject)) {

						// Ask user to insert spacing
						spacingString = self.sketch.getStringFromUser('Insert spacing value (es. 16).', '');

						// If spacing is valid print spacing in group name
						if (self.validateSpacing(spacingString)) {
							selectedObject.name = selectedObject.name + ' s[' + spacingString + ']';
						}
					} else {

						// If spacing is not set get spacing values from layer name
						spacingString = selectedObject.name.split("s[")[1].split("]")[0];
					}

					// If spacing string is valid transform into array
					if (self.validateSpacing(spacingString)) {
						spacing = Number(spacingString);
					}

					// If spacing is valid execute plugin
					if (spacing >= 0) {

						// Check if padding was set and add padding to first spacing
						if (self.isPaddingSet(selectedObject)) {
							padding = selectedObject.name.split("p[")[1].split("]")[0].split(" ");
							firstSpacing = Number(padding[0]);
						}

						// Set vars
						var offsetY = firstSpacing,
						    groupFrame = selectedObject.frame,
						    groupAbsoluteRect = selectedObject.sketchObject.absoluteRect(),
						    groupAbsoluteXpos = groupAbsoluteRect.x(),
						    groupAbsoluteYpos = groupAbsoluteRect.y();

						// Order sub-layers based on their y position
						selectedObject.iterate(function (layer) {

							// Get layer class name
							var layerClass = layer.sketchObject["class"]();

							// If selected object is symbol use old API to set vars else use new API
							if (layerClass == "MSSymbolInstance") {
								var object = layer.sketchObject,
								    objectRect = object.absoluteRect(),
								    objectX = objectRect.x() - groupAbsoluteXpos,
								    objectY = objectRect.y() - groupAbsoluteYpos,
								    objectWidth = objectRect.width(),
								    objectHeight = objectRect.height();
							} else {
								var object = layer,
								    objectRect = object.frame,
								    objectX = objectRect.x,
								    objectY = objectRect.y,
								    objectWidth = objectRect.width,
								    objectHeight = objectRect.height;
							}

							// Push vars into sub layer array
							subLayers.push([layer, objectX, objectY, objectWidth, objectHeight]);
						});

						// Sort sub layers array by object y position
						subLayers = subLayers.sort(self.comparator);

						// Cycle through layers array and set y position
						var arrayLength = subLayers.length,
						    firstSubLayer = true;

						for (var i = 0; i < arrayLength; i++) {
							var layer = subLayers[i][0];

							// Get layer class name
							var layerClass = layer.sketchObject["class"]();

							// Ignore background layer
							if (layer.name != "Bg") {

								// If first child has avoid padding set remove initial offset
								if (firstSubLayer) {
									if (layerClass != "MSSymbolInstance" && self.isAvoidPaddingSet(layer)) {
										offsetY = 0;
									}
									firstSubLayer = false;
								}

								// Set new object y to previous offset
								newObjectY = offsetY;

								// If selected object is symbol use old API to set new values
								if (layerClass == "MSSymbolInstance") {

									object = layer.sketchObject;
									objectRect = object.absoluteRect();
									objectRect.x = subLayers[i][1] + groupAbsoluteXpos;
									objectRect.y = newObjectY + groupAbsoluteYpos;
									objectRect.width = subLayers[i][3];
									objectRect.height = subLayers[i][4];
								} else {

									layer.frame = new self.sketch.Rectangle(subLayers[i][1], newObjectY, subLayers[i][3], subLayers[i][4]);
								}

								offsetY = newObjectY + subLayers[i][4] + spacing;
							}
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

			return spacing;
		}()

		// --------------------------------------------------------
		// SERVICE FUNCTIONS
		// --------------------------------------------------------

	}, {
		key: "showMessage",
		value: function () {
			function showMessage(message) {
				this.doc.showMessage(message);
			}

			return showMessage;
		}()
	}, {
		key: "comparator",
		value: function () {
			function comparator(a, b) {
				if (a[2] < b[2]) return -1;
				if (a[2] > b[2]) return 1;
				return 0;
			}

			return comparator;
		}()
	}]);

	return Utils;
}();

exports["default"] = Utils;

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')
