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
exports.taaac = taaac;

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function taaac(context) {

	var utils = new _utils2["default"](context);

	utils.selection = context.actionContext.oldSelection;

	taaacCheck = false;

	// Iterate through previously selected objects
	utils.document.iterateWithNativeLayers(utils.selection, function (selectedObject) {

		// Check if selected object is a group
		if (selectedObject.isGroup) {

			// Check if taaac was set
			taaacCheck = selectedObject.name.split("-t")[1];
			if (taaacCheck) {
				utils.spacing(selectedObject);
				utils.padding(selectedObject);
				taaacCheck = false;
			}
		} else {

			selectedObject = selectedObject.container;

			// Check if taaac was set
			taaacCheck = selectedObject.name.split("-t")[1];
			if (taaacCheck) {
				utils.spacing(selectedObject);
				utils.padding(selectedObject);
				taaacCheck = false;
			}
		}
	});
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
	function Utils(context) {
		_classCallCheck(this, Utils);

		this.sketch = context.api();
		this.document = this.sketch.selectedDocument;
		this.doc = context.document;
	}

	_createClass(Utils, [{
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
	}, {
		key: "ifPluginSet",
		value: function () {
			function ifPluginSet(selectedObject) {
				if (selectedObject.name.split("p[")[1] || selectedObject.name.split("s[")[1]) {
					return true;
				} else {
					return false;
				}
			}

			return ifPluginSet;
		}()
	}, {
		key: "validatePadding",
		value: function () {
			function validatePadding(padding) {
				if (/^([0-9]{1,2}){1}(\s{1}[0-9]{1,2}){0,3}$/.test(padding)) {
					return true;
				} else {
					return false;
				}
			}

			return validatePadding;
		}()
	}, {
		key: "validateSpacing",
		value: function () {
			function validateSpacing(spacing) {
				if (/^[0-9]{1,3}$/.test(spacing)) {
					return true;
				} else {
					return false;
				}
			}

			return validateSpacing;
		}()
	}, {
		key: "padding",
		value: function () {
			function padding(selectedObject) {
				var self = this;

				// Check if selectedObject is a group
				if (selectedObject.isGroup) {

					var firstInit = true,
					    padding = '';

					// Check if plugin was used or ask for the user to insert padding
					if (!self.ifPluginSet(selectedObject)) {

						// Ask user to insert padding
						padding = self.sketch.getStringFromUser('Insert separated padding values (es. 16 16 16 16).', '');

						// Validate padding
						self.validatePadding(padding);

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
					selectedObject.iterate(function (layer) {
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

					// Fallback message if selcted object is not a group
					self.showMessage("You must select a group");
				}
			}

			return padding;
		}()
	}, {
		key: "spacing",
		value: function (_spacing) {
			function spacing(_x) {
				return _spacing.apply(this, arguments);
			}

			spacing.toString = function () {
				return _spacing.toString();
			};

			return spacing;
		}(function (selectedObject) {
			var self = this;

			var subLayers = [];
			var layerOffset = [];

			// Check if selectedObject is a group
			if (selectedObject.isGroup) {

				// Check if plugin was used or ask for the user to insert flow gutter
				spacing = selectedObject.name.split("s[")[1];
				if (!spacing) {

					// Ask user to insert padding
					spacing = self.sketch.getStringFromUser('Insert spacing value (es. 16).', '');

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
				selectedObject.iterate(function (layer) {
					subLayers.push([layer, layer.frame.y]);
				});
				subLayers = subLayers.sort(self.comparator);

				// Cycle through layers array
				var arrayLength = subLayers.length;
				for (var i = 0; i < arrayLength; i++) {
					layer = subLayers[i][0];
					if (layer.name != "Bg") {
						frame = layer.frame;
						newFrameY = prevY;
						prevY = newFrameY + frame.height + Number(spacing);
						layer.frame = new self.sketch.Rectangle(frame.x, newFrameY, frame.width, frame.height);
					}
				}

				// Resize group to fit children
				selectedObject.adjustToFit();
			} else {

				// Fallback message if selcted object is not a group
				self.showMessage("You must select a group");
			}
		})
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
that['taaac'] = __skpm_run.bind(this, 'taaac');
that['onRun'] = __skpm_run.bind(this, 'default')
