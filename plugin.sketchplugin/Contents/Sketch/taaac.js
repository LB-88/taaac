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

throw new Error("Module build failed: SyntaxError: Unexpected token (40:10)\n\n\u001b[0m \u001b[90m 38 | \u001b[39m\n \u001b[90m 39 | \u001b[39m\tvalidateSpacing(spacing) {\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 40 | \u001b[39m\t\tvalue \u001b[33m=\u001b[39m \u001b[36mif\u001b[39m (\u001b[35m/^[0-9]{1,3}$/\u001b[39m\u001b[33m.\u001b[39mtest(spacing)) \u001b[33m?\u001b[39m \u001b[36mtrue\u001b[39m \u001b[33m:\u001b[39m \u001b[36mfalse\u001b[39m\n \u001b[90m    | \u001b[39m\t\t        \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 41 | \u001b[39m\t\t\u001b[36mreturn\u001b[39m value\n \u001b[90m 42 | \u001b[39m\t}\n \u001b[90m 43 | \u001b[39m\u001b[0m\n");

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
