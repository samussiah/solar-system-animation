(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.forceDirectedGraph = factory());
}(this, (function () { 'use strict';

    function csv(array) {
      var and = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var csv = array.join(', ');
      if (and) csv = csv.replace(/, ([^,]*)$/, ' and $1');
      return csv;
    }

    var util = {
      csv: csv
    };

    function colors() {
      var colors = ['#a50026', //'#d73027',
      '#f46d43', '#fdae61', //'#fee08b',
      //'#ffffbf',
      //'#d9ef8b',
      '#a6d96a', '#66bd63', //'#1a9850',
      '#006837'].reverse();
      return colors;
    }

    function colorScale() {
      var colors$1 = colors();
      var colorScale = d3.scaleLinear().domain(d3.range(colors$1.length)).range(colors$1).clamp(true);
      return colorScale;
    }

    function color(value) {
      return colorScale()(Math.min(value, colorScale().domain().length));
    }

    var settings = {
      // data mappings
      id_var: 'id',
      event_var: 'event',
      event_order_var: 'event_order',
      start_timepoint_var: 'stdy',
      end_timepoint_var: 'endy',
      duration_var: 'duration',
      sequence_var: 'seq',
      // time settings
      timepoint: 0,
      timeUnit: 'days since randomization',
      duration: null,
      // defined in ./defineMetadata/dataDrivenSettings
      resetDelay: 15000,
      // event settings
      events: null,
      // defined in ./defineMetadata
      eventCentral: null,
      // defined in ./defineMetadata/dataDrivenSettings
      eventCount: true,
      // display count (percentage) beneath focus labels?
      eventChangeCount: null,
      // defined in ./defineMetadata/dataDrivenSettings
      eventChangeCountAesthetic: 'color',
      drawStaticSeparately: true,
      // draw static bubbles in a static force simulation to improve performance
      // animation settings
      speed: 'medium',
      speeds: {
        slow: 1000,
        medium: 500,
        fast: 100
      },
      playPause: 'play',
      // dimensions
      width: null,
      // defined in ./defineMetadata/coordinates
      height: null,
      // defined in ./defineMetadata/coordinates
      padding: 1,
      nOrbits: null,
      // defined in ./defineMetadata/dataDrivenSettings/orbits
      orbitRadius: 150,
      chargeStrength: null,
      // defined in ./defineMetadata
      nFoci: null,
      // defined in ./defineMetadata/dataDrivenSettings/event
      translate: false,
      hideControls: false,
      // color and size settings
      colorBy: {
        type: 'frequency',
        // ['frequency', 'continuous', 'categorical']
        variable: null,
        label: null
      },
      colors: colors,
      colorScale: colorScale,
      color: color,
      fill: null,
      // defined in ./defineMetadata/dataDrivenSettings
      minRadius: null,
      // defined in ./defineMetadata/dataDrivenSettings
      maxRadius: null,
      // defined in ./defineMetadata/dataDrivenSettings
      shape: 'circle',
      // modals
      modal: true,
      // display modals?
      modalSpeed: 15000,
      // amount of time for which each modal appears
      modalIndex: 0,
      explanation: ['Each bubble in this animation represents an individual.', 'As individuals experience events and change states, their bubble gravitates toward the focus representing that event.', 'The number of state changes dictates the color and/or size of the bubbles.', 'Use the controls on the right to interact with and alter the animation.'],
      // array of strings
      information: null // array of strings

    };

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }

      return target;
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it;

      if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;

          var F = function () {};

          return {
            s: F,
            n: function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function (e) {
              throw e;
            },
            f: F
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var normalCompletion = true,
          didErr = false,
          err;
      return {
        s: function () {
          it = o[Symbol.iterator]();
        },
        n: function () {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function (e) {
          didErr = true;
          err = e;
        },
        f: function () {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }

    function addElement(name, parent) {
      var tagName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'div';
      var element = parent.append(tagName).classed("fdg-".concat(name), true);
      return element;
    }

    function controls(main) {
      var controls = addElement('controls', main).classed('fdg-hidden', this.settings.hideControls);
      var hide = addElement('hide', controls, 'span');
      return {
        controls: controls
      };
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    		path: basedir,
    		exports: {},
    		require: function (path, base) {
    			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    		}
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var shifty_node = createCommonjsModule(function (module, exports) {
    /*! Shifty 2.12.0 - https://github.com/jeremyckahn/shifty */
    (function webpackUniversalModuleDefinition(root, factory) {
    	module.exports = factory();
    })(commonjsGlobal, function() {
    return /******/ (function(modules) { // webpackBootstrap
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
    /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
    /******/ 		}
    /******/ 	};
    /******/
    /******/ 	// define __esModule on exports
    /******/ 	__webpack_require__.r = function(exports) {
    /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    /******/ 		}
    /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
    /******/ 	};
    /******/
    /******/ 	// create a fake namespace object
    /******/ 	// mode & 1: value is a module id, require it
    /******/ 	// mode & 2: merge all properties of value into the ns
    /******/ 	// mode & 4: return value when already ns object
    /******/ 	// mode & 8|1: behave like require
    /******/ 	__webpack_require__.t = function(value, mode) {
    /******/ 		if(mode & 1) value = __webpack_require__(value);
    /******/ 		if(mode & 8) return value;
    /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    /******/ 		var ns = Object.create(null);
    /******/ 		__webpack_require__.r(ns);
    /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
    /******/ 		return ns;
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
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(__webpack_require__.s = 0);
    /******/ })
    /************************************************************************/
    /******/ ([
    /* 0 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    // ESM COMPAT FLAG
    __webpack_require__.r(__webpack_exports__);

    // EXPORTS
    __webpack_require__.d(__webpack_exports__, "processTweens", function() { return /* reexport */ processTweens; });
    __webpack_require__.d(__webpack_exports__, "Tweenable", function() { return /* reexport */ Tweenable; });
    __webpack_require__.d(__webpack_exports__, "tween", function() { return /* reexport */ tween; });
    __webpack_require__.d(__webpack_exports__, "interpolate", function() { return /* reexport */ interpolate_interpolate; });
    __webpack_require__.d(__webpack_exports__, "Scene", function() { return /* reexport */ Scene; });
    __webpack_require__.d(__webpack_exports__, "setBezierFunction", function() { return /* reexport */ bezier_setBezierFunction; });
    __webpack_require__.d(__webpack_exports__, "unsetBezierFunction", function() { return /* reexport */ bezier_unsetBezierFunction; });

    // NAMESPACE OBJECT: ./src/easing-functions.js
    var easing_functions_namespaceObject = {};
    __webpack_require__.r(easing_functions_namespaceObject);
    __webpack_require__.d(easing_functions_namespaceObject, "linear", function() { return linear; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInQuad", function() { return easeInQuad; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeOutQuad", function() { return easeOutQuad; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInOutQuad", function() { return easeInOutQuad; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInCubic", function() { return easeInCubic; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeOutCubic", function() { return easeOutCubic; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInOutCubic", function() { return easeInOutCubic; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInQuart", function() { return easeInQuart; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeOutQuart", function() { return easeOutQuart; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInOutQuart", function() { return easeInOutQuart; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInQuint", function() { return easeInQuint; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeOutQuint", function() { return easeOutQuint; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInOutQuint", function() { return easeInOutQuint; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInSine", function() { return easeInSine; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeOutSine", function() { return easeOutSine; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInOutSine", function() { return easeInOutSine; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInExpo", function() { return easeInExpo; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeOutExpo", function() { return easeOutExpo; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInOutExpo", function() { return easeInOutExpo; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInCirc", function() { return easeInCirc; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeOutCirc", function() { return easeOutCirc; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInOutCirc", function() { return easeInOutCirc; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeOutBounce", function() { return easeOutBounce; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInBack", function() { return easeInBack; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeOutBack", function() { return easeOutBack; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeInOutBack", function() { return easeInOutBack; });
    __webpack_require__.d(easing_functions_namespaceObject, "elastic", function() { return elastic; });
    __webpack_require__.d(easing_functions_namespaceObject, "swingFromTo", function() { return swingFromTo; });
    __webpack_require__.d(easing_functions_namespaceObject, "swingFrom", function() { return swingFrom; });
    __webpack_require__.d(easing_functions_namespaceObject, "swingTo", function() { return swingTo; });
    __webpack_require__.d(easing_functions_namespaceObject, "bounce", function() { return bounce; });
    __webpack_require__.d(easing_functions_namespaceObject, "bouncePast", function() { return bouncePast; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeFromTo", function() { return easeFromTo; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeFrom", function() { return easeFrom; });
    __webpack_require__.d(easing_functions_namespaceObject, "easeTo", function() { return easeTo; });

    // NAMESPACE OBJECT: ./src/token.js
    var token_namespaceObject = {};
    __webpack_require__.r(token_namespaceObject);
    __webpack_require__.d(token_namespaceObject, "doesApply", function() { return doesApply; });
    __webpack_require__.d(token_namespaceObject, "tweenCreated", function() { return tweenCreated; });
    __webpack_require__.d(token_namespaceObject, "beforeTween", function() { return beforeTween; });
    __webpack_require__.d(token_namespaceObject, "afterTween", function() { return afterTween; });

    // CONCATENATED MODULE: ./src/easing-functions.js
    /*!
     * All equations are adapted from Thomas Fuchs'
     * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js).
     *
     * Based on Easing Equations (c) 2003 [Robert
     * Penner](http://www.robertpenner.com/), all rights reserved. This work is
     * [subject to terms](http://www.robertpenner.com/easing_terms_of_use.html).
     */

    /*!
     *  TERMS OF USE - EASING EQUATIONS
     *  Open source under the BSD License.
     *  Easing Equations (c) 2003 Robert Penner, all rights reserved.
     */

    /**
     * @member shifty.Tweenable.formulas
     * @description A static Object of {@link shifty.easingFunction}s that can by
     * used by Shifty. The default values are defined in
     * [`easing-functions.js`](easing-functions.js.html), but you can add your own
     * {@link shifty.easingFunction}s by defining them as keys to this Object.
     *
     * Shifty ships with an implementation of [Robert Penner's easing
     * equations](http://robertpenner.com/easing/), as adapted from
     * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js)'s
     * implementation.
     * <p data-height="934" data-theme-id="0" data-slug-hash="wqObdO"
     * data-default-tab="js,result" data-user="jeremyckahn" data-embed-version="2"
     * data-pen-title="Shifty - Easing formula names" class="codepen">See the Pen <a
     * href="https://codepen.io/jeremyckahn/pen/wqObdO/">Shifty - Easing formula
     * names</a> by Jeremy Kahn (<a
     * href="https://codepen.io/jeremyckahn">@jeremyckahn</a>) on <a
     * href="https://codepen.io">CodePen</a>.</p>
     * <script async
     * src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
     * @type {Object.<shifty.easingFunction>}
     * @static
     */
    var linear = function linear(pos) {
      return pos;
    };
    var easeInQuad = function easeInQuad(pos) {
      return Math.pow(pos, 2);
    };
    var easeOutQuad = function easeOutQuad(pos) {
      return -(Math.pow(pos - 1, 2) - 1);
    };
    var easeInOutQuad = function easeInOutQuad(pos) {
      return (pos /= 0.5) < 1 ? 0.5 * Math.pow(pos, 2) : -0.5 * ((pos -= 2) * pos - 2);
    };
    var easeInCubic = function easeInCubic(pos) {
      return Math.pow(pos, 3);
    };
    var easeOutCubic = function easeOutCubic(pos) {
      return Math.pow(pos - 1, 3) + 1;
    };
    var easeInOutCubic = function easeInOutCubic(pos) {
      return (pos /= 0.5) < 1 ? 0.5 * Math.pow(pos, 3) : 0.5 * (Math.pow(pos - 2, 3) + 2);
    };
    var easeInQuart = function easeInQuart(pos) {
      return Math.pow(pos, 4);
    };
    var easeOutQuart = function easeOutQuart(pos) {
      return -(Math.pow(pos - 1, 4) - 1);
    };
    var easeInOutQuart = function easeInOutQuart(pos) {
      return (pos /= 0.5) < 1 ? 0.5 * Math.pow(pos, 4) : -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
    };
    var easeInQuint = function easeInQuint(pos) {
      return Math.pow(pos, 5);
    };
    var easeOutQuint = function easeOutQuint(pos) {
      return Math.pow(pos - 1, 5) + 1;
    };
    var easeInOutQuint = function easeInOutQuint(pos) {
      return (pos /= 0.5) < 1 ? 0.5 * Math.pow(pos, 5) : 0.5 * (Math.pow(pos - 2, 5) + 2);
    };
    var easeInSine = function easeInSine(pos) {
      return -Math.cos(pos * (Math.PI / 2)) + 1;
    };
    var easeOutSine = function easeOutSine(pos) {
      return Math.sin(pos * (Math.PI / 2));
    };
    var easeInOutSine = function easeInOutSine(pos) {
      return -0.5 * (Math.cos(Math.PI * pos) - 1);
    };
    var easeInExpo = function easeInExpo(pos) {
      return pos === 0 ? 0 : Math.pow(2, 10 * (pos - 1));
    };
    var easeOutExpo = function easeOutExpo(pos) {
      return pos === 1 ? 1 : -Math.pow(2, -10 * pos) + 1;
    };
    var easeInOutExpo = function easeInOutExpo(pos) {
      if (pos === 0) {
        return 0;
      }

      if (pos === 1) {
        return 1;
      }

      if ((pos /= 0.5) < 1) {
        return 0.5 * Math.pow(2, 10 * (pos - 1));
      }

      return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
    };
    var easeInCirc = function easeInCirc(pos) {
      return -(Math.sqrt(1 - pos * pos) - 1);
    };
    var easeOutCirc = function easeOutCirc(pos) {
      return Math.sqrt(1 - Math.pow(pos - 1, 2));
    };
    var easeInOutCirc = function easeInOutCirc(pos) {
      return (pos /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - pos * pos) - 1) : 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
    };
    var easeOutBounce = function easeOutBounce(pos) {
      if (pos < 1 / 2.75) {
        return 7.5625 * pos * pos;
      } else if (pos < 2 / 2.75) {
        return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
      } else if (pos < 2.5 / 2.75) {
        return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
      } else {
        return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
      }
    };
    var easeInBack = function easeInBack(pos) {
      var s = 1.70158;
      return pos * pos * ((s + 1) * pos - s);
    };
    var easeOutBack = function easeOutBack(pos) {
      var s = 1.70158;
      return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
    };
    var easeInOutBack = function easeInOutBack(pos) {
      var s = 1.70158;

      if ((pos /= 0.5) < 1) {
        return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s));
      }

      return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
    };
    var elastic = function elastic(pos) {
      return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
    };
    var swingFromTo = function swingFromTo(pos) {
      var s = 1.70158;
      return (pos /= 0.5) < 1 ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
    };
    var swingFrom = function swingFrom(pos) {
      var s = 1.70158;
      return pos * pos * ((s + 1) * pos - s);
    };
    var swingTo = function swingTo(pos) {
      var s = 1.70158;
      return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
    };
    var bounce = function bounce(pos) {
      if (pos < 1 / 2.75) {
        return 7.5625 * pos * pos;
      } else if (pos < 2 / 2.75) {
        return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
      } else if (pos < 2.5 / 2.75) {
        return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
      } else {
        return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
      }
    };
    var bouncePast = function bouncePast(pos) {
      if (pos < 1 / 2.75) {
        return 7.5625 * pos * pos;
      } else if (pos < 2 / 2.75) {
        return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75);
      } else if (pos < 2.5 / 2.75) {
        return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375);
      } else {
        return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375);
      }
    };
    var easeFromTo = function easeFromTo(pos) {
      return (pos /= 0.5) < 1 ? 0.5 * Math.pow(pos, 4) : -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
    };
    var easeFrom = function easeFrom(pos) {
      return Math.pow(pos, 4);
    };
    var easeTo = function easeTo(pos) {
      return Math.pow(pos, 0.25);
    };
    // CONCATENATED MODULE: ./src/tweenable.js
    function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

     // CONSTANTS

    var DEFAULT_EASING = 'linear';
    var DEFAULT_DURATION = 500;
    var UPDATE_TIME = 1000 / 60;
    var root = typeof window !== 'undefined' ? window : commonjsGlobal;
    var AFTER_TWEEN = 'afterTween';
    var AFTER_TWEEN_END = 'afterTweenEnd';
    var BEFORE_TWEEN = 'beforeTween';
    var TWEEN_CREATED = 'tweenCreated';
    var TYPE_FUNCTION = 'function';
    var TYPE_STRING = 'string'; // requestAnimationFrame() shim by Paul Irish (modified for Shifty)
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/

    var scheduleFunction = root.requestAnimationFrame || root.webkitRequestAnimationFrame || root.oRequestAnimationFrame || root.msRequestAnimationFrame || root.mozCancelRequestAnimationFrame && root.mozRequestAnimationFrame || setTimeout;

    var noop = function noop() {};

    var listHead = null;
    var listTail = null; // Strictly used for testing

    var formulas = _objectSpread({}, easing_functions_namespaceObject);
    /**
     * Calculates the interpolated tween values of an Object for a given
     * timestamp.
     * @param {number} forPosition The position to compute the state for.
     * @param {Object} currentState Current state properties.
     * @param {Object} originalState: The original state properties the Object is
     * tweening from.
     * @param {Object} targetState: The destination state properties the Object
     * is tweening to.
     * @param {number} duration: The length of the tween in milliseconds.
     * @param {number} timestamp: The UNIX epoch time at which the tween began.
     * @param {Object<string|Function>} easing: This Object's keys must correspond
     * to the keys in targetState.
     * @returns {Object}
     * @private
     */


    var tweenProps = function tweenProps(forPosition, currentState, originalState, targetState, duration, timestamp, easing) {
      var normalizedPosition = forPosition < timestamp ? 0 : (forPosition - timestamp) / duration;

      for (var key in currentState) {
        var easingObjectProp = easing[key];
        var easingFn = easingObjectProp.call ? easingObjectProp : formulas[easingObjectProp];
        var start = originalState[key];
        currentState[key] = start + (targetState[key] - start) * easingFn(normalizedPosition);
      }

      return currentState;
    };

    var processTween = function processTween(tween, currentTime) {
      var _data = tween._data,
          _currentState = tween._currentState,
          _delay = tween._delay,
          _easing = tween._easing,
          _originalState = tween._originalState;
      var _duration = tween._duration,
          _render = tween._render,
          _targetState = tween._targetState,
          _timestamp = tween._timestamp;
      var endTime = _timestamp + _delay + _duration;
      var timeToCompute = currentTime > endTime ? endTime : currentTime;
      var hasEnded = timeToCompute >= endTime;
      var offset = _duration - (endTime - timeToCompute);

      if (hasEnded) {
        _render(_targetState, _data, offset);

        tween.stop(true);
      } else {
        tween._applyFilter(BEFORE_TWEEN); // If the animation has not yet reached the start point (e.g., there was
        // delay that has not yet completed), just interpolate the starting
        // position of the tween.


        if (timeToCompute < _timestamp + _delay) {
          timeToCompute = 1;
          _duration = 1;
          _timestamp = 1;
        } else {
          _timestamp += _delay;
        }

        tweenProps(timeToCompute, _currentState, _originalState, _targetState, _duration, _timestamp, _easing);

        tween._applyFilter(AFTER_TWEEN);

        _render(_currentState, _data, offset);
      }
    };
    /**
     * Process all tweens currently managed by Shifty for the current tick. This
     * does not perform any timing or update scheduling; it is the logic that is
     * run *by* the scheduling functionality. Specifically, it computes the state
     * and calls all of the relevant {@link shifty.tweenConfig} functions supplied
     * to each of the tweens for the current point in time (as determined by {@link
     * shifty.Tweenable.now}.
     *
     * This is a low-level API that won't be needed in the majority of situations.
     * It is primarily useful as a hook for higher-level animation systems that are
     * built on top of Shifty. If you need this function, it is likely you need to
     * pass something like `() => {}` to {@link
     * shifty.Tweenable.setScheduleFunction}, override {@link shifty.Tweenable.now}
     * and manage the scheduling logic yourself.
     *
     * @method shifty.processTweens
     * @see https://github.com/jeremyckahn/shifty/issues/109
     */


    var processTweens = function processTweens() {
      var currentTime = Tweenable.now();
      var tween = listHead;

      while (tween) {
        var nextTween = tween._next;
        processTween(tween, currentTime);
        tween = nextTween;
      }
    };
    /**
     * Handles the update logic for one tick of a tween.
     * @param {number} [currentTimeOverride] Needed for accurate timestamp in
     * shifty.Tweenable#seek.
     * @private
     */

    var scheduleUpdate = function scheduleUpdate() {
      if (!listHead) {
        return;
      }

      scheduleFunction.call(root, scheduleUpdate, UPDATE_TIME);
      processTweens();
    };
    /**
     * Creates a usable easing Object from a string, a function or another easing
     * Object.  If `easing` is an Object, then this function clones it and fills
     * in the missing properties with `"linear"`.
     * @param {Object.<string|Function>} fromTweenParams
     * @param {Object|string|Function} easing
     * @return {Object.<string|Function>}
     * @private
     */

    var composeEasingObject = function composeEasingObject(fromTweenParams) {
      var easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_EASING;
      var composedEasing = {};

      var typeofEasing = _typeof(easing);

      if (typeofEasing === TYPE_STRING || typeofEasing === TYPE_FUNCTION) {
        for (var prop in fromTweenParams) {
          composedEasing[prop] = easing;
        }
      } else {
        for (var _prop in fromTweenParams) {
          composedEasing[_prop] = easing[_prop] || DEFAULT_EASING;
        }
      }

      return composedEasing;
    };

    var remove = function remove(tween) {
      // Adapted from:
      // https://github.com/trekhleb/javascript-algorithms/blob/7c9601df3e8ca4206d419ce50b88bd13ff39deb6/src/data-structures/doubly-linked-list/DoublyLinkedList.js#L73-L121
      if (tween === listHead) {
        listHead = tween._next;

        if (listHead) {
          listHead._previous = null;
        } else {
          listTail = null;
        }
      } else if (tween === listTail) {
        listTail = tween._previous;

        if (listTail) {
          listTail._next = null;
        } else {
          listHead = null;
        }
      } else {
        var previousTween = tween._previous;
        var nextTween = tween._next;
        previousTween._next = nextTween;
        nextTween._previous = previousTween;
      } // Clean up any references in case the tween is restarted later.


      tween._previous = tween._next = null;
    };

    var Tweenable = /*#__PURE__*/function () {
      /**
       * @param {Object} [initialState={}] The values that the initial tween should
       * start at if a `from` value is not provided to {@link
       * shifty.Tweenable#tween} or {@link shifty.Tweenable#setConfig}.
       * @param {shifty.tweenConfig} [config] Configuration object to be passed to
       * {@link shifty.Tweenable#setConfig}.
       * @constructs shifty.Tweenable
       */
      function Tweenable() {
        var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

        _classCallCheck(this, Tweenable);

        _defineProperty(this, "_config", null);

        _defineProperty(this, "_data", {});

        _defineProperty(this, "_filters", []);

        _defineProperty(this, "_next", null);

        _defineProperty(this, "_previous", null);

        _defineProperty(this, "_timestamp", null);

        _defineProperty(this, "_resolve", null);

        _defineProperty(this, "_reject", null);

        this._currentState = initialState; // To prevent unnecessary calls to setConfig do not set default
        // configuration here.  Only set default configuration immediately before
        // tweening if none has been set.

        if (config) {
          this.setConfig(config);
        }
      }
      /**
       * Applies a filter to Tweenable instance.
       * @param {string} filterName The name of the filter to apply.
       * @private
       */


      _createClass(Tweenable, [{
        key: "_applyFilter",
        value: function _applyFilter(filterName) {
          var _iterator = _createForOfIteratorHelper(this._filters),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var filterType = _step.value;
              var filter = filterType[filterName];

              if (filter) {
                filter(this);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
        /**
         * Configure and start a tween. If this {@link shifty.Tweenable}'s instance
         * is already running, then it will stop playing the old tween and
         * immediately play the new one.
         * @method shifty.Tweenable#tween
         * @param {shifty.tweenConfig} [config] Gets passed to {@link
         * shifty.Tweenable#setConfig}.
         * @return {external:Promise} This `Promise` resolves with a {@link
         * shifty.promisedData} object.
         */

      }, {
        key: "tween",
        value: function tween() {
          var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
          var _data = this._data,
              _config = this._config;

          if (this._isPlaying) {
            this.stop();
          }

          if (config || !_config) {
            this.setConfig(config);
          }

          this._pausedAtTime = null;
          this._timestamp = Tweenable.now();

          this._start(this.get(), _data);

          return this.resume();
        }
        /**
         * Configure a tween that will start at some point in the future. Aside from
         * `delay`, `from`, and `to`, each configuration option will automatically
         * default to the same option used in the preceding tween of this {@link
         * shifty.Tweenable} instance.
         * @method shifty.Tweenable#setConfig
         * @param {shifty.tweenConfig} [config={}]
         * @return {shifty.Tweenable}
         */

      }, {
        key: "setConfig",
        value: function setConfig() {
          var _this = this;

          var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          var patchedConfig = _objectSpread(_objectSpread({}, this._config), config); // Configuration options to reuse from previous tweens


          var _this$_config = this._config = patchedConfig,
              attachment = _this$_config.attachment,
              data = _this$_config.data,
              _this$_config$duratio = _this$_config.duration,
              duration = _this$_config$duratio === void 0 ? DEFAULT_DURATION : _this$_config$duratio,
              easing = _this$_config.easing,
              _this$_config$promise = _this$_config.promise,
              promise = _this$_config$promise === void 0 ? Promise : _this$_config$promise,
              _this$_config$start = _this$_config.start,
              start = _this$_config$start === void 0 ? noop : _this$_config$start,
              _this$_config$render = _this$_config.render,
              render = _this$_config$render === void 0 ? patchedConfig.step || noop : _this$_config$render,
              _this$_config$step = _this$_config.step,
              step = _this$_config$step === void 0 ? noop : _this$_config$step; // Configuration options not to reuse


          var _config$delay = config.delay,
              delay = _config$delay === void 0 ? 0 : _config$delay,
              from = config.from,
              to = config.to; // Attach something to this Tweenable instance (e.g.: a DOM element, an
          // object, a string, etc.);

          this._data = data || attachment || this._data; // Init the internal state

          this._isPlaying = false;
          this._pausedAtTime = null;
          this._scheduleId = null;
          this._delay = delay;
          this._start = start;
          this._render = render || step;
          this._duration = duration;
          this._currentState = _objectSpread({}, from || this.get());
          this._originalState = this.get();
          this._targetState = _objectSpread({}, to || this.get());
          var _currentState = this._currentState; // Ensure that there is always something to tween to.

          this._targetState = _objectSpread(_objectSpread({}, _currentState), this._targetState);
          this._easing = composeEasingObject(_currentState, easing);
          var filters = Tweenable.filters;
          this._filters.length = 0;

          for (var name in filters) {
            if (filters[name].doesApply(this)) {
              this._filters.push(filters[name]);
            }
          }

          this._applyFilter(TWEEN_CREATED);

          this._promise = new promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
          }); // Needed to silence (harmless) logged errors when a .catch handler is not
          // added by downstream code

          this._promise["catch"](noop);

          return this;
        }
        /**
         * @method shifty.Tweenable#get
         * @return {Object} The current state.
         */

      }, {
        key: "get",
        value: function get() {
          return _objectSpread({}, this._currentState);
        }
        /**
         * Set the current state.
         * @method shifty.Tweenable#set
         * @param {Object} state The state to set.
         */

      }, {
        key: "set",
        value: function set(state) {
          this._currentState = state;
        }
        /**
         * Pause a tween. Paused tweens can be resumed from the point at which they
         * were paused. If a tween is not running, this is a no-op.
         * @method shifty.Tweenable#pause
         * @return {shifty.Tweenable}
         */

      }, {
        key: "pause",
        value: function pause() {
          if (!this._isPlaying) {
            return;
          }

          this._pausedAtTime = Tweenable.now();
          this._isPlaying = false;
          remove(this);
          return this;
        }
        /**
         * Resume a paused tween.
         * @method shifty.Tweenable#resume
         * @return {external:Promise}
         */

      }, {
        key: "resume",
        value: function resume() {
          if (this._timestamp === null) {
            return this.tween();
          }

          if (this._isPlaying) {
            return this._promise;
          }

          var currentTime = Tweenable.now();

          if (this._pausedAtTime) {
            this._timestamp += currentTime - this._pausedAtTime;
            this._pausedAtTime = null;
          }

          this._isPlaying = true;

          if (listHead === null) {
            listHead = this;
            listTail = this;
            scheduleUpdate();
          } else {
            this._previous = listTail;
            listTail._next = this;
            listTail = this;
          }

          return this._promise;
        }
        /**
         * Move the state of the animation to a specific point in the tween's
         * timeline.  If the animation is not running, this will cause {@link
         * shifty.renderFunction} handlers to be called.
         * @method shifty.Tweenable#seek
         * @param {millisecond} millisecond The millisecond of the animation to seek
         * to.  This must not be less than `0`.
         * @return {shifty.Tweenable}
         */

      }, {
        key: "seek",
        value: function seek(millisecond) {
          millisecond = Math.max(millisecond, 0);
          var currentTime = Tweenable.now();

          if (this._timestamp + millisecond === 0) {
            return this;
          }

          this._timestamp = currentTime - millisecond;

          if (!this._isPlaying) {
            // If the animation is not running, call processTween to make sure that
            // any render handlers are run.
            processTween(this, currentTime);
          }

          return this;
        }
        /**
         * Stops a tween. If a tween is not running, this is a no-op.
         * @param {boolean} [gotoEnd] If `false`, the tween just stops at its current
         * state.  If `true`, the tweened object's values are instantly set to the
         * target values.
         * @method shifty.Tweenable#stop
         * @return {shifty.Tweenable}
         */

      }, {
        key: "stop",
        value: function stop() {
          var gotoEnd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var _currentState = this._currentState,
              _data = this._data,
              _easing = this._easing,
              _originalState = this._originalState,
              _resolve = this._resolve,
              _targetState = this._targetState;

          if (!this._isPlaying) {
            return this;
          }

          this._isPlaying = false;
          remove(this);

          if (gotoEnd) {
            this._applyFilter(BEFORE_TWEEN);

            tweenProps(1, _currentState, _originalState, _targetState, 1, 0, _easing);

            this._applyFilter(AFTER_TWEEN);

            this._applyFilter(AFTER_TWEEN_END);
          }

          if (_resolve) {
            _resolve({
              data: _data,
              state: _currentState,
              tweenable: this
            });
          }

          this._resolve = null;
          this._reject = null;
          return this;
        }
        /**
         * {@link shifty.Tweenable#stop}s a tween and also `reject`s its {@link
         * external:Promise}. If a tween is not running, this is a no-op.
         * @param {boolean} [gotoEnd] Is propagated to {@link shifty.Tweenable#stop}.
         * @method shifty.Tweenable#cancel
         * @return {shifty.Tweenable}
         * @see https://github.com/jeremyckahn/shifty/issues/122
         */

      }, {
        key: "cancel",
        value: function cancel() {
          var gotoEnd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var _currentState = this._currentState,
              _data = this._data,
              _isPlaying = this._isPlaying;

          if (!_isPlaying) {
            return this;
          }

          this._reject({
            data: _data,
            state: _currentState,
            tweenable: this
          });

          this._resolve = null;
          this._reject = null;
          return this.stop(gotoEnd);
        }
        /**
         * Whether or not a tween is running.
         * @method shifty.Tweenable#isPlaying
         * @return {boolean}
         */

      }, {
        key: "isPlaying",
        value: function isPlaying() {
          return this._isPlaying;
        }
        /**
         * @method shifty.Tweenable#setScheduleFunction
         * @param {shifty.scheduleFunction} scheduleFunction
         * @deprecated Will be removed in favor of {@link shifty.Tweenable.setScheduleFunction} in 3.0.
         */

      }, {
        key: "setScheduleFunction",
        value: function setScheduleFunction(scheduleFunction) {
          Tweenable.setScheduleFunction(scheduleFunction);
        }
        /**
         * Get and optionally set the data that gets passed as `data` to {@link
         * shifty.promisedData}, {@link shifty.startFunction} and {@link
         * shifty.renderFunction}.
         * @param {Object} [data]
         * @method shifty.Tweenable#data
         * @return {Object} The internally stored `data`.
         */

      }, {
        key: "data",
        value: function data() {
          var _data2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

          if (_data2) {
            this._data = _objectSpread({}, _data2);
          }

          return this._data;
        }
        /**
         * `delete` all "own" properties.  Call this when the {@link
         * shifty.Tweenable} instance is no longer needed to free memory.
         * @method shifty.Tweenable#dispose
         */

      }, {
        key: "dispose",
        value: function dispose() {
          for (var prop in this) {
            delete this[prop];
          }
        }
      }]);

      return Tweenable;
    }();
    /**
     * Set a custom schedule function.
     *
     * By default,
     * [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame)
     * is used if available, otherwise
     * [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout)
     * is used.
     * @method shifty.Tweenable.setScheduleFunction
     * @param {shifty.scheduleFunction} fn The function to be
     * used to schedule the next frame to be rendered.
     * @return {shifty.scheduleFunction} The function that was set.
     */

    Tweenable.setScheduleFunction = function (fn) {
      return scheduleFunction = fn;
    };

    Tweenable.formulas = formulas;
    /**
     * The {@link shifty.filter}s available for use.  These filters are
     * automatically applied at tween-time by Shifty. You can define your own
     * {@link shifty.filter}s and attach them to this object.
     * @member shifty.Tweenable.filters
     * @type {Object.<shifty.filter>}
     */

    Tweenable.filters = {};
    /**
     * @method shifty.Tweenable.now
     * @static
     * @returns {number} The current timestamp.
     */

    Tweenable.now = Date.now || function () {
      return +new Date();
    };
    /**
     * @method shifty.tween
     * @param {shifty.tweenConfig} [config={}]
     * @description Standalone convenience method that functions identically to
     * {@link shifty.Tweenable#tween}.  You can use this to create tweens without
     * needing to set up a {@link shifty.Tweenable} instance.
     *
     * ```
     * import { tween } from 'shifty';
     *
     * tween({ from: { x: 0 }, to: { x: 10 } }).then(
     *   () => console.log('All done!')
     * );
     * ```
     *
     * @returns {external:Promise} This `Promise` has a property called `tweenable`
     * that is the {@link shifty.Tweenable} instance that is running the tween.
     */


    function tween() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var tweenable = new Tweenable();
      var promise = tweenable.tween(config);
      promise.tweenable = tweenable;
      return promise;
    }
    // CONCATENATED MODULE: ./src/token.js
    var R_NUMBER_COMPONENT = /(\d|-|\.)/;
    var R_FORMAT_CHUNKS = /([^\-0-9.]+)/g;
    var R_UNFORMATTED_VALUES = /[0-9.-]+/g;

    var R_RGB = function () {
      var number = R_UNFORMATTED_VALUES.source;
      var comma = /,\s*/.source;
      return new RegExp("rgb\\(".concat(number).concat(comma).concat(number).concat(comma).concat(number, "\\)"), 'g');
    }();

    var R_RGB_PREFIX = /^.*\(/;
    var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
    var VALUE_PLACEHOLDER = 'VAL'; // HELPERS

    /**
     * @param {Array.number} rawValues
     * @param {string} prefix
     *
     * @return {Array.<string>}
     * @private
     */

    var getFormatChunksFrom = function getFormatChunksFrom(rawValues, prefix) {
      return rawValues.map(function (val, i) {
        return "_".concat(prefix, "_").concat(i);
      });
    };
    /**
     * @param {string} formattedString
     *
     * @return {string}
     * @private
     */


    var getFormatStringFrom = function getFormatStringFrom(formattedString) {
      var chunks = formattedString.match(R_FORMAT_CHUNKS);

      if (!chunks) {
        // chunks will be null if there were no tokens to parse in
        // formattedString (for example, if formattedString is '2').  Coerce
        // chunks to be useful here.
        chunks = ['', '']; // If there is only one chunk, assume that the string is a number
        // followed by a token...
        // NOTE: This may be an unwise assumption.
      } else if (chunks.length === 1 || // ...or if the string starts with a number component (".", "-", or a
      // digit)...
      formattedString.charAt(0).match(R_NUMBER_COMPONENT)) {
        // ...prepend an empty string here to make sure that the formatted number
        // is properly replaced by VALUE_PLACEHOLDER
        chunks.unshift('');
      }

      return chunks.join(VALUE_PLACEHOLDER);
    };
    /**
     * Convert a base-16 number to base-10.
     *
     * @param {number|string} hex The value to convert.
     *
     * @returns {number} The base-10 equivalent of `hex`.
     * @private
     */


    function hexToDec(hex) {
      return parseInt(hex, 16);
    }
    /**
     * Convert a hexadecimal string to an array with three items, one each for
     * the red, blue, and green decimal values.
     *
     * @param {string} hex A hexadecimal string.
     *
     * @returns {Array.<number>} The converted Array of RGB values if `hex` is a
     * valid string, or an Array of three 0's.
     * @private
     */


    var hexToRGBArray = function hexToRGBArray(hex) {
      hex = hex.replace(/#/, ''); // If the string is a shorthand three digit hex notation, normalize it to
      // the standard six digit notation

      if (hex.length === 3) {
        hex = hex.split('');
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      return [hexToDec(hex.substr(0, 2)), hexToDec(hex.substr(2, 2)), hexToDec(hex.substr(4, 2))];
    };
    /**
     * @param {string} hexString
     *
     * @return {string}
     * @private
     */


    var convertHexToRGB = function convertHexToRGB(hexString) {
      return "rgb(".concat(hexToRGBArray(hexString).join(','), ")");
    };
    /**
     * TODO: Can this be rewritten to leverage String#replace more efficiently?
     * Runs a filter operation on all chunks of a string that match a RegExp.
     *
     * @param {RegExp} pattern
     * @param {string} unfilteredString
     * @param {function(string)} filter
     *
     * @return {string}
     * @private
     */


    var filterStringChunks = function filterStringChunks(pattern, unfilteredString, filter) {
      var patternMatches = unfilteredString.match(pattern);
      var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);

      if (patternMatches) {
        patternMatches.forEach(function (match) {
          return filteredString = filteredString.replace(VALUE_PLACEHOLDER, filter(match));
        });
      }

      return filteredString;
    };
    /**
     * @param {string} str
     *
     * @return {string}
     * @private
     */


    var sanitizeHexChunksToRGB = function sanitizeHexChunksToRGB(str) {
      return filterStringChunks(R_HEX, str, convertHexToRGB);
    };
    /**
     * Convert all hex color values within a string to an rgb string.
     *
     * @param {Object} stateObject
     * @private
     */


    var sanitizeObjectForHexProps = function sanitizeObjectForHexProps(stateObject) {
      for (var prop in stateObject) {
        var currentProp = stateObject[prop];

        if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
          stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
        }
      }
    };
    /**
     * @param {string} rgbChunk
     *
     * @return {string}
     * @private
     */


    var sanitizeRGBChunk = function sanitizeRGBChunk(rgbChunk) {
      var numbers = rgbChunk.match(R_UNFORMATTED_VALUES).map(Math.floor);
      var prefix = rgbChunk.match(R_RGB_PREFIX)[0];
      return "".concat(prefix).concat(numbers.join(','), ")");
    };
    /**
     * Check for floating point values within rgb strings and round them.
     *
     * @param {string} formattedString
     *
     * @return {string}
     * @private
     */


    var sanitizeRGBChunks = function sanitizeRGBChunks(formattedString) {
      return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
    };
    /**
     * Note: It's the duty of the caller to convert the Array elements of the
     * return value into numbers.  This is a performance optimization.
     *
     * @param {string} formattedString
     *
     * @return {Array.<string>|null}
     * @private
     */


    var getValuesFrom = function getValuesFrom(formattedString) {
      return formattedString.match(R_UNFORMATTED_VALUES);
    };
    /**
     * @param {Object} stateObject
     *
     * @return {Object} An Object of formatSignatures that correspond to
     * the string properties of stateObject.
     * @private
     */


    var getFormatSignatures = function getFormatSignatures(stateObject) {
      var signatures = {};

      for (var propertyName in stateObject) {
        var property = stateObject[propertyName];

        if (typeof property === 'string') {
          signatures[propertyName] = {
            formatString: getFormatStringFrom(property),
            chunkNames: getFormatChunksFrom(getValuesFrom(property), propertyName)
          };
        }
      }

      return signatures;
    };
    /**
     * @param {Object} stateObject
     * @param {Object} formatSignatures
     * @private
     */


    var expandFormattedProperties = function expandFormattedProperties(stateObject, formatSignatures) {
      var _loop = function _loop(propertyName) {
        getValuesFrom(stateObject[propertyName]).forEach(function (number, i) {
          return stateObject[formatSignatures[propertyName].chunkNames[i]] = +number;
        });
        delete stateObject[propertyName];
      };

      for (var propertyName in formatSignatures) {
        _loop(propertyName);
      }
    };
    /**
     * @param {Object} stateObject
     * @param {Array.<string>} chunkNames
     *
     * @return {Object} The extracted value chunks.
     * @private
     */


    var extractPropertyChunks = function extractPropertyChunks(stateObject, chunkNames) {
      var extractedValues = {};
      chunkNames.forEach(function (chunkName) {
        extractedValues[chunkName] = stateObject[chunkName];
        delete stateObject[chunkName];
      });
      return extractedValues;
    };
    /**
     * @param {Object} stateObject
     * @param {Array.<string>} chunkNames
     *
     * @return {Array.<number>}
     * @private
     */


    var getValuesList = function getValuesList(stateObject, chunkNames) {
      return chunkNames.map(function (chunkName) {
        return stateObject[chunkName];
      });
    };
    /**
     * @param {string} formatString
     * @param {Array.<number>} rawValues
     *
     * @return {string}
     * @private
     */


    var getFormattedValues = function getFormattedValues(formatString, rawValues) {
      rawValues.forEach(function (rawValue) {
        return formatString = formatString.replace(VALUE_PLACEHOLDER, +rawValue.toFixed(4));
      });
      return formatString;
    };
    /**
     * @param {Object} stateObject
     * @param {Object} formatSignatures
     * @private
     */


    var collapseFormattedProperties = function collapseFormattedProperties(stateObject, formatSignatures) {
      for (var prop in formatSignatures) {
        var _formatSignatures$pro = formatSignatures[prop],
            chunkNames = _formatSignatures$pro.chunkNames,
            formatString = _formatSignatures$pro.formatString;
        var currentProp = getFormattedValues(formatString, getValuesList(extractPropertyChunks(stateObject, chunkNames), chunkNames));
        stateObject[prop] = sanitizeRGBChunks(currentProp);
      }
    };
    /**
     * @param {Object} easingObject
     * @param {Object} tokenData
     * @private
     */


    var expandEasingObject = function expandEasingObject(easingObject, tokenData) {
      var _loop2 = function _loop2(prop) {
        var chunkNames = tokenData[prop].chunkNames;
        var easing = easingObject[prop];

        if (typeof easing === 'string') {
          var easingNames = easing.split(' ');
          var defaultEasing = easingNames[easingNames.length - 1];
          chunkNames.forEach(function (chunkName, i) {
            return easingObject[chunkName] = easingNames[i] || defaultEasing;
          });
        } else {
          // easing is a function
          chunkNames.forEach(function (chunkName) {
            return easingObject[chunkName] = easing;
          });
        }

        delete easingObject[prop];
      };

      for (var prop in tokenData) {
        _loop2(prop);
      }
    };
    /**
     * @param {Object} easingObject
     * @param {Object} tokenData
     * @private
     */


    var collapseEasingObject = function collapseEasingObject(easingObject, tokenData) {
      for (var prop in tokenData) {
        var chunkNames = tokenData[prop].chunkNames;
        var firstEasing = easingObject[chunkNames[0]];

        if (typeof firstEasing === 'string') {
          easingObject[prop] = chunkNames.map(function (chunkName) {
            var easingName = easingObject[chunkName];
            delete easingObject[chunkName];
            return easingName;
          }).join(' ');
        } else {
          // firstEasing is a function
          easingObject[prop] = firstEasing;
        }
      }
    };

    var doesApply = function doesApply(_ref) {
      var _currentState = _ref._currentState;
      return Object.keys(_currentState).some(function (key) {
        return typeof _currentState[key] === 'string';
      });
    };
    function tweenCreated(tweenable) {
      var _currentState = tweenable._currentState,
          _originalState = tweenable._originalState,
          _targetState = tweenable._targetState;
      [_currentState, _originalState, _targetState].forEach(sanitizeObjectForHexProps);
      tweenable._tokenData = getFormatSignatures(_currentState);
    }
    function beforeTween(tweenable) {
      var _currentState = tweenable._currentState,
          _originalState = tweenable._originalState,
          _targetState = tweenable._targetState,
          _easing = tweenable._easing,
          _tokenData = tweenable._tokenData;
      expandEasingObject(_easing, _tokenData);
      [_currentState, _originalState, _targetState].forEach(function (state) {
        return expandFormattedProperties(state, _tokenData);
      });
    }
    function afterTween(tweenable) {
      var _currentState = tweenable._currentState,
          _originalState = tweenable._originalState,
          _targetState = tweenable._targetState,
          _easing = tweenable._easing,
          _tokenData = tweenable._tokenData;
      [_currentState, _originalState, _targetState].forEach(function (state) {
        return collapseFormattedProperties(state, _tokenData);
      });
      collapseEasingObject(_easing, _tokenData);
    }
    // CONCATENATED MODULE: ./src/interpolate.js
    function interpolate_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function interpolate_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { interpolate_ownKeys(Object(source), true).forEach(function (key) { interpolate_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { interpolate_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function interpolate_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

     // Fake a Tweenable and patch some internals.  This approach allows us to
    // skip uneccessary processing and object recreation, cutting down on garbage
    // collection pauses.

    var mockTweenable = new Tweenable();
    var filters = Tweenable.filters;
    /**
     * Compute the midpoint of two Objects.  This method effectively calculates a
     * specific frame of animation that {@link shifty.Tweenable#tween} does many times
     * over the course of a full tween.
     *
     * ```
     * import { interpolate } from 'shifty';
     *
     * const interpolatedValues = interpolate({
     *     width: '100px',
     *     opacity: 0,
     *     color: '#fff'
     *   }, {
     *     width: '200px',
     *     opacity: 1,
     *     color: '#000'
     *   },
     *   0.5
     * );
     *
     * console.log(interpolatedValues); // Logs: {opacity: 0.5, width: "150px", color: "rgb(127,127,127)"}
     * ```
     *
     * @method shifty.interpolate
     * @param {Object} from The starting values to tween from.
     * @param {Object} to The ending values to tween to.
     * @param {number} position The normalized position value (between `0.0` and
     * `1.0`) to interpolate the values between `from` and `to` for.  `from`
     * represents `0` and `to` represents `1`.
     * @param {Object.<string|shifty.easingFunction>|string|shifty.easingFunction}
     * easing The easing curve(s) to calculate the midpoint against.  You can
     * reference any easing function attached to {@link shifty.Tweenable.formulas},
     * or provide the {@link shifty.easingFunction}(s) directly.  If omitted, this
     * defaults to "linear".
     * @param {number} [delay=0] Optional delay to pad the beginning of the
     * interpolated tween with.  This increases the range of `position` from (`0`
     * through `1`) to (`0` through `1 + delay`).  So, a delay of `0.5` would
     * increase all valid values of `position` to numbers between `0` and `1.5`.
     * @return {Object}
     */

    var interpolate_interpolate = function interpolate(from, to, position, easing) {
      var delay = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

      var current = interpolate_objectSpread({}, from);

      var easingObject = composeEasingObject(from, easing);
      mockTweenable._filters.length = 0;
      mockTweenable.set({});
      mockTweenable._currentState = current;
      mockTweenable._originalState = from;
      mockTweenable._targetState = to;
      mockTweenable._easing = easingObject;

      for (var name in filters) {
        if (filters[name].doesApply(mockTweenable)) {
          mockTweenable._filters.push(filters[name]);
        }
      } // Any defined value transformation must be applied


      mockTweenable._applyFilter('tweenCreated');

      mockTweenable._applyFilter('beforeTween');

      var interpolatedValues = tweenProps(position, current, from, to, 1, delay, easingObject); // Transform data in interpolatedValues back into its original format

      mockTweenable._applyFilter('afterTween');

      return interpolatedValues;
    };
    // CONCATENATED MODULE: ./src/scene.js
    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || scene_unsupportedIterableToArray(arr) || _nonIterableSpread(); }

    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function scene_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return scene_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return scene_arrayLikeToArray(o, minLen); }

    function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return scene_arrayLikeToArray(arr); }

    function scene_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function scene_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function scene_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function scene_createClass(Constructor, protoProps, staticProps) { if (protoProps) scene_defineProperties(Constructor.prototype, protoProps); if (staticProps) scene_defineProperties(Constructor, staticProps); return Constructor; }

    function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

    var _tweenables = new WeakMap();

    var Scene = /*#__PURE__*/function () {
      /**
       * The {@link shifty.Scene} class provides a way to control groups of {@link
       * shifty.Tweenable}s. It is lightweight, minimalistic, and meant to provide
       * performant {@link shifty.Tweenable} batch control that users of Shifty
       * might otherwise have to implement themselves. It is **not** a robust
       * timeline solution, and it does **not** provide utilities for sophisticated
       * animation sequencing or orchestration. If that is what you need for your
       * project, consider using a more robust tool such as
       * [Rekapi](http://jeremyckahn.github.io/rekapi/doc/) (a timeline layer built
       * on top of Shifty).
       *
       * Please be aware that {@link shifty.Scene} does **not** perform any
       * automatic cleanup. If you want to remove a {@link shifty.Tweenable} from a
       * {@link shifty.Scene}, you must do so explicitly with either {@link
       * shifty.Scene#remove} or {@link shifty.Scene#empty}.
       *
       * <p class="codepen" data-height="677" data-theme-id="0" data-default-tab="js,result" data-user="jeremyckahn" data-slug-hash="qvZKbe" style="height: 677px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Shifty Scene Demo">
       * <span>See the Pen <a href="https://codepen.io/jeremyckahn/pen/qvZKbe/">
       * Shifty Scene Demo</a> by Jeremy Kahn (<a href="https://codepen.io/jeremyckahn">@jeremyckahn</a>)
       * on <a href="https://codepen.io">CodePen</a>.</span>
       * </p>
       * <script async src="https://static.codepen.io/assets/embed/ei.js"></script>
       * @param {...shifty.Tweenable} tweenables
       * @see https://codepen.io/jeremyckahn/pen/qvZKbe
       * @constructs shifty.Scene
       */
      function Scene() {
        scene_classCallCheck(this, Scene);

        _tweenables.set(this, {
          writable: true,
          value: []
        });

        for (var _len = arguments.length, tweenables = new Array(_len), _key = 0; _key < _len; _key++) {
          tweenables[_key] = arguments[_key];
        }

        tweenables.forEach(this.add.bind(this));
      }
      /**
       * A copy of the internal {@link shifty.Tweenable}s array.
       * @member shifty.Scene#tweenables
       * @type {Array.<shifty.Tweenable>}
       * @readonly
       */


      scene_createClass(Scene, [{
        key: "add",

        /**
         * Add a {@link shifty.Tweenable} to be controlled by this {@link
         * shifty.Scene}.
         * @method shifty.Scene#add
         * @param {shifty.Tweenable} tweenable
         * @return {shifty.Tweenable} The {@link shifty.Tweenable} that was added.
         */
        value: function add(tweenable) {
          _classPrivateFieldGet(this, _tweenables).push(tweenable);

          return tweenable;
        }
        /**
         * Remove a {@link shifty.Tweenable} that is controlled by this {@link
         * shifty.Scene}.
         * @method shifty.Scene#remove
         * @param {shifty.Tweenable} tweenable
         * @return {shifty.Tweenable} The {@link shifty.Tweenable} that was removed.
         */

      }, {
        key: "remove",
        value: function remove(tweenable) {
          var index = _classPrivateFieldGet(this, _tweenables).indexOf(tweenable);

          if (~index) {
            _classPrivateFieldGet(this, _tweenables).splice(index, 1);
          }

          return tweenable;
        }
        /**
         * [Remove]{@link shifty.Scene#remove} all {@link shifty.Tweenable}s in this {@link
         * shifty.Scene}.
         * @method shifty.Scene#empty
         * @return {Array.<shifty.Tweenable>} The {@link shifty.Tweenable}s that were
         * removed.
         */

      }, {
        key: "empty",
        value: function empty() {
          // Deliberate of the tweenables getter here to create a temporary array
          return this.tweenables.map(this.remove.bind(this));
        }
        /**
         * Is `true` if any {@link shifty.Tweenable} in this {@link shifty.Scene} is
         * playing.
         * @method shifty.Scene#isPlaying
         * @return {boolean}
         */

      }, {
        key: "isPlaying",
        value: function isPlaying() {
          return _classPrivateFieldGet(this, _tweenables).some(function (tweenable) {
            return tweenable.isPlaying();
          });
        }
        /**
         * Play all {@link shifty.Tweenable}s from their beginning.
         * @method shifty.Scene#play
         * @return {shifty.Scene}
         */

      }, {
        key: "play",
        value: function play() {
          _classPrivateFieldGet(this, _tweenables).forEach(function (tweenable) {
            return tweenable.tween();
          });

          return this;
        }
        /**
         * {@link shifty.Tweenable#pause} all {@link shifty.Tweenable}s in this
         * {@link shifty.Scene}.
         * @method shifty.Scene#pause
         * @return {shifty.Scene}
         */

      }, {
        key: "pause",
        value: function pause() {
          _classPrivateFieldGet(this, _tweenables).forEach(function (tweenable) {
            return tweenable.pause();
          });

          return this;
        }
        /**
         * {@link shifty.Tweenable#resume} all paused {@link shifty.Tweenable}s.
         * @method shifty.Scene#resume
         * @return {shifty.Scene}
         */

      }, {
        key: "resume",
        value: function resume() {
          _classPrivateFieldGet(this, _tweenables).forEach(function (tweenable) {
            return tweenable.resume();
          });

          return this;
        }
        /**
         * {@link shifty.Tweenable#stop} all {@link shifty.Tweenable}s in this {@link
         * shifty.Scene}.
         * @method shifty.Scene#stop
         * @param {boolean} [gotoEnd]
         * @return {shifty.Scene}
         */

      }, {
        key: "stop",
        value: function stop(gotoEnd) {
          _classPrivateFieldGet(this, _tweenables).forEach(function (tweenable) {
            return tweenable.stop(gotoEnd);
          });

          return this;
        }
      }, {
        key: "tweenables",
        get: function get() {
          return _toConsumableArray(_classPrivateFieldGet(this, _tweenables));
        }
        /**
         * The {@link external:Promise}s for all {@link shifty.Tweenable}s in this
         * {@link shifty.Scene} that have been configured with {@link
         * shifty.Tweenable#setConfig}. Note that each call of {@link
         * shifty.Scene#play} or {@link shifty.Scene#pause} creates new {@link
         * external:Promise}s:
         *
         *     const scene = new Scene(new Tweenable());
         *     scene.play();
         *
         *     Promise.all(scene.promises).then(() =>
         *       // Plays the scene again upon completion, but a new promise is
         *       // created so this line only runs once.
         *       scene.play()
         *     );
         *
         * @member shifty.Scene#promises
         * @type {Array.<external:Promise>}
         * @readonly
         */

      }, {
        key: "promises",
        get: function get() {
          return _classPrivateFieldGet(this, _tweenables).map(function (_ref) {
            var _promise = _ref._promise;
            return _promise;
          });
        }
      }]);

      return Scene;
    }();
    // CONCATENATED MODULE: ./src/bezier.js

    /**
     * The Bezier magic in this file is adapted/copied almost wholesale from
     * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/cubic-bezier.js),
     * which was adapted from Apple code (which probably came from
     * [here](http://opensource.apple.com/source/WebCore/WebCore-955.66/platform/graphics/UnitBezier.h)).
     * Special thanks to Apple and Thomas Fuchs for much of this code.
     */

    /**
     *  Copyright (c) 2006 Apple Computer, Inc. All rights reserved.
     *
     *  Redistribution and use in source and binary forms, with or without
     *  modification, are permitted provided that the following conditions are met:
     *
     *  1. Redistributions of source code must retain the above copyright notice,
     *  this list of conditions and the following disclaimer.
     *
     *  2. Redistributions in binary form must reproduce the above copyright notice,
     *  this list of conditions and the following disclaimer in the documentation
     *  and/or other materials provided with the distribution.
     *
     *  3. Neither the name of the copyright holder(s) nor the names of any
     *  contributors may be used to endorse or promote products derived from
     *  this software without specific prior written permission.
     *
     *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
     *  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     *  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     *  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     *  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     *  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     *  POSSIBILITY OF SUCH DAMAGE.
     */
    // port of webkit cubic bezier handling by http://www.netzgesta.de/dev/

    /**
     * @param {number} t
     * @param {number} p1x
     * @param {number} p1y
     * @param {number} p2x
     * @param {number} p2y
     * @param {number} duration
     * @returns {Function}
     * @private
     */

    function cubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
      var ax = 0,
          bx = 0,
          cx = 0,
          ay = 0,
          by = 0,
          cy = 0;

      var sampleCurveX = function sampleCurveX(t) {
        return ((ax * t + bx) * t + cx) * t;
      };

      var sampleCurveY = function sampleCurveY(t) {
        return ((ay * t + by) * t + cy) * t;
      };

      var sampleCurveDerivativeX = function sampleCurveDerivativeX(t) {
        return (3 * ax * t + 2 * bx) * t + cx;
      };

      var solveEpsilon = function solveEpsilon(duration) {
        return 1 / (200 * duration);
      };

      var fabs = function fabs(n) {
        return n >= 0 ? n : 0 - n;
      };

      var solveCurveX = function solveCurveX(x, epsilon) {
        var t0, t1, t2, x2, d2, i;

        for (t2 = x, i = 0; i < 8; i++) {
          x2 = sampleCurveX(t2) - x;

          if (fabs(x2) < epsilon) {
            return t2;
          }

          d2 = sampleCurveDerivativeX(t2);

          if (fabs(d2) < 1e-6) {
            break;
          }

          t2 = t2 - x2 / d2;
        }

        t0 = 0;
        t1 = 1;
        t2 = x;

        if (t2 < t0) {
          return t0;
        }

        if (t2 > t1) {
          return t1;
        }

        while (t0 < t1) {
          x2 = sampleCurveX(t2);

          if (fabs(x2 - x) < epsilon) {
            return t2;
          }

          if (x > x2) {
            t0 = t2;
          } else {
            t1 = t2;
          }

          t2 = (t1 - t0) * 0.5 + t0;
        }

        return t2; // Failure.
      };

      var solve = function solve(x, epsilon) {
        return sampleCurveY(solveCurveX(x, epsilon));
      };

      cx = 3 * p1x;
      bx = 3 * (p2x - p1x) - cx;
      ax = 1 - cx - bx;
      cy = 3 * p1y;
      by = 3 * (p2y - p1y) - cy;
      ay = 1 - cy - by;
      return solve(t, solveEpsilon(duration));
    } // End ported code

    /**
     *  GetCubicBezierTransition(x1, y1, x2, y2) -> Function.
     *
     *  Generates a transition easing function that is compatible
     *  with WebKit's CSS transitions `-webkit-transition-timing-function`
     *  CSS property.
     *
     *  The W3C has more information about CSS3 transition timing functions:
     *  http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
     *
     *  @param {number} x1
     *  @param {number} y1
     *  @param {number} x2
     *  @param {number} y2
     *  @return {Function}
     *  @private
     */


    var getCubicBezierTransition = function getCubicBezierTransition(x1, y1, x2, y2) {
      return function (pos) {
        return cubicBezierAtTime(pos, x1, y1, x2, y2, 1);
      };
    };
    /**
     * Create a Bezier easing function and attach it to {@link
     * shifty.Tweenable.formulas}.  This function gives you total control over the
     * easing curve.  Matthew Lein's [Ceaser](http://matthewlein.com/ceaser/) is a
     * useful tool for visualizing the curves you can make with this function.
     * @method shifty.setBezierFunction
     * @param {string} name The name of the easing curve.  Overwrites the old
     * easing function on {@link shifty.Tweenable.formulas} if it exists.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @return {shifty.easingFunction} The {@link shifty.easingFunction} that was
     * attached to {@link shifty.Tweenable.formulas}.
     */


    var bezier_setBezierFunction = function setBezierFunction(name, x1, y1, x2, y2) {
      var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
      cubicBezierTransition.displayName = name;
      cubicBezierTransition.x1 = x1;
      cubicBezierTransition.y1 = y1;
      cubicBezierTransition.x2 = x2;
      cubicBezierTransition.y2 = y2;
      return Tweenable.formulas[name] = cubicBezierTransition;
    };
    /**
     * `delete` an easing function from {@link shifty.Tweenable.formulas}.  Be
     * careful with this method, as it `delete`s whatever easing formula matches
     * `name` (which means you can delete standard Shifty easing functions).
     * @method shifty.unsetBezierFunction
     * @param {string} name The name of the easing function to delete.
     * @return {boolean} Whether or not the functions was `delete`d.
     */

    var bezier_unsetBezierFunction = function unsetBezierFunction(name) {
      return delete Tweenable.formulas[name];
    };
    // CONCATENATED MODULE: ./src/index.js
    /**
     * @namespace shifty
     */


    Tweenable.filters.token = token_namespaceObject;




    /**
     * @external Promise
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}
     */

    /**
     * @callback {Function} shifty.easingFunction
     * @param {number} position The normalized (0-1) position of the tween.
     * @return {number} The curve-adjusted value.
     */

    /**
     * @callback {Function} shifty.startFunction
     * @param {Object} state The current state of the tween.
     * @param {Object|undefined} [data] User-defined data provided via a {@link
     * shifty.tweenConfig}.
     */

    /**
     * Gets called for every tick of the tween.  This function is not called on the
     * final tick of the animation.
     * @callback {Function} shifty.renderFunction
     * @param {Object} state The current state of the tween.
     * @param {Object|undefined} [data] User-defined data provided via a {@link
     * shifty.tweenConfig}.
     * @param {number} timeElapsed The time elapsed since the start of the tween.
     */

    /**
     * @callback shifty.scheduleFunction
     * @param {Function} callback
     * @param {number} timeout
     */

    /**
     * @typedef {Object} shifty.tweenConfig
     * @property {Object} [from] Starting position.  If omitted, {@link
     * shifty.Tweenable#get} is used.
     * @property {Object} [to] Ending position.  The keys of this Object should
     * match those of `to`.
     * @property {number} [duration] How many milliseconds to animate for.
     * @property {number} [delay] How many milliseconds to wait before starting the
     * tween.
     * @property {shifty.startFunction} [start] Executes when the tween begins.
     * @property {shifty.renderFunction} [render] Executes on every tick. Legacy
     * property name: `step`.
     * @property
     * {Object.<string|shifty.easingFunction>|string|shifty.easingFunction}
     * [easing] Easing curve name(s) or {@link shifty.easingFunction}(s) to apply
     * to the properties of the tween.  If this is an Object, the keys should
     * correspond to `to`/`from`.  You can learn more about this in the {@tutorial
     * easing-function-in-depth} tutorial.
     * @property {Object} [data] Data that is passed to {@link
     * shifty.startFunction}, {@link shifty.renderFunction}, and {@link
     * shifty.promisedData}. Legacy property name: `attachment`.
     * @property {Function} [promise] Promise constructor for when you want
     * to use Promise library or polyfill Promises in unsupported environments.
     */

    /**
     * @typedef {Object} shifty.promisedData
     * @property {Object} state The current state of the tween.
     * @property {Object} data The `data` Object that the tween was configured with.
     * @property {shifty.Tweenable} tweenable The {@link shifty.Tweenable} instance to
     * which the tween belonged.
     */

    /**
     * Is called when a tween is created to determine if a filter is needed.
     * Filters are only added to a tween when it is created so that they are not
     * unnecessarily processed if they don't apply during an update tick.
     * @callback {Function} shifty.doesApplyFilter
     * @param {shifty.Tweenable} tweenable The {@link shifty.Tweenable} instance.
     * @return {boolean}
     */

    /**
     * Is called when a tween is created.  This should perform any setup needed by
     * subsequent per-tick calls to {@link shifty.beforeTween} and {@link
     * shifty.afterTween}.
     * @callback {Function} shifty.tweenCreatedFilter
     * @param {shifty.Tweenable} tweenable The {@link shifty.Tweenable} instance.
     */

    /**
     * Is called right before a tween is processed in a tick.
     * @callback {Function} shifty.beforeTweenFilter
     * @param {shifty.Tweenable} tweenable The {@link shifty.Tweenable} instance.
     */

    /**
     * Is called right after a tween is processed in a tick.
     * @callback {Function} shifty.afterTweenFilter
     * @param {shifty.Tweenable} tweenable The {@link shifty.Tweenable} instance.
     */

    /**
     * An Object that contains functions that are called at key points in a tween's
     * lifecycle.  Shifty can only process `Number`s internally, but filters can
     * expand support for any type of data.  This is the mechanism that powers
     * [string interpolation]{@tutorial string-interpolation}.
     * @typedef {Object} shifty.filter
     * @property {shifty.doesApplyFilter} doesApply Is called when a tween is
     * created.
     * @property {shifty.tweenCreatedFilter} tweenCreated Is called when a tween is
     * created.
     * @property {shifty.beforeTweenFilter} beforeTween Is called right before a
     * tween starts.
     * @property {shifty.afterTweenFilter} afterTween Is called right after a tween
     * ends.
     */

    /***/ })
    /******/ ]);
    });

    });

    // Utility functions

    var PREFIXES = 'Webkit Moz O ms'.split(' ');
    var FLOAT_COMPARISON_EPSILON = 0.001;

    // Copy all attributes from source object to destination object.
    // destination object is mutated.
    function extend(destination, source, recursive) {
        destination = destination || {};
        source = source || {};
        recursive = recursive || false;

        for (var attrName in source) {
            if (source.hasOwnProperty(attrName)) {
                var destVal = destination[attrName];
                var sourceVal = source[attrName];
                if (recursive && isObject(destVal) && isObject(sourceVal)) {
                    destination[attrName] = extend(destVal, sourceVal, recursive);
                } else {
                    destination[attrName] = sourceVal;
                }
            }
        }

        return destination;
    }

    // Renders templates with given variables. Variables must be surrounded with
    // braces without any spaces, e.g. {variable}
    // All instances of variable placeholders will be replaced with given content
    // Example:
    // render('Hello, {message}!', {message: 'world'})
    function render(template, vars) {
        var rendered = template;

        for (var key in vars) {
            if (vars.hasOwnProperty(key)) {
                var val = vars[key];
                var regExpString = '\\{' + key + '\\}';
                var regExp = new RegExp(regExpString, 'g');

                rendered = rendered.replace(regExp, val);
            }
        }

        return rendered;
    }

    function setStyle(element, style, value) {
        var elStyle = element.style;  // cache for performance

        for (var i = 0; i < PREFIXES.length; ++i) {
            var prefix = PREFIXES[i];
            elStyle[prefix + capitalize(style)] = value;
        }

        elStyle[style] = value;
    }

    function setStyles(element, styles) {
        forEachObject(styles, function(styleValue, styleName) {
            // Allow disabling some individual styles by setting them
            // to null or undefined
            if (styleValue === null || styleValue === undefined) {
                return;
            }

            // If style's value is {prefix: true, value: '50%'},
            // Set also browser prefixed styles
            if (isObject(styleValue) && styleValue.prefix === true) {
                setStyle(element, styleName, styleValue.value);
            } else {
                element.style[styleName] = styleValue;
            }
        });
    }

    function capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function isString(obj) {
        return typeof obj === 'string' || obj instanceof String;
    }

    function isFunction(obj) {
        return typeof obj === 'function';
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    // Returns true if `obj` is object as in {a: 1, b: 2}, not if it's function or
    // array
    function isObject(obj) {
        if (isArray(obj)) {
            return false;
        }

        var type = typeof obj;
        return type === 'object' && !!obj;
    }

    function forEachObject(object, callback) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                var val = object[key];
                callback(val, key);
            }
        }
    }

    function floatEquals(a, b) {
        return Math.abs(a - b) < FLOAT_COMPARISON_EPSILON;
    }

    // https://coderwall.com/p/nygghw/don-t-use-innerhtml-to-empty-dom-elements
    function removeChildren(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }

    var utils = {
        extend: extend,
        render: render,
        setStyle: setStyle,
        setStyles: setStyles,
        capitalize: capitalize,
        isString: isString,
        isFunction: isFunction,
        isObject: isObject,
        forEachObject: forEachObject,
        floatEquals: floatEquals,
        removeChildren: removeChildren
    };

    // Lower level API to animate any kind of svg path




    var Tweenable = shifty_node.Tweenable;

    var EASING_ALIASES = {
        easeIn: 'easeInCubic',
        easeOut: 'easeOutCubic',
        easeInOut: 'easeInOutCubic'
    };

    var Path = function Path(path, opts) {
        // Throw a better error if not initialized with `new` keyword
        if (!(this instanceof Path)) {
            throw new Error('Constructor was called without new keyword');
        }

        // Default parameters for animation
        opts = utils.extend({
            delay: 0,
            duration: 800,
            easing: 'linear',
            from: {},
            to: {},
            step: function() {}
        }, opts);

        var element;
        if (utils.isString(path)) {
            element = document.querySelector(path);
        } else {
            element = path;
        }

        // Reveal .path as public attribute
        this.path = element;
        this._opts = opts;
        this._tweenable = null;

        // Set up the starting positions
        var length = this.path.getTotalLength();
        this.path.style.strokeDasharray = length + ' ' + length;
        this.set(0);
    };

    Path.prototype.value = function value() {
        var offset = this._getComputedDashOffset();
        var length = this.path.getTotalLength();

        var progress = 1 - offset / length;
        // Round number to prevent returning very small number like 1e-30, which
        // is practically 0
        return parseFloat(progress.toFixed(6), 10);
    };

    Path.prototype.set = function set(progress) {
        this.stop();

        this.path.style.strokeDashoffset = this._progressToOffset(progress);

        var step = this._opts.step;
        if (utils.isFunction(step)) {
            var easing = this._easing(this._opts.easing);
            var values = this._calculateTo(progress, easing);
            var reference = this._opts.shape || this;
            step(values, reference, this._opts.attachment);
        }
    };

    Path.prototype.stop = function stop() {
        this._stopTween();
        this.path.style.strokeDashoffset = this._getComputedDashOffset();
    };

    // Method introduced here:
    // http://jakearchibald.com/2013/animated-line-drawing-svg/
    Path.prototype.animate = function animate(progress, opts, cb) {
        opts = opts || {};

        if (utils.isFunction(opts)) {
            cb = opts;
            opts = {};
        }

        var passedOpts = utils.extend({}, opts);

        // Copy default opts to new object so defaults are not modified
        var defaultOpts = utils.extend({}, this._opts);
        opts = utils.extend(defaultOpts, opts);

        var shiftyEasing = this._easing(opts.easing);
        var values = this._resolveFromAndTo(progress, shiftyEasing, passedOpts);

        this.stop();

        // Trigger a layout so styles are calculated & the browser
        // picks up the starting position before animating
        this.path.getBoundingClientRect();

        var offset = this._getComputedDashOffset();
        var newOffset = this._progressToOffset(progress);

        var self = this;
        this._tweenable = new Tweenable();
        this._tweenable.tween({
            from: utils.extend({ offset: offset }, values.from),
            to: utils.extend({ offset: newOffset }, values.to),
            duration: opts.duration,
            delay: opts.delay,
            easing: shiftyEasing,
            step: function(state) {
                self.path.style.strokeDashoffset = state.offset;
                var reference = opts.shape || self;
                opts.step(state, reference, opts.attachment);
            }
        }).then(function(state) {
            if (utils.isFunction(cb)) {
                cb();
            }
        });
    };

    Path.prototype._getComputedDashOffset = function _getComputedDashOffset() {
        var computedStyle = window.getComputedStyle(this.path, null);
        return parseFloat(computedStyle.getPropertyValue('stroke-dashoffset'), 10);
    };

    Path.prototype._progressToOffset = function _progressToOffset(progress) {
        var length = this.path.getTotalLength();
        return length - progress * length;
    };

    // Resolves from and to values for animation.
    Path.prototype._resolveFromAndTo = function _resolveFromAndTo(progress, easing, opts) {
        if (opts.from && opts.to) {
            return {
                from: opts.from,
                to: opts.to
            };
        }

        return {
            from: this._calculateFrom(easing),
            to: this._calculateTo(progress, easing)
        };
    };

    // Calculate `from` values from options passed at initialization
    Path.prototype._calculateFrom = function _calculateFrom(easing) {
        return shifty_node.interpolate(this._opts.from, this._opts.to, this.value(), easing);
    };

    // Calculate `to` values from options passed at initialization
    Path.prototype._calculateTo = function _calculateTo(progress, easing) {
        return shifty_node.interpolate(this._opts.from, this._opts.to, progress, easing);
    };

    Path.prototype._stopTween = function _stopTween() {
        if (this._tweenable !== null) {
            this._tweenable.stop();
            this._tweenable = null;
        }
    };

    Path.prototype._easing = function _easing(easing) {
        if (EASING_ALIASES.hasOwnProperty(easing)) {
            return EASING_ALIASES[easing];
        }

        return easing;
    };

    var path = Path;

    // Base object for different progress bar shapes




    var DESTROYED_ERROR = 'Object is destroyed';

    var Shape = function Shape(container, opts) {
        // Throw a better error if progress bars are not initialized with `new`
        // keyword
        if (!(this instanceof Shape)) {
            throw new Error('Constructor was called without new keyword');
        }

        // Prevent calling constructor without parameters so inheritance
        // works correctly. To understand, this is how Shape is inherited:
        //
        //   Line.prototype = new Shape();
        //
        // We just want to set the prototype for Line.
        if (arguments.length === 0) {
            return;
        }

        // Default parameters for progress bar creation
        this._opts = utils.extend({
            color: '#555',
            strokeWidth: 1.0,
            trailColor: null,
            trailWidth: null,
            fill: null,
            text: {
                style: {
                    color: null,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    padding: 0,
                    margin: 0,
                    transform: {
                        prefix: true,
                        value: 'translate(-50%, -50%)'
                    }
                },
                autoStyleContainer: true,
                alignToBottom: true,
                value: null,
                className: 'progressbar-text'
            },
            svgStyle: {
                display: 'block',
                width: '100%'
            },
            warnings: false
        }, opts, true);  // Use recursive extend

        // If user specifies e.g. svgStyle or text style, the whole object
        // should replace the defaults to make working with styles easier
        if (utils.isObject(opts) && opts.svgStyle !== undefined) {
            this._opts.svgStyle = opts.svgStyle;
        }
        if (utils.isObject(opts) && utils.isObject(opts.text) && opts.text.style !== undefined) {
            this._opts.text.style = opts.text.style;
        }

        var svgView = this._createSvgView(this._opts);

        var element;
        if (utils.isString(container)) {
            element = document.querySelector(container);
        } else {
            element = container;
        }

        if (!element) {
            throw new Error('Container does not exist: ' + container);
        }

        this._container = element;
        this._container.appendChild(svgView.svg);
        if (this._opts.warnings) {
            this._warnContainerAspectRatio(this._container);
        }

        if (this._opts.svgStyle) {
            utils.setStyles(svgView.svg, this._opts.svgStyle);
        }

        // Expose public attributes before Path initialization
        this.svg = svgView.svg;
        this.path = svgView.path;
        this.trail = svgView.trail;
        this.text = null;

        var newOpts = utils.extend({
            attachment: undefined,
            shape: this
        }, this._opts);
        this._progressPath = new path(svgView.path, newOpts);

        if (utils.isObject(this._opts.text) && this._opts.text.value !== null) {
            this.setText(this._opts.text.value);
        }
    };

    Shape.prototype.animate = function animate(progress, opts, cb) {
        if (this._progressPath === null) {
            throw new Error(DESTROYED_ERROR);
        }

        this._progressPath.animate(progress, opts, cb);
    };

    Shape.prototype.stop = function stop() {
        if (this._progressPath === null) {
            throw new Error(DESTROYED_ERROR);
        }

        // Don't crash if stop is called inside step function
        if (this._progressPath === undefined) {
            return;
        }

        this._progressPath.stop();
    };

    Shape.prototype.pause = function pause() {
        if (this._progressPath === null) {
            throw new Error(DESTROYED_ERROR);
        }

        if (this._progressPath === undefined) {
            return;
        }

        if (!this._progressPath._tweenable) {
            // It seems that we can't pause this
            return;
        }

        this._progressPath._tweenable.pause();
    };

    Shape.prototype.resume = function resume() {
        if (this._progressPath === null) {
            throw new Error(DESTROYED_ERROR);
        }

        if (this._progressPath === undefined) {
            return;
        }

        if (!this._progressPath._tweenable) {
            // It seems that we can't resume this
            return;
        }

        this._progressPath._tweenable.resume();
    };

    Shape.prototype.destroy = function destroy() {
        if (this._progressPath === null) {
            throw new Error(DESTROYED_ERROR);
        }

        this.stop();
        this.svg.parentNode.removeChild(this.svg);
        this.svg = null;
        this.path = null;
        this.trail = null;
        this._progressPath = null;

        if (this.text !== null) {
            this.text.parentNode.removeChild(this.text);
            this.text = null;
        }
    };

    Shape.prototype.set = function set(progress) {
        if (this._progressPath === null) {
            throw new Error(DESTROYED_ERROR);
        }

        this._progressPath.set(progress);
    };

    Shape.prototype.value = function value() {
        if (this._progressPath === null) {
            throw new Error(DESTROYED_ERROR);
        }

        if (this._progressPath === undefined) {
            return 0;
        }

        return this._progressPath.value();
    };

    Shape.prototype.setText = function setText(newText) {
        if (this._progressPath === null) {
            throw new Error(DESTROYED_ERROR);
        }

        if (this.text === null) {
            // Create new text node
            this.text = this._createTextContainer(this._opts, this._container);
            this._container.appendChild(this.text);
        }

        // Remove previous text and add new
        if (utils.isObject(newText)) {
            utils.removeChildren(this.text);
            this.text.appendChild(newText);
        } else {
            this.text.innerHTML = newText;
        }
    };

    Shape.prototype._createSvgView = function _createSvgView(opts) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this._initializeSvg(svg, opts);

        var trailPath = null;
        // Each option listed in the if condition are 'triggers' for creating
        // the trail path
        if (opts.trailColor || opts.trailWidth) {
            trailPath = this._createTrail(opts);
            svg.appendChild(trailPath);
        }

        var path = this._createPath(opts);
        svg.appendChild(path);

        return {
            svg: svg,
            path: path,
            trail: trailPath
        };
    };

    Shape.prototype._initializeSvg = function _initializeSvg(svg, opts) {
        svg.setAttribute('viewBox', '0 0 100 100');
    };

    Shape.prototype._createPath = function _createPath(opts) {
        var pathString = this._pathString(opts);
        return this._createPathElement(pathString, opts);
    };

    Shape.prototype._createTrail = function _createTrail(opts) {
        // Create path string with original passed options
        var pathString = this._trailString(opts);

        // Prevent modifying original
        var newOpts = utils.extend({}, opts);

        // Defaults for parameters which modify trail path
        if (!newOpts.trailColor) {
            newOpts.trailColor = '#eee';
        }
        if (!newOpts.trailWidth) {
            newOpts.trailWidth = newOpts.strokeWidth;
        }

        newOpts.color = newOpts.trailColor;
        newOpts.strokeWidth = newOpts.trailWidth;

        // When trail path is set, fill must be set for it instead of the
        // actual path to prevent trail stroke from clipping
        newOpts.fill = null;

        return this._createPathElement(pathString, newOpts);
    };

    Shape.prototype._createPathElement = function _createPathElement(pathString, opts) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathString);
        path.setAttribute('stroke', opts.color);
        path.setAttribute('stroke-width', opts.strokeWidth);

        if (opts.fill) {
            path.setAttribute('fill', opts.fill);
        } else {
            path.setAttribute('fill-opacity', '0');
        }

        return path;
    };

    Shape.prototype._createTextContainer = function _createTextContainer(opts, container) {
        var textContainer = document.createElement('div');
        textContainer.className = opts.text.className;

        var textStyle = opts.text.style;
        if (textStyle) {
            if (opts.text.autoStyleContainer) {
                container.style.position = 'relative';
            }

            utils.setStyles(textContainer, textStyle);
            // Default text color to progress bar's color
            if (!textStyle.color) {
                textContainer.style.color = opts.color;
            }
        }

        this._initializeTextContainer(opts, container, textContainer);
        return textContainer;
    };

    // Give custom shapes possibility to modify text element
    Shape.prototype._initializeTextContainer = function(opts, container, element) {
        // By default, no-op
        // Custom shapes should respect API options, such as text.style
    };

    Shape.prototype._pathString = function _pathString(opts) {
        throw new Error('Override this function for each progress bar');
    };

    Shape.prototype._trailString = function _trailString(opts) {
        throw new Error('Override this function for each progress bar');
    };

    Shape.prototype._warnContainerAspectRatio = function _warnContainerAspectRatio(container) {
        if (!this.containerAspectRatio) {
            return;
        }

        var computedStyle = window.getComputedStyle(container, null);
        var width = parseFloat(computedStyle.getPropertyValue('width'), 10);
        var height = parseFloat(computedStyle.getPropertyValue('height'), 10);
        if (!utils.floatEquals(this.containerAspectRatio, width / height)) {
            console.warn(
                'Incorrect aspect ratio of container',
                '#' + container.id,
                'detected:',
                computedStyle.getPropertyValue('width') + '(width)',
                '/',
                computedStyle.getPropertyValue('height') + '(height)',
                '=',
                width / height
            );

            console.warn(
                'Aspect ratio of should be',
                this.containerAspectRatio
            );
        }
    };

    var shape = Shape;

    // Line shaped progress bar




    var Line = function Line(container, options) {
        this._pathTemplate = 'M 0,{center} L 100,{center}';
        shape.apply(this, arguments);
    };

    Line.prototype = new shape();
    Line.prototype.constructor = Line;

    Line.prototype._initializeSvg = function _initializeSvg(svg, opts) {
        svg.setAttribute('viewBox', '0 0 100 ' + opts.strokeWidth);
        svg.setAttribute('preserveAspectRatio', 'none');
    };

    Line.prototype._pathString = function _pathString(opts) {
        return utils.render(this._pathTemplate, {
            center: opts.strokeWidth / 2
        });
    };

    Line.prototype._trailString = function _trailString(opts) {
        return this._pathString(opts);
    };

    var line = Line;

    // Circle shaped progress bar




    var Circle = function Circle(container, options) {
        // Use two arcs to form a circle
        // See this answer http://stackoverflow.com/a/10477334/1446092
        this._pathTemplate =
            'M 50,50 m 0,-{radius}' +
            ' a {radius},{radius} 0 1 1 0,{2radius}' +
            ' a {radius},{radius} 0 1 1 0,-{2radius}';

        this.containerAspectRatio = 1;

        shape.apply(this, arguments);
    };

    Circle.prototype = new shape();
    Circle.prototype.constructor = Circle;

    Circle.prototype._pathString = function _pathString(opts) {
        var widthOfWider = opts.strokeWidth;
        if (opts.trailWidth && opts.trailWidth > opts.strokeWidth) {
            widthOfWider = opts.trailWidth;
        }

        var r = 50 - widthOfWider / 2;

        return utils.render(this._pathTemplate, {
            radius: r,
            '2radius': r * 2
        });
    };

    Circle.prototype._trailString = function _trailString(opts) {
        return this._pathString(opts);
    };

    var circle = Circle;

    // Semi-SemiCircle shaped progress bar





    var SemiCircle = function SemiCircle(container, options) {
        // Use one arc to form a SemiCircle
        // See this answer http://stackoverflow.com/a/10477334/1446092
        this._pathTemplate =
            'M 50,50 m -{radius},0' +
            ' a {radius},{radius} 0 1 1 {2radius},0';

        this.containerAspectRatio = 2;

        shape.apply(this, arguments);
    };

    SemiCircle.prototype = new shape();
    SemiCircle.prototype.constructor = SemiCircle;

    SemiCircle.prototype._initializeSvg = function _initializeSvg(svg, opts) {
        svg.setAttribute('viewBox', '0 0 100 50');
    };

    SemiCircle.prototype._initializeTextContainer = function _initializeTextContainer(
        opts,
        container,
        textContainer
    ) {
        if (opts.text.style) {
            // Reset top style
            textContainer.style.top = 'auto';
            textContainer.style.bottom = '0';

            if (opts.text.alignToBottom) {
                utils.setStyle(textContainer, 'transform', 'translate(-50%, 0)');
            } else {
                utils.setStyle(textContainer, 'transform', 'translate(-50%, 50%)');
            }
        }
    };

    // Share functionality with Circle, just have different path
    SemiCircle.prototype._pathString = circle.prototype._pathString;
    SemiCircle.prototype._trailString = circle.prototype._trailString;

    var semicircle = SemiCircle;

    // Square shaped progress bar
    // Note: Square is not core part of API anymore. It's left here
    //       for reference. square is not included to the progressbar
    //       build anymore




    var Square = function Square(container, options) {
        this._pathTemplate =
            'M 0,{halfOfStrokeWidth}' +
            ' L {width},{halfOfStrokeWidth}' +
            ' L {width},{width}' +
            ' L {halfOfStrokeWidth},{width}' +
            ' L {halfOfStrokeWidth},{strokeWidth}';

        this._trailTemplate =
            'M {startMargin},{halfOfStrokeWidth}' +
            ' L {width},{halfOfStrokeWidth}' +
            ' L {width},{width}' +
            ' L {halfOfStrokeWidth},{width}' +
            ' L {halfOfStrokeWidth},{halfOfStrokeWidth}';

        shape.apply(this, arguments);
    };

    Square.prototype = new shape();
    Square.prototype.constructor = Square;

    Square.prototype._pathString = function _pathString(opts) {
        var w = 100 - opts.strokeWidth / 2;

        return utils.render(this._pathTemplate, {
            width: w,
            strokeWidth: opts.strokeWidth,
            halfOfStrokeWidth: opts.strokeWidth / 2
        });
    };

    Square.prototype._trailString = function _trailString(opts) {
        var w = 100 - opts.strokeWidth / 2;

        return utils.render(this._trailTemplate, {
            width: w,
            strokeWidth: opts.strokeWidth,
            halfOfStrokeWidth: opts.strokeWidth / 2,
            startMargin: opts.strokeWidth / 2 - opts.trailWidth / 2
        });
    };

    var square = Square;

    var main = {
        // Higher level API, different shaped progress bars
        Line: line,
        Circle: circle,
        SemiCircle: semicircle,
        Square: square,

        // Lower level API to use any SVG path
        Path: path,

        // Base-class for creating new custom shapes
        // to be in line with the API of built-in shapes
        // Undocumented.
        Shape: shape,

        // Internal utils, undocumented.
        utils: utils
    };

    function sidebar(main$1) {
      var sidebar = addElement('sidebar', main$1);
      var legends = addElement('legends', sidebar);
      var progress = addElement('progress', sidebar);
      var timer = addElement('timer', progress);
      progress.circle = new main.Circle(progress.node(), {
        color: '#555',
        trailColor: '#ccc',
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1,
        text: {
          autoStyleContainer: false
        },
        from: {
          color: '#aaa',
          width: 1
        },
        to: {
          color: '#333',
          width: 4
        },
        step: function step(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
          circle.setText("".concat(circle.value() < 0.0095 ? d3.format('.1%')(circle.value()) : d3.format('.0%')(circle.value()), " complete"));
        }
      });
      var resetDelay = this.settings.resetDelay / 1000;
      var countdown = addElement('countdown', progress).selectAll('div').data(d3.range(-1, resetDelay)).join('div').text(function (d) {
        return "Looping in ".concat(d + 1, " second").concat(d === 0 ? '' : 's');
      }).classed('fdg-hidden', function (d) {
        return d !== resetDelay - 1;
      }).classed('fdg-invisible', function (d) {
        return d === resetDelay - 1;
      });
      var freqTable = addElement('freq-table', sidebar);
      return {
        sidebar: sidebar,
        legends: legends,
        progress: progress,
        timer: timer,
        countdown: countdown,
        freqTable: freqTable
      };
    }

    function canvas(main) {
      var animation = addElement('animation', main);
      this.settings.width = animation.node().clientWidth;
      this.settings.height = animation.node().clientHeight; // background SVG

      var svgBackground = addElement('svg--background', animation, 'svg').attr('width', this.settings.width).attr('height', this.settings.height); // canvas

      var canvas = addElement('canvas', animation, 'canvas').attr('width', this.settings.width).attr('height', this.settings.height);
      canvas.context = canvas.node().getContext('2d'); // SVG

      var svgForeground = addElement('svg--foreground', animation, 'svg').attr('width', this.settings.width).attr('height', this.settings.height); // modal

      var modalContainer = addElement('modal', animation); // TODO: add button to clear or hide modal
      //const modalClear = addElement('modal__clear', modalContainer)
      //    //.classed('fdg-hidden', true)
      //    .text('x');
      //modalClear
      //    .on('mouseover', function() {
      //        if (this.classList.includes('fdg-hidden'))
      //            this.classList.toggle('fdg-hidden')
      //    })
      //    .on('click', () => {
      //        this.modal.stop();
      //    });

      var modal = addElement('modal__text', modalContainer);
      return {
        animation: animation,
        svgBackground: svgBackground,
        canvas: canvas,
        svgForeground: svgForeground,
        modal: modal
      };
    }

    function layout() {
      var main = addElement('main', d3.select(this.element)); // controls on top

      var controls$1 = controls.call(this, main); // sidebar to the left

      var sidebar$1 = sidebar.call(this, main); // animation to the right

      var canvas$1 = canvas.call(this, main);
      return _objectSpread2(_objectSpread2(_objectSpread2({
        main: main
      }, controls$1), sidebar$1), canvas$1);
    }

    function id() {
      var nest = d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (group) {
        return {
          duration: d3.sum(group, function (d) {
            return +d.duration;
          }),
          "static": group.length === 1
        };
      }).entries(this.data);
      nest.forEach(function (d) {
        Object.assign(d, d.value);
        d.value = d.key;
        d.duration = d.value;
        delete d.key;
      });
      return nest;
    }

    function event() {
      var nest = d3.nest().key(function (d) {
        return d.event;
      }).rollup(function (group) {
        var event = group[0];
        var order = parseInt(event.event_order);
        var position = event.hasOwnProperty('event_position') ? parseInt(event.event_position) : 0;
        return {
          order: order,
          position: position,
          count: 0,
          prevCount: 0,
          cumulative: 0,
          nEvents: group.length
        };
      }).entries(this.data);
      nest.forEach(function (event) {
        Object.assign(event, event.value);
        event.value = event.key;
        delete event.key;
      }); // Ensure events plot in order.

      nest.sort(function (a, b) {
        return a.order - b.order || b.nEvents - a.nEvents;
      });
      return nest;
    }

    function orbit(event) {
      var _this = this;

      var nest = d3.nest().key(function (d) {
        return d.order;
      }).entries(event.filter(function (event) {
        return event.value !== _this.settings.eventCentral;
      })); //export default function orbits(event) {
      //    const nest = d3
      //        .nest()
      //        .key((d) => d.order)
      //        .entries(event.filter((event) => event.value !== this.settings.eventCentral))
      //        .map((d, i) => {
      //            d.cx = this.settings.width / 2;
      //            d.cy = this.settings.height / 2;
      //            d.r = (i + 1) * 100 + 50;
      //
      //            return d;
      //        });
      //
      //    return nest;
      //}

      return nest;
    }

    function coordinates(metadata) {
      var _this = this;

      // Dimensions of canvas.
      this.settings.orbitRadius = this.settings.width / (metadata.orbit.length + 1); // Calculate coordinates of event focus.

      var centerX = this.settings.orbitRadius / 2;
      var centerY = this.settings.height / 2;
      var theta = 2 * Math.PI / (this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral - 1);

      var thetaFactor = function thetaFactor(i) {
        return i === 0 ? 0 : i === 1 ? -1.75 : i === 2 ? 0.75 : i === 3 ? -0.25 : i === 4 ? 0.25 : 0;
      };

      metadata.event.forEach(function (event, i) {
        event.radius = event.order * _this.settings.orbitRadius; //event.theta = thetaFactor(i) * theta

        event.theta = event.position !== 0 ? 2 * Math.PI * event.position / 360 : thetaFactor(i) * theta;
        event.x = event.order === 0 ? centerX : centerX + event.radius * // number of orbit radii from the center
        Math.cos(event.theta); // position along the circle at the given orbit along which

        event.y = event.order === 0 ? centerY : centerY + event.radius * // number of orbit radii from the center
        Math.sin(event.theta); // y-position of the along the given orbit at which the focus circle at the
      }); // Calculate dimensions of orbits.

      metadata.orbit.forEach(function (d, i) {
        d.cx = centerX;
        d.cy = centerY;
        d.r = (i + 1) * _this.settings.orbitRadius;
      });
    }

    function defineMetadata() {
      var _this = this;

      // Define sets.
      var metadata = {}; // Add additional metadata to ID set.

      metadata.id = id.call(this); // Settings dependent on the ID set.

      this.settings.duration = this.settings.duration || d3.max(metadata.id, function (id) {
        return id.duration;
      });
      this.settings.minRadius = this.settings.minRadius || 3000 / metadata.id.filter(function (d) {
        return !(_this.settings.drawStaticSeparately && d["static"]);
      }).length;
      this.settings.staticRadius = this.settings.staticRadius || 3000 / metadata.id.length;
      this.settings.maxRadius = this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
      this.settings.chargeStrength = -(2000 / metadata.id.filter(function (d) {
        return !(_this.settings.drawStaticSeparately && d["static"]);
      }).length);
      this.settings.staticChargeStrength = -(2000 / metadata.id.length);
      this.settings.fill = this.settings.fill || metadata.id.length <= 2500; // Add additional metadata to event set.

      metadata.event = event.call(this); // Update settings that depend on event set.

      this.settings.width = this.settings.width || metadata.event.length;
      this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].value;
      this.settings.eventFinal = Array.isArray(this.settings.eventFinal) && this.settings.eventFinal.length ? this.settings.eventFinal : [this.settings.eventFinal || metadata.event[metadata.event.length - 1].value];
      this.settings.nFoci = this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral; // number of event types minus one

      this.settings.eventChangeCount = this.settings.eventChangeCount || metadata.event.slice(1).map(function (event) {
        return event.value;
      });
      this.settings.R = this.settings.width / metadata.event.length / 2; // Define orbits.

      metadata.orbit = orbit.call(this, metadata.event); // Determine the dimensions of the canvas, the position of the foci, and the size of the orbits.

      coordinates.call(this, metadata); // Define color scale.

      var colors = this.settings.colors();

      if (this.settings.colorBy.type === 'frequency') {
        this.colorScale = d3.scaleLinear().domain(d3.range(colors.length)).range(colors).clamp(true);
      } else if (this.settings.colorBy.type === 'continuous') {
        this.colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain(d3.extent(this.data, function (d) {
          return d[_this.settings.colorBy.variable];
        }));
        var interpolator = this.colorScale.interpolator(); // read the color scale's interpolator

        var mirror = function mirror(t) {
          return interpolator(1 - t);
        }; // returns the mirror image of the interpolator


        if (this.settings.colorBy.mirror) this.colorScale.interpolator(mirror); // updates the scale's interpolator
      } else if (this.settings.colorBy.type === 'categorical') {
        this.colorScale = d3.scaleOrdinal().domain(_toConsumableArray(new Set(this.data.map(function (d) {
          return d[_this.settings.colorBy.variable];
        })).values())).range(d3.schemeTableau10);
      }

      return metadata;
    }

    function getState(group, index) {
      var _this = this;

      var state = index !== undefined ? group[index] : group.find(function (d, i) {
        return d.start_timepoint <= _this.settings.timepoint && _this.settings.timepoint <= d.end_timepoint || i === group.length - 1;
      });
      return state;
    }

    function countStateChanges(group) {
      var _this = this;

      var nStateChanges = group.filter(function (d) {
        return d.start_timepoint <= _this.settings.timepoint;
      }).sort(function (a, b) {
        return a.start_timepoint - b.start_timepoint;
      }).filter(function (d, i, data) {
        var eventPrevious = data[i - 1] ? data[i - 1].event : null;
        return !_this.settings.eventChangeCount.includes(eventPrevious) && _this.settings.eventChangeCount.includes(d.event);
      }).length;
      return nStateChanges;
    }

    function defineRadius(stateChanges) {
      var r = this.settings.eventChangeCountAesthetic !== 'color' ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius) : this.settings.minRadius;
      return r;
    }

    function defineColor(value) {
      var color = this.settings.eventChangeCountAesthetic !== 'size' ? //? this.settings.color(value)
      this.colorScale(value) : 'rgb(170,170,170)';
      var fill = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
      var stroke = color.replace('rgb', 'rgba').replace(')', ', 1)');
      return {
        color: color,
        fill: fill,
        stroke: stroke
      };
    }

    function defineDatum(group, state, statePrevious) {
      // Count state changes.
      var nStateChanges = countStateChanges.call(this, group, statePrevious); // Count state changes.

      var aesthetic = this.settings.colorBy.type === 'frequency' ? nStateChanges : state[this.settings.colorBy.variable]; // Define radius.

      var r = defineRadius.call(this, aesthetic); // Define color.

      var color = defineColor.call(this, aesthetic);
      return _objectSpread2({
        nStateChanges: nStateChanges,
        // number of state changes the indivdual has experienced a thus far
        aesthetic: aesthetic,
        // value that controls color
        r: r
      }, color);
    }

    function data() {
      var _this = this;

      // Count the number of individuals at each focus at previous timepoint.
      this.metadata.event.forEach(function (event) {
        event.prevCount = event.count;
      });
      this.data.nested.forEach(function (d) {
        // Update individual to next event.
        d.value.statePrevious = d.value.state;
        d.value.state = getState.call(_this, d.value.group);
        var datum = defineDatum.call(_this, d.value.group, d.value.state, d.value.statePrevious);
        Object.assign(d.value, datum);
      }); // Record change in number of IDs at each focus at current timepoint.

      this.metadata.event.forEach(function (event) {
        event.data = _this.data.nested.filter(function (d) {
          return d.value.state.event === event.value;
        });
        event.count = event.data.length;
        event.cumulative = _this.data.filter(function (d) {
          return d.event === event.value && d.start_timepoint <= _this.settings.timepoint;
        }).length;
        event.change = event.count - event.prevCount;
      });
    }

    function pulseOrbits() {
      var fdg = this;
      this.orbits.each(function (d) {
        d.change = d3.sum(d.values, function (di) {
          return di.change;
        });

        if (d.change > 0) {
          d3.select(this).transition().duration(fdg.settings.speeds[fdg.settings.speed] / 2).attr('stroke-width', 0.5 * d.change).transition().duration(fdg.settings.speeds[fdg.settings.speed] / 2).attr('stroke-width', 0.5);
        }
      });
    }

    function text() {
      var _this = this;

      // Update timepoint control.
      this.controls.timepoint.inputs.property('value', this.settings.timepoint); // Update timer.

      this.containers.timer.text("".concat(this.settings.timepoint, " ").concat(this.settings.timeUnit)); // Update progress bar.

      this.containers.progress.attr('title', "The animation is ".concat(d3.format('.1%')(this.settings.timepoint / this.settings.duration), " complete with ").concat(this.settings.duration - this.settings.timepoint, " ").concat(this.settings.timeUnit.split(' ')[0], " to go."));
      this.containers.progress.circle.animate(this.settings.timepoint / this.settings.duration); // Update focus percentages

      if (this.settings.eventCount) this.focusAnnotations.selectAll('tspan.fdg-focus-annotation__event-count').text(function (d) {
        return "".concat(d.count, " (").concat(d3.format('.1%')(d.count / _this.data.nested.length), ")");
      }); // Update frequency table.

      this.freqTable.tr.selectAll('td').data(function (event) {
        return [event.value, event.cumulative];
      }).join('td').text(function (d) {
        return typeof d === 'number' ? d3.format(',d')(d) : d;
      });
    }

    function update() {
      // Update the node data.
      data.call(this); // Accentuate the orbits when an event occurs.

      pulseOrbits.call(this); // Update timer, focus labels, and annotations.

      text.call(this);
    }

    function countdown() {
      var _this = this;

      var counter = this.settings.resetDelay / 1000 - 1;
      this.containers.countdown.classed('fdg-invisible', false).classed('fdg-hidden', function (d) {
        return d !== counter;
      });
      var interval = window.setInterval(function () {
        counter--;

        _this.containers.countdown.classed('fdg-hidden', function (d) {
          return d !== counter;
        });
      }, 1000);
      return interval;
    }

    function fadeOut(modalSpeed) {
      d3.select(this).transition().duration(modalSpeed / 15).delay(modalSpeed - modalSpeed / 15 * 2).style('opacity', 0);
    }

    function fadeIn(selection, modalSpeed) {
      selection.style('opacity', 0).transition().duration(modalSpeed / 15).style('opacity', 1).on('end', function () {
        fadeOut.call(this, modalSpeed);
      });
    }

    function runModal() {
      var _this = this;

      this.containers.modal.html(this.settings.text[this.settings.modalIndex]).call(fadeIn, this.settings.modalSpeed);
      this.modal = d3.interval(function () {
        _this.settings.modalIndex++;
        if (_this.settings.modalIndex === _this.settings.text.length - 1) _this.modal.stop(); //this.settings.modalIndex = 0;

        _this.containers.modal.html(_this.settings.text[_this.settings.modalIndex]).call(fadeIn, _this.settings.modalSpeed); //if (this.settings.modalIndex === text.length - 1) {
        //    d3.timeout(() => {
        //        this.modal.stop();
        //        //this.containers.modal.classed('fdg-hidden', true);
        //    }, 8000);
        //}

      }, this.settings.modalSpeed);
    }

    function resetAnimation() {
      var _this = this;

      this.settings.timepoint = 0;
      this.settings.modalIndex = 0;
      this.controls.timepoint.inputs.attr('value', 0); // Update the event object of the population.

      this.metadata.event.forEach(function (event) {
        event.prevCount = 0;
        event.count = 0;
        event.cumulative = 0;
      });
      this.data.nested.forEach(function (d) {
        // Initial event for the given individual.
        d.value.statePrevious = null;
        d.value.state = getState.call(_this, d.value.group, 0);
        var datum = defineDatum.call(_this, d.value.group, d.value.state, d.value.statePrevious);
        Object.assign(d.value, datum);
      });
      if (this.modal) this.modal.stop();
      runModal.call(this);
    }

    function timeout(countdown) {
      var _this = this;

      var timeout = window.setTimeout(function () {
        resetAnimation.call(_this);

        _this.containers.timer.text("".concat(_this.settings.timepoint, " ").concat(_this.settings.timeUnit));

        _this.containers.progress.circle.animate(_this.settings.timepoint / _this.settings.duration);

        window.clearInterval(countdown);
        window.clearTimeout(timeout);

        _this.containers.countdown.classed('fdg-invisible', function (d) {
          return d === _this.settings.resetDelay / 1000 - 1;
        }).classed('fdg-hidden', function (d) {
          return d !== _this.settings.resetDelay / 1000 - 1;
        });

        _this.interval = startInterval.call(_this);
      }, this.settings.resetDelay);
      return timeout;
    }

    function reset() {
      this.interval.stop(); // Display a visual countdown to reset.

      var countdown$1 = countdown.call(this); // Set a timeout before resetting the animation.

      var timeout$1 = timeout.call(this, countdown$1);
    }

    function restartForceSimulation() {
      var _this = this;

      this.metadata.event.forEach(function (event) {
        // Center points initially then remove centering force.
        if (_this.settings.timepoint === 1) event.forceSimulation.force('center', null);
        event.forceSimulation.nodes(event.data.filter(function (d) {
          return !d.value.noStateChange;
        }));
        event.forceSimulation.alpha(1).restart();
      });
    }

    var increment = function increment(arg) {
      // Increment the timepoint.
      this.settings.timepoint += !!arg; // update animation if timepoint is less than duration of animation

      if (this.settings.timepoint <= this.settings.duration) update.call(this); // otherwise reset animation
      else reset.call(this); // Resume the force simulation.

      restartForceSimulation.call(this);
    }; // Default returns an interval that runs increment() every time unit.

    function startInterval() {
      var interval = d3.interval(increment.bind(this), this.settings.speeds[this.settings.speed]);
      return interval;
    }

    var playPause = [{
      action: 'play',
      label: 'Play',
      html: '&#9658;'
    }, {
      action: 'pause',
      label: 'Pause',
      html: '&#10074;&#10074;'
    }];
    function toggle() {
      var _this = this;

      // Update setting.
      this.settings.playPause = playPause.find(function (value) {
        return value.action !== _this.settings.playPause;
      }).action; // toggle playPause setting
      // Update tooltip and display text.

      this.controls.playPause.inputs.attr('title', "".concat(playPause.find(function (value) {
        return value.action !== _this.settings.playPause;
      }).label, " animation")).html(playPause.find(function (value) {
        return value.action !== _this.settings.playPause;
      }).html); // Pause or play animation.

      if (this.settings.playPause === 'play') this.interval = startInterval.call(this);else this.interval.stop();
    }

    function speed() {
      var _this = this;

      var fdg = this;
      var container = this.controls.container.append('div').classed('fdg-control fdg-control--speed', true);
      var inputs = container.selectAll('div').data(Object.keys(this.settings.speeds).map(function (key) {
        return {
          label: key,
          value: _this.settings.speeds[key]
        };
      })).enter().append('div').attr('class', function (d) {
        return "fdg-button ".concat(d.label, " ").concat(d.label === _this.settings.speed ? 'current' : '');
      }).attr('title', function (d) {
        return "Advance the animation every ".concat(_this.settings.speeds[d.label] / 1000, " second(s).");
      }).text(function (d) {
        return d.label;
      });
      inputs.on('click', function (d) {
        fdg.settings.speed = d.label;
        inputs.classed('current', function (di) {
          return di.label === d.label;
        });

        if (fdg.settings.playPause === 'play') {
          fdg.interval.stop();
          fdg.interval = startInterval.call(fdg);
        }
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function playPause$1() {
      var _this = this;
      var container = this.controls.container.append('div').classed('fdg-control fdg-control--play-pause', true);
      var inputs = container.append('div').classed("fdg-button fdg-input", true).attr('title', "".concat(playPause.find(function (value) {
        return value.action !== _this.settings.playPause;
      }).label, " animation.")).html(playPause.find(function (value) {
        return value.action !== _this.settings.playPause;
      }).html);
      inputs.on('click', function () {
        toggle.call(_this);
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    /**
     * function:
     * 1. Pause the animation.
     * 2. Increment the timepoint by 1.
     * 3. Allow the points to reach their destination at the new timepoint.
     */

    function step() {
      var _this = this;
      var container = this.controls.container.append('div').classed('fdg-control fdg-control--step', true);
      var inputs = container.append('div').classed("fdg-button fdg-input", true).attr('title', "Advance animation by one time unit.").text('Step');
      inputs.on('click', function () {
        // Pause simulation.
        if (_this.settings.playPause !== 'pause') toggle.call(_this);
        increment.call(_this, true);
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    /**
     * function:
     * 1. Pause the animation.
     * 2. Increment the timepoint by 1.
     * 3. Allow the points to reach their destination at the new timepoint.
     */

    function timepoint() {
      var _this = this;

      var fdg = this;
      var container = this.controls.container.append('div').classed('fdg-control fdg-control--timepoint', true);
      var inputs = container.append('div').classed("fdg-button fdg-input", true).append('input').attr('type', 'number').attr('title', "Choose a timepoint.").attr('value', +this.settings.timepoint).attr('min', 1).attr('max', this.settings.duration);
      inputs.on('click', function () {
        // Pause simulation.
        if (_this.settings.playPause !== 'pause') toggle.call(_this);
      });
      inputs.on('change', function () {
        // Pause simulation.
        if (fdg.settings.playPause !== 'pause') toggle.call(fdg);
        fdg.settings.timepoint = +this.value - 1;
        increment.call(fdg, true);
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function reset$1() {
      var _this = this;

      var container = this.controls.container.append('div').classed('fdg-control fdg-control--reset', true);
      var inputs = container.append('div').classed("fdg-button fdg-input", true).attr('title', "Reset animation.").html('&#x21ba;');
      inputs.on('click', function () {
        resetAnimation.call(_this);
        if (_this.settings.playPause !== 'play') toggle.call(_this);
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function eventList() {
      var _this = this;

      var fdg = this;
      var container = this.controls.container.append('div').classed('fdg-control fdg-control--event-list', true);
      var inputs = container.selectAll('div').data(this.metadata.event).enter().append('div').attr('class', function (d) {
        return "fdg-button ".concat(_this.settings.eventChangeCount.includes(d.value) ? 'current' : '');
      }).attr('title', function (d) {
        return "".concat(_this.settings.eventChangeCount.includes(d.value) ? 'Remove' : 'Add', " ").concat(d.value, " ").concat(_this.settings.eventChangeCount.includes(d.value) ? 'from' : 'to', " the list of events that control bubble ").concat(_this.settings.eventChangeCountAesthetic === 'both' ? 'color and size' : _this.settings.eventChangeCountAesthetic, ".");
      }).text(function (d) {
        return d.value;
      });
      inputs.on('click', function (d) {
        var _this2 = this;

        this.classList.toggle('current'); // Update event array.

        if (fdg.settings.eventChangeCount.includes(this.textContent)) fdg.settings.eventChangeCount.splice(fdg.settings.eventChangeCount.findIndex(function (event) {
          return event === _this2.textContent;
        }), 1);else fdg.settings.eventChangeCount.push(this.textContent); // Update tooltip.

        this.title = "".concat(fdg.settings.eventChangeCount.includes(d.value) ? 'Remove' : 'Add', " ").concat(d.value, " ").concat(fdg.settings.eventChangeCount.includes(d.value) ? 'from' : 'to', " the list of events that control bubble ").concat(fdg.settings.eventChangeCountAesthetic === 'both' ? 'color and size' : fdg.settings.eventChangeCountAesthetic, "."); // Update color-size toggle.

        fdg.controls.colorSizeToggle.inputs.attr('title', function (di) {
          return "Quantify the number of ".concat(fdg.util.csv(fdg.settings.eventChangeCount), " events by ").concat(di !== 'both' ? di : 'color and size', ".");
        }); // Update legend label.

        fdg.legends.container.classed('fdg-invisible', fdg.settings.eventChangeCount.length === 0).selectAll('span.fdg-measure').text(fdg.util.csv(fdg.settings.eventChangeCount));
        increment.call(fdg, false);
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function colorSizeToggle() {
      var _this = this;

      var fdg = this;
      var container = this.controls.container.append('div').classed('fdg-control fdg-control--color-size', true);
      var inputs = container.selectAll('div').data(['color', 'size', 'both']).enter().append('div').attr('class', function (d) {
        return "fdg-button ".concat(d, " ").concat(d === _this.settings.eventChangeCountAesthetic ? 'current' : '');
      }).attr('title', function (d) {
        return "Quantify the number of ".concat(fdg.util.csv(_this.settings.eventChangeCount), " events by ").concat(d !== 'both' ? d : 'color and size');
      }).text(function (d) {
        return d;
      });
      inputs.on('click', function (d) {
        inputs.classed('current', function (di) {
          return di === d;
        });
        fdg.settings.eventChangeCountAesthetic = d; // Update tooltips of event list toggles.

        fdg.controls.eventList.inputs.attr('title', function (d) {
          return "".concat(fdg.settings.eventChangeCount.includes(d.value) ? 'Remove' : 'Add', " ").concat(d.value, " ").concat(fdg.settings.eventChangeCount.includes(d.value) ? 'from' : 'to', " the list of events that control bubble ").concat(fdg.settings.eventChangeCountAesthetic === 'both' ? 'color and size' : fdg.settings.eventChangeCountAesthetic, ".");
        }); // Update legends.

        fdg.legends.container.selectAll('.fdg-legend').classed('fdg-hidden', function () {
          return !Array.from(this.classList).some(function (value) {
            return value.includes(d);
          });
        });
        increment.call(fdg, false);
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function addControls() {
      this.controls = {
        container: this.containers.controls
      };
      this.controls.speed = speed.call(this);
      this.controls.playPause = playPause$1.call(this);
      this.controls.step = step.call(this);
      this.controls.timepoint = timepoint.call(this);
      this.controls.reset = reset$1.call(this);

      if (this.settings.colorBy.type === 'frequency') {
        this.controls.eventList = eventList.call(this);
        this.controls.colorSizeToggle = colorSizeToggle.call(this);
      }

      this.controls.container.selectAll('.fdg-button').on('mousedown', function () {
        this.classList.toggle('clicked');
      }).on('mouseup', function () {
        this.classList.toggle('clicked');
      }).on('mouseout', function () {
        if (this.classList.contains('clicked')) this.classList.toggle('clicked');
      });
    }

    function ramp(color) {
      var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 256;
      //DOM.canvas(n, 1);
      var canvas = document.createElement('canvas');
      canvas.width = n;
      canvas.height = 1;
      var context = canvas.getContext('2d');

      for (var i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }

      return canvas;
    }

    function continuous() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          color = _ref.color,
          title = _ref.title,
          _ref$tickSize = _ref.tickSize,
          tickSize = _ref$tickSize === void 0 ? 6 : _ref$tickSize,
          _ref$width = _ref.width,
          width = _ref$width === void 0 ? 320 : _ref$width,
          _ref$height = _ref.height,
          height = _ref$height === void 0 ? 44 + tickSize : _ref$height,
          _ref$marginTop = _ref.marginTop,
          marginTop = _ref$marginTop === void 0 ? 18 : _ref$marginTop,
          _ref$marginRight = _ref.marginRight,
          marginRight = _ref$marginRight === void 0 ? 0 : _ref$marginRight,
          _ref$marginBottom = _ref.marginBottom,
          marginBottom = _ref$marginBottom === void 0 ? 16 + tickSize : _ref$marginBottom,
          _ref$marginLeft = _ref.marginLeft,
          marginLeft = _ref$marginLeft === void 0 ? 0 : _ref$marginLeft,
          _ref$ticks = _ref.ticks,
          ticks = _ref$ticks === void 0 ? width / 64 : _ref$ticks,
          tickFormat = _ref.tickFormat,
          tickValues = _ref.tickValues;

      var svg = d3.create('svg').attr('width', width).attr('height', height).attr('viewBox', [0, 0, width, height]).style('overflow', 'visible'); //.style('display', 'block');

      var tickAdjust = function tickAdjust(g) {
        return g.selectAll('.tick line').attr('y1', marginTop + marginBottom - height);
      };

      var x; // Continuous

      if (color.interpolate) {
        var n = Math.min(color.domain().length, color.range().length);
        x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
        svg.append('image').attr('x', marginLeft).attr('y', marginTop).attr('width', width - marginLeft - marginRight).attr('height', height - marginTop - marginBottom).attr('preserveAspectRatio', 'none').attr('xlink:href', ramp.call(this, color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
      } // Sequential
      else if (color.interpolator) {
          x = Object.assign(color.copy().interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
            range: function range() {
              return [marginLeft, width - marginRight];
            }
          });
          svg.append('image').attr('x', marginLeft).attr('y', marginTop).attr('width', width - marginLeft - marginRight).attr('height', height - marginTop - marginBottom).attr('preserveAspectRatio', 'none').attr('xlink:href', ramp.call(this, color.interpolator()).toDataURL()); // scaleSequentialQuantile doesn’t implement ticks or tickFormat.

          if (!x.ticks) {
            if (tickValues === undefined) {
              var _n = Math.round(ticks + 1);

              tickValues = d3.range(_n).map(function (i) {
                return d3.quantile(color.domain(), i / (_n - 1));
              });
            }

            if (typeof tickFormat !== 'function') {
              tickFormat = d3.format(tickFormat === undefined ? ',f' : tickFormat);
            }
          }
        } // Threshold
        else if (color.invertExtent) {
            var thresholds = color.thresholds ? color.thresholds() // scaleQuantize
            : color.quantiles ? color.quantiles() // scaleQuantile
            : color.domain(); // scaleThreshold

            var thresholdFormat = tickFormat === undefined ? function (d) {
              return d;
            } : typeof tickFormat === 'string' ? d3.format(tickFormat) : tickFormat;
            x = d3.scaleLinear().domain([-1, color.range().length - 1]).rangeRound([marginLeft, width - marginRight]);
            svg.append('g').selectAll('rect').data(color.range()).join('rect').attr('x', function (d, i) {
              return x(i - 1);
            }).attr('y', marginTop).attr('width', function (d, i) {
              return x(i) - x(i - 1);
            }).attr('height', height - marginTop - marginBottom).attr('fill', function (d) {
              return d;
            });
            tickValues = d3.range(thresholds.length);

            tickFormat = function tickFormat(i) {
              return thresholdFormat(thresholds[i], i);
            };
          } // Ordinal
          else {
              x = d3.scaleBand().domain(color.domain()).rangeRound([marginLeft, width - marginRight]);
              svg.append('g').selectAll('rect').data(color.domain()).join('rect').attr('x', x).attr('y', marginTop).attr('width', Math.max(0, x.bandwidth() - 1)).attr('height', height - marginTop - marginBottom).attr('fill', color);

              tickAdjust = function tickAdjust() {};
            }

      svg.append('g').attr('transform', "translate(0,".concat(height - marginBottom, ")")).call(d3.axisBottom(x).ticks(ticks, typeof tickFormat === 'string' ? tickFormat : undefined).tickFormat(typeof tickFormat === 'function' ? tickFormat : undefined).tickSize(tickSize).tickValues(tickValues)).call(tickAdjust).call(function (g) {
        return g.select('.domain').remove();
      }).call(function (g) {
        return g.append('text').classed('fdg-legend__label', true).attr('x', marginLeft).attr('y', marginTop + marginBottom - height - 6).attr('fill', 'currentColor').attr('text-anchor', 'middle').attr('transform', "translate(".concat(width / 2, ",0)")).attr('font-weight', 'bold').attr('font-size', '1.25rem').text(title);
      });
      return svg.node();
    }

    function color$1(svg, legendDimensions) {
      var _this = this;

      var marks = svg.selectAll('rect.legend-mark').data(this.settings.colors()).enter().append('rect').classed('legend-mark', true).attr('x', function (d, i) {
        return i * (legendDimensions[0] / _this.settings.colors().length);
      }).attr('y', 0).attr('width', legendDimensions[0] / this.settings.colors().length).attr('height', legendDimensions[1] / 3).attr('fill', function (d) {
        return d;
      }).attr('fill-opacity', 0.5).attr('stroke', function (d) {
        return d;
      }).attr('stroke-opacity', 1);
      return marks;
    }

    function size(svg, legendDimensions) {
      var _this = this;

      var marks = svg.selectAll('circle.legend-mark').data(this.settings.colors()).enter().append('circle').classed('legend-mark', true).attr('cx', function (d, i) {
        return i * (legendDimensions[0] / _this.settings.colors().length) + legendDimensions[0] / _this.settings.colors().length / 2;
      }).attr('cy', legendDimensions[1] / 4).attr('r', function (d, i) {
        return i + _this.settings.minRadius;
      }).attr('fill', '#aaa').attr('fill-opacity', 0.5).attr('stroke', '#aaa').attr('stroke-opacity', 1);
      return marks;
    }

    function both(svg, legendDimensions) {
      var _this = this;

      var marks = svg.selectAll('circle.legend-mark').data(this.settings.colors()).enter().append('circle').classed('legend-mark', true).attr('cx', function (d, i) {
        return i * (legendDimensions[0] / _this.settings.colors().length) + legendDimensions[0] / _this.settings.colors().length / 2;
      }).attr('cy', legendDimensions[1] / 4).attr('r', function (d, i) {
        return i + _this.settings.minRadius;
      }).attr('fill', function (d) {
        return d;
      }).attr('fill-opacity', 0.5).attr('stroke', function (d) {
        return d;
      }).attr('stroke-opacity', 1);
      return marks;
    }

    var makeLegendMarks = {
      color: color$1,
      size: size,
      both: both
    };

    function makeLegend(type) {
      var legendDimensions = [200, 50]; // container

      var container = this.legends.container.append('div').classed("fdg-legend fdg-legend--".concat(type), true).classed('fdg-hidden', this.settings.eventChangeCountAesthetic !== type || this.settings.eventChangeCount.length === 0); // label

      var label = container.append('div').classed('fdg-legend__label', true) //.style('width', legendDimensions[0] + 'px')
      .html("Number of <span class = \"fdg-measure\">".concat(this.util.csv(this.settings.eventChangeCount), "</span> events")); // svg

      var svg = container.append('svg').attr('width', legendDimensions[0]).attr('height', legendDimensions[1]).append('g'); // marks

      var marks = makeLegendMarks[type].call(this, svg, legendDimensions); // lower end of scale

      var lower = svg.append('text').attr('x', legendDimensions[0] / this.settings.colors().length / 2).attr('y', legendDimensions[1] / 2 + 16).attr('text-anchor', 'middle').text('0'); // upper end of scale

      var upper = svg.append('text').attr('x', legendDimensions[0] - legendDimensions[0] / this.settings.colors().length / 2).attr('y', legendDimensions[1] / 2 + 16).attr('text-anchor', 'middle').text("".concat(this.settings.colors().length - 1, "+"));
      return {
        container: container,
        label: label,
        svg: svg,
        marks: marks,
        lower: lower,
        upper: upper
      };
    }

    function addLegends() {
      var _this = this;

      this.legends = {
        container: this.containers.legends
      };

      if (this.settings.colorBy.type === 'continuous') {
        var container = this.legends.container.append('div').classed('fdg-legend fdg-legend--continuous', true);
        container.node().appendChild(continuous({
          color: this.colorScale,
          title: this.settings.colorBy.label,
          width: 200,
          height: 50,
          tickValues: [this.colorScale.domain()[0], (this.colorScale.domain()[1] - this.colorScale.domain()[0]) / 2, this.colorScale.domain()[1]]
        }));
      } else if (this.settings.colorBy.type === 'categorical') {
        var _container = this.legends.container.append('div').classed('fdg-legend fdg-legend--categorical', true);

        _container.append('div').classed('fdg-legend__label', true).text(this.settings.colorBy.label);

        var legendItems = _container.append('svg').attr('width', 200).attr('height', 20 * this.colorScale.domain().length).selectAll('g').data(this.colorScale.domain()).join('g');

        legendItems.append('circle').attr('cx', 20).attr('cy', function (d, i) {
          return i * 20 + 10;
        }).attr('r', 7).attr('fill', function (d) {
          return _this.colorScale(d);
        });
        legendItems.append('text').attr('font-size', '1rem').attr('x', 35).attr('y', function (d, i) {
          return i * 20 + 12;
        }).attr('alignment-baseline', 'middle').text(function (d) {
          return d;
        });
      } else if (this.settings.colorBy.type === 'frequency') {
        this.legends.color = makeLegend.call(this, 'color');
        this.legends.size = makeLegend.call(this, 'size');
        this.legends.both = makeLegend.call(this, 'both');
      }
    }

    function addFreqTable() {
      var freqTable = {
        container: this.containers.freqTable
      };
      freqTable.table = freqTable.container.append('table');
      freqTable.thead = freqTable.table.append('thead');
      freqTable.th = freqTable.thead.append('th').attr('colspan', 2).text('Cumulative Number of Events');
      freqTable.tbody = freqTable.table.append('tbody');
      freqTable.tr = freqTable.tbody.selectAll('tr').data(this.metadata.event.slice(1)).join('tr');
      freqTable.td = freqTable.tr.selectAll('td').data(function (event) {
        return [event.value, event.cumulative];
      }).join('td').text(function (d) {
        return typeof d === 'number' ? d3.format(',d')(d) : d;
      });
      return freqTable;
    }

    function addOrbits() {
      // TODO: replace instances of svg with svgForeground
      var g = this.containers.svgBackground.append('g').classed('fdg-g fdg-g--orbits', true);
      var shadows = g.append('defs').selectAll('filter').data(this.metadata.orbit).join('filter').attr('id', function (d, i) {
        return "orbit--".concat(i);
      });
      shadows.append('feDropShadow').attr('dx', 0).attr('dy', 0).attr('stdDeviation', 5).attr('flood-color', 'black');
      var orbits = g.selectAll('circle.orbit').data(this.metadata.orbit).enter().append('circle').classed('orbit', true).attr('cx', function (d) {
        return d.cx;
      }).attr('cy', function (d) {
        return d.cy;
      }).attr('r', function (d) {
        return d.r;
      }).attr('fill', 'none').attr('stroke', '#aaa').attr('stroke-width', '.5').style('filter', function (d, i) {
        return "url(#orbit--".concat(i, ")");
      });
      if (this.settings.translate) orbits.attr('transform', "translate(-".concat(this.settings.width / 2 - 100, ",-").concat(this.settings.height / 2 - 100, ")"));
      return orbits;
    }

    function annotateFoci() {
      var _this = this;
      var g = this.containers.svgForeground.append('g').classed('fdg-g fdg-g--focus-annotations', true);
      var fociLabels = g.selectAll('g.fdg-focus-annotation').data(this.metadata.event).join('g').classed('fdg-focus-annotation', true);
      if (this.settings.translate) fociLabels.attr('transform', "translate(-".concat(this.settings.width / 2 - 100, ",-").concat(this.settings.height / 2 - 100, ")")); // defs - give the text a background
      //const filters = fociLabels
      //    .append('defs')
      //    .classed('fdg-focus-annotation__defs', true)
      //        .append('filter')
      //        .classed('fdg-focus-annotation__filter', true)
      //        .attr('id', d => `fdg-focus-annotation__${d.value.toLowerCase().replace(/ /g, '-')}`)
      //        .attr('x', 0)
      //        .attr('y', 0)
      //        .attr('width', 1)
      //        .attr('height', 1);
      //filters.append('feFlood').attr('flood-color', '#aaaaaaaa');
      //filters.append('feComposite').attr('in', 'SourceGraphic').attr('operator', 'xor');
      // text

      var isCenterX = function isCenterX(d) {
        return Math.round(d.x) === Math.round(_this.settings.orbitRadius / 2);
      };

      var isLessThanCenterX = function isLessThanCenterX(d) {
        return d.order === 1 || Math.round(d.x) < Math.round(_this.settings.width / 2);
      };

      var getX = function getX(d) {
        return isCenterX(d) ? d.x : d.x - Math.pow(-1, isLessThanCenterX(d)) * 10;
      };

      var getTextAnchor = function getTextAnchor(d) {
        return isCenterX(d) ? 'middle' : isLessThanCenterX(d) ? 'start' : 'end';
      };

      var isCenterY = function isCenterY(d) {
        return Math.round(d.y) === Math.round(_this.settings.height / 2);
      };

      var isLessThanCenterY = function isLessThanCenterY(d) {
        return Math.round(d.y) < Math.round(_this.settings.height / 2);
      };

      var getY = function getY(d) {
        return isCenterY(d) ? d.y : d.y + Math.pow(-1, isLessThanCenterY(d)) * 35;
      };

      var textBackground = fociLabels.append('text').classed('fdg-focus-annotation__text', true).attr('x', function (d) {
        return getX(d);
      }).attr('y', function (d) {
        return getY(d);
      }); //.attr('filter', d => `url(#fdg-focus-annotation__${d.value.toLowerCase().replace(/ /g, '-')})`);

      textBackground.append('tspan').classed('fdg-focus-annotation__label', true).attr('x', function (d) {
        return getX(d);
      }).attr('text-anchor', function (d) {
        return getTextAnchor(d);
      }) //.attr('alignment-baseline', d => getAlignmentBaseline(d))
      .style('font-weight', 'bold').style('font-size', '20px').attr('stroke', 'white').attr('stroke-width', '4px').text(function (d) {
        return d.value;
      });
      textBackground.append('tspan').classed('fdg-focus-annotation__event-count', true).classed('fdg-hidden', this.settings.eventCount === false).attr('x', function (d) {
        return getX(d);
      }).attr('text-anchor', function (d) {
        return getTextAnchor(d);
      }) //.attr('alignment-baseline', d => getAlignmentBaseline(d))
      .attr('dy', '1.3em').style('font-weight', 'bold').attr('stroke', 'white').attr('stroke-width', '4px'); //.text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);

      var textForeground = fociLabels.append('text').classed('fdg-focus-annotation__text', true).attr('x', function (d) {
        return getX(d);
      }).attr('y', function (d) {
        return getY(d);
      }); //.attr('filter', d => `url(#fdg-focus-annotation__${d.value.toLowerCase().replace(/ /g, '-')})`);

      textForeground.append('tspan').classed('fdg-focus-annotation__label', true).attr('x', function (d) {
        return getX(d);
      }).attr('text-anchor', function (d) {
        return getTextAnchor(d);
      }) //.attr('alignment-baseline', d => getAlignmentBaseline(d))
      .style('font-weight', 'bold').style('font-size', '20px').attr('fill', 'black').text(function (d) {
        return d.value;
      });
      textForeground.append('tspan').classed('fdg-focus-annotation__event-count', true).classed('fdg-hidden', this.settings.eventCount === false).attr('x', function (d) {
        return getX(d);
      }).attr('text-anchor', function (d) {
        return getTextAnchor(d);
      }) //.attr('alignment-baseline', d => getAlignmentBaseline(d))
      .attr('dy', '1.3em').style('font-weight', 'bold').attr('fill', 'black'); //.text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);

      return fociLabels;
    }

    //import addExplanation from './layout/addExplanation';
    function dataDrivenLayout() {
      // controls
      addControls.call(this); // sidebar

      this.containers.timer.text("".concat(this.settings.timepoint, " ").concat(this.settings.timeUnit));
      addLegends.call(this);
      this.freqTable = addFreqTable.call(this); // Draw concentric circles.

      this.orbits = addOrbits.call(this); // Annotate foci.

      this.focusAnnotations = annotateFoci.call(this);
    }

    function hasVariables() {
      var has = {};

      var _iterator = _createForOfIteratorHelper(Object.keys(this.settings).filter(function (key) {
        return /_var$/.test(key);
      })),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var setting = _step.value;
          var variable = setting.replace(/_var$/, '');
          has[variable] = this.data[0].hasOwnProperty(this.settings[setting]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return has;
    }

    function mapVariables() {
      var _this = this;

      this.data.forEach(function (d) {
        var _iterator = _createForOfIteratorHelper(Object.keys(_this.settings).filter(function (key) {
          return /_var$/.test(key);
        })),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var setting = _step.value;
            var variable = setting.replace(/_var$/, '');
            d[variable] = ['event_order', 'start_timepoint', 'end_timepoint', 'duration', 'sequence'].includes(variable) ? +d[_this.settings[setting]] : d[_this.settings[setting]];
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
    }

    function addVariables(has) {
      d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (group) {
        group.forEach(function (d, i) {
          // Define start and end timepoints when only duration exists.
          if (has.duration && !has.start_timepoint) {
            if (i === 0) {
              d.start_timepoint = 1;
              d.end_timepoint = d.duration;
            } else {
              d.start_timepoint = group[i - 1].end_timepoint + 1;
              d.end_timepoint = d.start_timepoint + d.duration - 1;
            }
          } // Define end timepoint when only start timepoint exists.


          if (has.start_timepoint && !has.end_timepoint) {
            d.end_timepoint = i < group.length - 1 ? group[i + 1].start_timepoint - 1 : d.duration ? d.start_timepoint + d.duration - 1 : d.start_timepoint;
          } // Define duration when only timepoints exist.


          if (!has.duration && has.start_timepoint && has.end_timepoint) {
            d.duration = d.start_timepoint - d.end_timepoint + 1;
          }
        }); // Define sequence

        if (!has.sequence) {
          group.sort(function (a, b) {
            return a.start_timepoint - b.start_timepoint;
          }).forEach(function (d, i) {
            d.seq = i;
          });
        } else {
          group.sort(function (a, b) {
            return a.seq - b.seq;
          });
        }
      }).entries(this.data);
    }

    function sort() {
      var numericId = this.data.every(function (d) {
        return /^-?\d+\.?\d*$/.test(d.id) || /^-?\d*\.?\d+$/.test(d.id);
      });
      this.data.sort(function (a, b) {
        var id_diff = numericId ? +a.id - +b.id : a.id < b.id ? -1 : b.id < a.id ? 1 : 0;
        var seq_diff = a.seq - b.seq;
        return id_diff || seq_diff;
      });
    }

    function mutateData() {
      // Check for existence of variables.
      var has = hasVariables.call(this); // Apply data mappings.

      mapVariables.call(this); // Define duration, sequence, and/or start and end timepoints.

      addVariables.call(this, has); // Sort data by id and sequence.

      sort.call(this);
    }

    function nestData() {
      var _this = this;

      var nestedData = d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (group) {
        var duration = d3.sum(group, function (d) {
          return d.duration;
        }); // Initial state for the given individual.

        var statePrevious = null;
        var state = getState.call(_this, group, 0);
        var noStateChange = group.length === 1 && state.event === _this.settings.eventCentral; // Count number of state changes, define aesthetic, define radius, and define color.

        var datum = defineDatum.call(_this, group, state, statePrevious);
        return _objectSpread2({
          group: group,
          // array of data representing all records for an individual
          duration: d3.sum(group, function (d) {
            return d.duration;
          }),
          // full duration of individual in data
          statePrevious: statePrevious,
          state: state,
          // object representing a single record of an individual
          noStateChange: noStateChange
        }, datum);
      }).entries(this.data);
      return nestedData;
    }

    function dataManipulation() {
      var _this = this;

      mutateData.call(this);
      this.data.nested = nestData.call(this);
      this.metadata.event.forEach(function (event) {
        event.data = _this.data.nested.filter(function (d) {
          return d.value.state.event === event.value;
        });
      });
    }

    function constant(x) {
      return function() {
        return x;
      };
    }

    function tree_add(d) {
      var x = +this._x.call(null, d),
          y = +this._y.call(null, d);
      return add(this.cover(x, y), x, y, d);
    }

    function add(tree, x, y, d) {
      if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

      var parent,
          node = tree._root,
          leaf = {data: d},
          x0 = tree._x0,
          y0 = tree._y0,
          x1 = tree._x1,
          y1 = tree._y1,
          xm,
          ym,
          xp,
          yp,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return tree._root = leaf, tree;

      // Find the existing leaf for the new point, or add it.
      while (node.length) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
      }

      // Is the new point is exactly coincident with the existing point?
      xp = +tree._x.call(null, node.data);
      yp = +tree._y.call(null, node.data);
      if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

      // Otherwise, split the leaf node until the old and new point are separated.
      do {
        parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
      return parent[j] = node, parent[i] = leaf, tree;
    }

    function addAll(data) {
      var d, i, n = data.length,
          x,
          y,
          xz = new Array(n),
          yz = new Array(n),
          x0 = Infinity,
          y0 = Infinity,
          x1 = -Infinity,
          y1 = -Infinity;

      // Compute the points and their extent.
      for (i = 0; i < n; ++i) {
        if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
        xz[i] = x;
        yz[i] = y;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }

      // If there were no (valid) points, abort.
      if (x0 > x1 || y0 > y1) return this;

      // Expand the tree to cover the new points.
      this.cover(x0, y0).cover(x1, y1);

      // Add the new points.
      for (i = 0; i < n; ++i) {
        add(this, xz[i], yz[i], data[i]);
      }

      return this;
    }

    function tree_cover(x, y) {
      if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

      var x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1;

      // If the quadtree has no extent, initialize them.
      // Integer extent are necessary so that if we later double the extent,
      // the existing quadrant boundaries don’t change due to floating point error!
      if (isNaN(x0)) {
        x1 = (x0 = Math.floor(x)) + 1;
        y1 = (y0 = Math.floor(y)) + 1;
      }

      // Otherwise, double repeatedly to cover.
      else {
        var z = x1 - x0,
            node = this._root,
            parent,
            i;

        while (x0 > x || x >= x1 || y0 > y || y >= y1) {
          i = (y < y0) << 1 | (x < x0);
          parent = new Array(4), parent[i] = node, node = parent, z *= 2;
          switch (i) {
            case 0: x1 = x0 + z, y1 = y0 + z; break;
            case 1: x0 = x1 - z, y1 = y0 + z; break;
            case 2: x1 = x0 + z, y0 = y1 - z; break;
            case 3: x0 = x1 - z, y0 = y1 - z; break;
          }
        }

        if (this._root && this._root.length) this._root = node;
      }

      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      return this;
    }

    function tree_data() {
      var data = [];
      this.visit(function(node) {
        if (!node.length) do data.push(node.data); while (node = node.next)
      });
      return data;
    }

    function tree_extent(_) {
      return arguments.length
          ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
          : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
    }

    function Quad(node, x0, y0, x1, y1) {
      this.node = node;
      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
    }

    function tree_find(x, y, radius) {
      var data,
          x0 = this._x0,
          y0 = this._y0,
          x1,
          y1,
          x2,
          y2,
          x3 = this._x1,
          y3 = this._y1,
          quads = [],
          node = this._root,
          q,
          i;

      if (node) quads.push(new Quad(node, x0, y0, x3, y3));
      if (radius == null) radius = Infinity;
      else {
        x0 = x - radius, y0 = y - radius;
        x3 = x + radius, y3 = y + radius;
        radius *= radius;
      }

      while (q = quads.pop()) {

        // Stop searching if this quadrant can’t contain a closer node.
        if (!(node = q.node)
            || (x1 = q.x0) > x3
            || (y1 = q.y0) > y3
            || (x2 = q.x1) < x0
            || (y2 = q.y1) < y0) continue;

        // Bisect the current quadrant.
        if (node.length) {
          var xm = (x1 + x2) / 2,
              ym = (y1 + y2) / 2;

          quads.push(
            new Quad(node[3], xm, ym, x2, y2),
            new Quad(node[2], x1, ym, xm, y2),
            new Quad(node[1], xm, y1, x2, ym),
            new Quad(node[0], x1, y1, xm, ym)
          );

          // Visit the closest quadrant first.
          if (i = (y >= ym) << 1 | (x >= xm)) {
            q = quads[quads.length - 1];
            quads[quads.length - 1] = quads[quads.length - 1 - i];
            quads[quads.length - 1 - i] = q;
          }
        }

        // Visit this point. (Visiting coincident points isn’t necessary!)
        else {
          var dx = x - +this._x.call(null, node.data),
              dy = y - +this._y.call(null, node.data),
              d2 = dx * dx + dy * dy;
          if (d2 < radius) {
            var d = Math.sqrt(radius = d2);
            x0 = x - d, y0 = y - d;
            x3 = x + d, y3 = y + d;
            data = node.data;
          }
        }
      }

      return data;
    }

    function tree_remove(d) {
      if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

      var parent,
          node = this._root,
          retainer,
          previous,
          next,
          x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1,
          x,
          y,
          xm,
          ym,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return this;

      // Find the leaf node for the point.
      // While descending, also retain the deepest parent with a non-removed sibling.
      if (node.length) while (true) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
        if (!node.length) break;
        if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
      }

      // Find the point to remove.
      while (node.data !== d) if (!(previous = node, node = node.next)) return this;
      if (next = node.next) delete node.next;

      // If there are multiple coincident points, remove just the point.
      if (previous) return (next ? previous.next = next : delete previous.next), this;

      // If this is the root point, remove it.
      if (!parent) return this._root = next, this;

      // Remove this leaf.
      next ? parent[i] = next : delete parent[i];

      // If the parent now contains exactly one leaf, collapse superfluous parents.
      if ((node = parent[0] || parent[1] || parent[2] || parent[3])
          && node === (parent[3] || parent[2] || parent[1] || parent[0])
          && !node.length) {
        if (retainer) retainer[j] = node;
        else this._root = node;
      }

      return this;
    }

    function removeAll(data) {
      for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
      return this;
    }

    function tree_root() {
      return this._root;
    }

    function tree_size() {
      var size = 0;
      this.visit(function(node) {
        if (!node.length) do ++size; while (node = node.next)
      });
      return size;
    }

    function tree_visit(callback) {
      var quads = [], q, node = this._root, child, x0, y0, x1, y1;
      if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
          var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        }
      }
      return this;
    }

    function tree_visitAfter(callback) {
      var quads = [], next = [], q;
      if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        var node = q.node;
        if (node.length) {
          var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        }
        next.push(q);
      }
      while (q = next.pop()) {
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
      }
      return this;
    }

    function defaultX(d) {
      return d[0];
    }

    function tree_x(_) {
      return arguments.length ? (this._x = _, this) : this._x;
    }

    function defaultY(d) {
      return d[1];
    }

    function tree_y(_) {
      return arguments.length ? (this._y = _, this) : this._y;
    }

    function quadtree(nodes, x, y) {
      var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
      return nodes == null ? tree : tree.addAll(nodes);
    }

    function Quadtree(x, y, x0, y0, x1, y1) {
      this._x = x;
      this._y = y;
      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      this._root = undefined;
    }

    function leaf_copy(leaf) {
      var copy = {data: leaf.data}, next = copy;
      while (leaf = leaf.next) next = next.next = {data: leaf.data};
      return copy;
    }

    var treeProto = quadtree.prototype = Quadtree.prototype;

    treeProto.copy = function() {
      var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
          node = this._root,
          nodes,
          child;

      if (!node) return copy;

      if (!node.length) return copy._root = leaf_copy(node), copy;

      nodes = [{source: node, target: copy._root = new Array(4)}];
      while (node = nodes.pop()) {
        for (var i = 0; i < 4; ++i) {
          if (child = node.source[i]) {
            if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
            else node.target[i] = leaf_copy(child);
          }
        }
      }

      return copy;
    };

    treeProto.add = tree_add;
    treeProto.addAll = addAll;
    treeProto.cover = tree_cover;
    treeProto.data = tree_data;
    treeProto.extent = tree_extent;
    treeProto.find = tree_find;
    treeProto.remove = tree_remove;
    treeProto.removeAll = removeAll;
    treeProto.root = tree_root;
    treeProto.size = tree_size;
    treeProto.visit = tree_visit;
    treeProto.visitAfter = tree_visitAfter;
    treeProto.x = tree_x;
    treeProto.y = tree_y;

    function forceManyBodyReuse() {
      var nodes,
          node,
          alpha,
          iter = 0,
          tree,
          updateClosure,
          updateBH,
          strength = constant(-30),
          strengths,
          distanceMin2 = 1,
          distanceMax2 = Infinity,
          theta2 = 0.81;

      function jiggle() {
        return (Math.random() - 0.5) * 1e-6;
      }

      function x(d) {
        return d.x;
      }

      function y(d) {
        return d.y;
      }

      updateClosure = function () {
        return function (i) {
          if (i % 13 === 0) {
            return true;
          } else {
            return false;
          }
        };
      };

      function force(_) {
        var i, n = nodes.length;
        if (!tree || updateBH(iter, nodes)) {
          tree = quadtree(nodes, x, y).visitAfter(accumulate);
          nodes.update.push(iter);
        }
        for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
        ++iter;
      }

      function initialize() {
        if (!nodes) return;
        iter = 0;
        nodes.update = [];
        updateBH = updateClosure();
        tree = null;
        var i, n = nodes.length, node;
        strengths = new Array(n);
        for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
      }

      function accumulate(quad) {
        var strength = 0, q, c, weight = 0, x, y, i;

        // For internal nodes, accumulate forces from child quadrants.
        if (quad.length) {
          for (x = y = i = 0; i < 4; ++i) {
            if ((q = quad[i]) && (c = Math.abs(q.value))) {
              strength += q.value, weight += c, x += c * q.x, y += c * q.y;
            }
          }
          quad.x = x / weight;
          quad.y = y / weight;
        }

        // For leaf nodes, accumulate forces from coincident quadrants.
        else {
          q = quad;
          q.x = q.data.x;
          q.y = q.data.y;
          do strength += strengths[q.data.index];
          while (q = q.next);
        }

        quad.value = strength;
      }

      function apply(quad, x1, _, x2) {
        if (!quad.value) return true;

        var x = quad.x - node.x,
            y = quad.y - node.y,
            w = x2 - x1,
            l = x * x + y * y;

        // Apply the Barnes-Hut approximation if possible.
        // Limit forces for very close nodes; randomize direction if coincident.
        if (w * w / theta2 < l) {
          if (l < distanceMax2) {
            if (x === 0) x = jiggle(), l += x * x;
            if (y === 0) y = jiggle(), l += y * y;
            if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
            node.vx += x * quad.value * alpha / l;
            node.vy += y * quad.value * alpha / l;
          }
          return true;
        }

        // Otherwise, process points directly.
        else if (quad.length || l >= distanceMax2) return;

        // Limit forces for very close nodes; randomize direction if coincident.
        if (quad.data !== node || quad.next) {
          if (x === 0) x = jiggle(), l += x * x;
          if (y === 0) y = jiggle(), l += y * y;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        }

        do if (quad.data !== node) {
          // Use the coordinates of the node and not the quad region.
          x = quad.data.x - node.x;
          y = quad.data.y - node.y;
          l = x * x + y * y;

          // Limit forces for very close nodes; randomize direction if coincident.
          if (x === 0) x = jiggle(), l += x * x;
          if (y === 0) y = jiggle(), l += y * y;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);

          w = strengths[quad.data.index] * alpha / l;

          node.vx += x * w;
          node.vy += y * w;
        } while (quad = quad.next);
      }

      force.initialize = function(_) {
        nodes = _;
        initialize();
      };

      force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
      };

      force.distanceMin = function(_) {
        return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
      };

      force.distanceMax = function(_) {
        return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
      };

      force.theta = function(_) {
        return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
      };

      force.update = function(_) {
        return arguments.length ? (updateClosure = _, updateBH = updateClosure(), force) : updateClosure;
      };

      return force;
    }

    function tick(event) {
      var _this = this;

      this.containers.canvas.context.clearRect(0, 0, this.settings.width, this.settings.height);
      this.containers.canvas.context.save();
      this.data.nested.sort(function (a, b) {
        return a.value.stateChanges - b.value.stateChanges;
      }) // draw bubbles with more state changes last
      .forEach(function (d, i) {
        _this.containers.canvas.context.beginPath(); // circle
        //if (this.settings.shape === 'circle') {
        //if (i % 2) {


        _this.containers.canvas.context.moveTo(d.x + d.r, d.y);

        _this.containers.canvas.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);

        if (_this.settings.fill) {
          _this.containers.canvas.context.fillStyle = d.value.fill;

          _this.containers.canvas.context.fill();
        }

        _this.containers.canvas.context.strokeStyle = d.value.stroke;

        _this.containers.canvas.context.stroke(); //}
        // square
        //else {
        //    //this.containers.canvas.context.moveTo(d.x + d.r, d.y);
        //    this.containers.canvas.context.rect(
        //        d.x - d.value.r,
        //        d.y - d.value.r,
        //        d.value.r * 2,
        //        d.value.r * 2
        //    );
        //    if (this.settings.fill) {
        //        this.containers.canvas.context.fillStyle = d.value.fill;
        //        this.containers.canvas.context.fill();
        //    }
        //    this.containers.canvas.context.strokeStyle = d.value.stroke;
        //    this.containers.canvas.context.stroke();
        //}

      });
      this.containers.canvas.context.restore();
    }

    function addForceSimulation(event) {
      // When using D3’s force layout with a disjoint graph, you typically want the positioning
      // forces (d3.forceX and d3.forceY) instead of the centering force (d3.forceCenter). The
      // positioning forces, unlike the centering force, prevent detached subgraphs from escaping
      // the viewport.
      //
      // https://observablehq.com/@d3/disjoint-force-directed-graph?collection=@d3/d3-force
      var forceSimulation = d3.forceSimulation().nodes(event.data.filter(function (d) {
        return !d.value.noStateChange;
      })).alphaDecay(0.01) //.alphaMin(.75)
      //.alphaTarget(.8)
      .velocityDecay(0.9).force('center', d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2)).force('x', d3.forceX(event.x).strength(0.3)).force('y', d3.forceY(event.y).strength(0.3)).force('charge', forceManyBodyReuse().strength(this.settings.chargeStrength)) //.force('charge', d3.forceManyBodySampled().strength(this.settings.chargeStrength))
      .on('tick', tick.bind(this, event)); //if (event.value !== this.settings.eventCentral)

      forceSimulation.force('collide', //d3.forceCollide().radius((d) => d.value.r + 0.5)
      d3.forceCollide().radius(this.settings.minRadius + 1));
      return forceSimulation;
    }

    function circular(data) {
      var simulation = d3.forceSimulation().nodes(data).force('center', d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2)).force('x', d3.forceX(this.settings.orbitRadius / 2).strength(0.3)).force('y', d3.forceY(this.settings.height / 2).strength(0.3)).force('charge', forceManyBodyReuse().strength(this.settings.chargeStrength)).force('collide', d3.forceCollide().radius(this.settings.minRadius + 0.5)).stop();

      for (var i = 0; i < 300; i++) {
        simulation.tick();
      }

      var g = this.containers.svgBackground.insert('g', ':first-child'); //.attr('transform', `translate(${this.settings.orbitRadius/2},${this.settings.height/2})`);

      g.append('text').attr('x', 0).attr('y', -this.settings.orbitRadius / 2).attr('dy', -36).attr('text-anchor', 'middle').text('No state changes');
      g.append('text').attr('x', 0).attr('y', -this.settings.orbitRadius / 2).attr('dy', -16).attr('text-anchor', 'middle').text("".concat(data.length, " (").concat(d3.format('.1%')(data.length / this.data.nested.length), ")"));
      var nodes = g.selectAll('circle').data(data).enter().append('circle').attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      }).attr('r', this.settings.minRadius).attr('fill', this.settings.color(0)).attr('fill-opacity', .25);
    }

    function addStaticForceSimulation() {
      var noStateChange = this.data.nested.filter(function (d) {
        return d.value.noStateChange;
      }).map(function (d) {
        return {
          key: d.key
        };
      });

      if (noStateChange.length) {
        //radial.call(this, noStateChange);
        circular.call(this, noStateChange);
      }
    }

    function init() {
      var _this = this;

      runModal.call(this);
      addStaticForceSimulation.call(this);
      this.metadata.event.forEach(function (event) {
        event.forceSimulation = addForceSimulation.call(_this, event);
      });
      if (this.settings.playPause === 'play') this.interval = startInterval.call(this);
    }

    function forceDirectedGraph(data) {
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
      var settings$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fdg = {
        data: data,
        element: element,
        settings: Object.assign(settings, settings$1),
        util: util
      };
      fdg.settings.text = [].concat(fdg.settings.explanation).concat(fdg.settings.information).filter(function (text) {
        return typeof text === 'string';
      });
      fdg.containers = layout.call(fdg); // add elements to DOM

      fdg.metadata = defineMetadata.call(fdg); // calculate characteristics of variables in data

      dataDrivenLayout.call(fdg); // update the DOM

      dataManipulation.call(fdg); // mutate and structure data

      init.call(fdg); // run the simulation

      return fdg;
    }

    return forceDirectedGraph;

})));
