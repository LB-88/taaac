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

		utils.spacing(selectedObject);
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
	}

	// --------------------------------------------------------
	// VALIDATION FUNCTIONS
	// --------------------------------------------------------

	_createClass(Utils, [{
		key: "isPaddingSet",
		value: function () {
			function isPaddingSet(selectedObject) {
				value = selectedObject.name.split("p[")[1] ? true : false;
				return value;
			}

			return isPaddingSet;
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

				// If parent is not page call function again
				if (!selectedObject.container.isPage) {
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
						    groupFrame = selectedObject.frame;

						// Iterate through object sub-layers and get content dimensions excluding background
						selectedObject.iterate(function (layer) {
							var layerClass = layer.sketchObject["class"]();

							// If selected object is symbol use old API
							if (layerClass == "MSSymbolInstance") {
								var symbol = layer.sketchObject,
								    symbolAbsoluteRect = symbol.absoluteRect(),
								    symbolAbsoluteWidth = symbolAbsoluteRect.width(),
								    symbolAbsoluteHeight = symbolAbsoluteRect.height(),
								    symbolAbsoluteXpos = symbolAbsoluteRect.x(),
								    symbolAbsoluteYpos = symbolAbsoluteRect.y();

								log('X: ' + symbolAbsoluteXpos);
							} else {

								// If selected object is not symbol use new API
								log('default');
								frame = layer.frame;

								// Check if sub-layer is not background
								if (layer.name != "Bg") {
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

			return padding;
		}()

		// --------------------------------------------------------
		// SPACING Set vertical spacing between group sub-layers
		// --------------------------------------------------------

	}, {
		key: "spacing",
		value: function () {
			function spacing(selectedObject) {}
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


			// --------------------------------------------------------
			// SERVICE FUNCTIONS
			// --------------------------------------------------------

			return spacing;
		}()
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
				if (a[1] < b[1]) return -1;
				if (a[1] > b[1]) return 1;
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
