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
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports['default'] = function (context) {

	var sketch = context.api();
	var document = sketch.selectedDocument;
	var selection = document.selectedLayers;
	var doc = context.document;

	// Iterate through selected objects
	selection.iterate(function (selectedObject) {

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
					layer.frame = new sketch.Rectangle(backgroundX, backgroundY, backgroundWidth, backgroundHeight);
				}
			});

			// If there's no background create one
			if (!bgCount) {

				newLayer = selectedObject.newShape({ frame: new sketch.Rectangle(backgroundX, backgroundY, backgroundWidth, backgroundHeight), name: "Bg" });

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
};

var global = {};

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')
