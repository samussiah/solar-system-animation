(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.forceDirectedGraph = factory());
}(this, (function () { 'use strict';

    if (typeof Object.assign != 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {

          if (target == null) {
            // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
          }

          var to = Object(target);

          for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) {
              // Skip over if undefined or null
              for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }

          return to;
        },
        writable: true,
        configurable: true
      });
    }

    if (!Array.prototype.includes) {
      Object.defineProperty(Array.prototype, 'includes', {
        value: function value(valueToFind, fromIndex) {
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          } // 1. Let O be ? ToObject(this value).


          var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

          var len = o.length >>> 0; // 3. If len is 0, return false.

          if (len === 0) {
            return false;
          } // 4. Let n be ? ToInteger(fromIndex).
          //        (If fromIndex is undefined, this step produces the value 0.)


          var n = fromIndex | 0; // 5. If n = 0, then
          //    a. Let k be n.
          // 6. Else n < 0,
          //    a. Let k be len + n.
          //    b. If k < 0, let k be 0.

          var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

          function sameValueZero(x, y) {
            return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
          } // 7. Repeat, while k < len


          while (k < len) {
            // a. Let elementK be the result of ? Get(O, ! ToString(k)).
            // b. If SameValueZero(valueToFind, elementK) is true, return true.
            if (sameValueZero(o[k], valueToFind)) {
              return true;
            } // c. Increase k by 1.


            k++;
          } // 8. Return false


          return false;
        }
      });
    }

    if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
        value: function value(predicate) {
          // 1. Let O be ? ToObject(this value).
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }

          var o = Object(this); // 2. Let len be ? ToLength(? Get(O, 'length')).

          var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


          var thisArg = arguments[1]; // 5. Let k be 0.

          var k = 0; // 6. Repeat, while k < len

          while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            var kValue = o[k];

            if (predicate.call(thisArg, kValue, k, o)) {
              return kValue;
            } // e. Increase k by 1.


            k++;
          } // 7. Return undefined.


          return undefined;
        }
      });
    }

    if (!Array.prototype.findIndex) {
      Object.defineProperty(Array.prototype, 'findIndex', {
        value: function value(predicate) {
          // 1. Let O be ? ToObject(this value).
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }

          var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

          var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


          var thisArg = arguments[1]; // 5. Let k be 0.

          var k = 0; // 6. Repeat, while k < len

          while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return k.
            var kValue = o[k];

            if (predicate.call(thisArg, kValue, k, o)) {
              return k;
            } // e. Increase k by 1.


            k++;
          } // 7. Return -1.


          return -1;
        }
      });
    }

    if (!Object.values) {
      Object.values = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array

        while (i--) {
          resArray[i] = obj[ownProps[i]];
        }

        return resArray;
      };
    }

    if (!Object.entries) {
      Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array

        while (i--) {
          resArray[i] = [ownProps[i], obj[ownProps[i]]];
        }

        return resArray;
      };
    }

    function addElement(name, parent) {
      var tagName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'div';
      var element = parent.append(tagName).classed("fdg-".concat(tagName), true).classed("fdg-".concat(name), true).classed("fdg-".concat(tagName, "--").concat(name), true);
      return element;
    }

    // Returns a tween for a transition’s "d" attribute, transitioning any selected
    // arcs from their current angle to the specified new angle.
    function arcTween(newAngle, arc) {
      // The function passed to attrTween is invoked for each selected element when
      // the transition starts, and for each element returns the interpolator to use
      // over the course of transition. This function is thus responsible for
      // determining the starting angle of the transition (which is pulled from the
      // element’s bound datum, d.endAngle), and the ending angle (simply the
      // newAngle argument to the enclosing function).
      return function (d) {
        // To interpolate between the two angles, we use the default d3.interpolate.
        // (Internally, this maps to d3.interpolateNumber, since both of the
        // arguments to d3.interpolate are numbers.) The returned function takes a
        // single argument t and returns a number between the starting angle and the
        // ending angle. When t = 0, it returns d.endAngle; when t = 1, it returns
        // newAngle; and for 0 < t < 1 it returns an angle in-between.
        var interpolate = d3.interpolate(d.endAngle, newAngle); // The return value of the attrTween is also a function: the function that
        // we want to run for each tick of the transition. Because we used
        // attrTween("d"), the return value of this last function will be set to the
        // "d" attribute at every tick. (It’s also possible to use transition.tween
        // to run arbitrary code for every tick, say if you want to set multiple
        // attributes from a single function.) The argument t ranges from 0, at the
        // start of the transition, to 1, at the end.

        return function (t) {
          // Calculate the current arc angle based on the transition time, t. Since
          // the t for the transition and the t for the interpolate both range from
          // 0 to 1, we can pass t directly to the interpolator.
          //
          // Note that the interpolated angle is written into the element’s bound
          // data object! This is important: it means that if the transition were
          // interrupted, the data bound to the element would still be consistent
          // with its appearance. Whenever we start a new arc transition, the
          // correct starting angle can be inferred from the data.
          d.endAngle = interpolate(t); // Lastly, compute the arc path given the updated data! In effect, this
          // transition uses data-space interpolation: the data is interpolated
          // (that is, the end angle) rather than the path string itself.
          // Interpolating the angles in polar coordinates, rather than the raw path
          // string, produces valid intermediate arcs during the transition.

          return arc(d);
        };
      };
    }

    function csv(array) {
      var and = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var csv = array.join(', ');
      if (and) csv = csv.replace(/, ([^,]*)$/, ' and $1');
      return csv;
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

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

    /**
     * Performs a deep merge of objects and returns new object. Does not modify
     * objects (immutable) and merges arrays via concatenation.
     *
     * @param {...object} objects - Objects to merge
     * @returns {object} New object with merged key/values
     */
    function mergeDeep() {
      var isObject = function isObject(obj) {
        return obj && _typeof(obj) === 'object';
      };

      for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
        objects[_key] = arguments[_key];
      }

      return objects.reduce(function (prev, obj) {
        Object.keys(obj).forEach(function (key) {
          var pVal = prev[key];
          var oVal = obj[key];

          if (Array.isArray(pVal) && Array.isArray(oVal)) {
            prev[key] = oVal; //pVal.concat(...oVal);
          } else if (isObject(pVal) && isObject(oVal)) {
            prev[key] = mergeDeep(pVal, oVal);
          } else {
            prev[key] = oVal;
          }
        });
        return prev;
      }, {});
    }

    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            fontStyle = text.style('font-size'),
            fontSize = parseFloat(fontStyle),
            fontUnit = fontStyle.replace(fontSize, ''),
            x = text.attr('x'),
            y = text.attr('y'),
            dy = parseFloat(text.attr('dy')),
            tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'rem');

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));

          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * fontSize + dy + fontUnit).text(word);
          }
        }
      });
    }

    var util = {
      addElement: addElement,
      arcTween: arcTween,
      csv: csv,
      mergeDeep: mergeDeep,
      wrap: wrap
    };

    function dataMapping() {
      return {
        id_var: 'id',
        event_var: 'event',
        event_order_var: 'event_order',
        // zero-indexed orbit
        event_position_var: 'event_position',
        // angle of event focus on orbit
        start_timepoint_var: 'stdy',
        end_timepoint_var: 'endy',
        duration_var: 'duration'
      };
    }

    function color() {
      return {
        colorBy: {
          type: 'frequency',
          // ['frequency', 'continuous', 'categorical']
          variable: null,
          label: null,
          mirror: true,
          // reverse color scheme?
          stratify: true,
          // present categories separately at each focus?
          colorScheme: 'RdYlGn',
          colorSchemes: ['blue', 'orange', 'red', 'purple', 'green', 'grey'],
          // must be one of D3's sequential, single-hue color schemes: https://github.com/d3/d3-scale-chromatic#sequential-single-hue
          nColors: 6 // min: 3, max: 9

        },
        color: 'rgb(170,170,170)',
        fill: null // boolean - defined in ./defineMetadata/defineIdDependentSettings

      };
    }

    function size() {
      return {
        sizeBy: {
          type: 'frequency',
          // ['frequency', 'continuous']
          variable: null,
          label: null
        },
        minRadius: null,
        // defined in ./defineMetadata/updateIdDependentSettings
        maxRadius: 10,
        // defined in ./defineMetadata/updateIdDependentSettings
        staticRadius: null // defined in ./defineMetadata/updateIdDependentSettings

      };
    }

    function shape() {
      return {
        shapeBy: {
          type: 'categorical',
          // ['categorical']
          variable: null,
          label: null,
          shapes: ['circle', 'square', 'triangle', 'diamond', 'star', 'triangleDown']
        },
        shape: 'circle' // string - default shape

      };
    }

    function aesthetics() {
      return _objectSpread2(_objectSpread2(_objectSpread2({}, color()), size()), shape());
    }

    function freqTable() {
      return {
        freqTable: {
          display: true,
          title: null,
          columns: ['label', 'id', 'event'],
          header: true,
          bars: true,
          structure: 'vertical',
          // ['vertical', 'horizontal']
          includeEventCentral: false,
          displayIndividuals: true,
          countType: 'id' // ['id', 'event'] - applies only when structure = 'horizontal'

        }
      };
    }

    function timing() {
      return {
        playPause: 'play',
        delay: 5000,
        speed: 'medium',
        speeds: {
          slow: Math.pow(2, 10),
          medium: Math.pow(2, 8),
          fast: Math.pow(2, 6)
        },
        speedChange: null,
        // array of objects with timepoint and speed properties
        timepoint: 0,
        // initial timepoint
        timeUnit: 'day',
        // time unit that appears in labels
        timeRelative: null,
        // e.g. "from baseline"
        duration: null,
        // defined in ./defineMetadata/updateIdDependentSettings
        loop: true,
        resetDelay: 15000
      };
    }

    function dimensions() {
      return {
        width: {
          main: null,
          sidebar: null,
          canvas: null
        },
        // defined in ../layout
        height: {
          main: null
        },
        // defined in ../layout
        orbitRadius: null // defined in ../defineMetadata/coordinates

      };
    }

    function forceSimulation() {
      return {
        manyBody: 'forceManyBodyReuse',
        // ['forceManyBody', 'forceManyBodyReuse', 'forceManyBodySampled']
        chargeStrength: null,
        // defined in ./defineMetadata/updateIdDependentSettings
        collisionPadding: 1,
        staticChargeStrength: null,
        // defined in ./defineMetadata/updateIdDependentSettings
        drawStaticSeparately: false,
        // draw static shapes in a static force simulation to improve performance
        staticLayout: 'circular' // ['circular', 'radial']

      };
    }

    function modal() {
      return {
        modal: true,
        // display modals?
        modalSpeed: 10000,
        // amount of time for which each modal appears
        modalIndex: 0,
        modalPosition: 'center',
        // ['center', 'top-left', 'top-right', 'bottom-right', 'bottom-left']
        modalWidth: '50%',
        explanation: ['Each shape in this animation represents an individual.', 'As <span class = "fdg-emphasized">time progresses</span> and individuals experience events, their shape gravitates toward the focus or "planet" representing that event.', 'The <span class = "fdg-emphasized">annotations</span> at each focus represent the [event-count-type].', 'The <span class = "fdg-emphasized">number of events</span> an individual has experienced determines the [frequency-aesthetic] of their shape.', '<span class = "fdg-emphasized">Static shapes</span> represent individuals who never experience an event.', 'Use the <span class = "fdg-emphasized">controls</span> on the right to interact with and alter the animation.', 'Continue watching to learn how these individuals progress.' // over the course of [duration] days.',
        ],
        // array of strings
        information: null // array of strings

      };
    }

    function states() {
      return {
        events: null,
        // defined in ./defineMetadata
        individualUnit: 'individual',
        individualLabel: 'Individuals',
        eventUnit: 'event',
        eventLabel: 'Events',
        eventCentral: null,
        // defined in ./defineMetadata/updateEventDependentSettings
        eventCount: true,
        // display [ n (%) ] beneath focus labels?
        eventCountType: 'current-id',
        // ['current-id', 'cumulative-id', 'cumulative-event']
        eventChangeCount: null,
        // defined in ./defineMetadata/updateEventDependentSettings
        eventLabelFontWeight: 'bold',
        eventLabelFontSize: '1.5rem',
        eventCountFontWeight: 'bold',
        eventCountFontSize: '1rem',
        eventFocusLabelChange: null // array of objects with old label, new label, and timepoint

      };
    }

    function miscellaneous() {
      return {
        hideControls: false,
        focusOffset: 'heuristic',
        // ['heuristic', 'none', 'above', 'below']
        stratificationPositioning: 'circular',
        // ['circular', 'orbital']
        annotations: null,
        enforceFocusVicinity: false,
        stateChange: 'chronological',
        // ['chronological', 'ordered']
        stateChangeAnnotation: true,
        displayProgress: true,
        footnotes: [],
        root: {
          'left-margin': '25%'
        },
        orbitShape: 'circle' // ['circle', 'ellipse']

      };
    }

    // TODO: setting checks
    function update() {
      var _this = this;

      // aesthetics
      if (!['frequency', 'continuous', 'categorical', null].includes(this.settings.colorBy.type)) {
        alert("[ '".concat(this.settings.colorBy.type, "' ] is not a valid [ colorBy.type ] setting.  Please choose one of [ 'frequency' ], [ 'continuous' ], or [ 'categorical' ].  Defaulting to  [ 'frequency' ]."));
        this.settings.colorBy.type = 'frequency';
      }

      if (!['frequency', 'continuous', null].includes(this.settings.sizeBy.type)) {
        alert("[ '".concat(this.settings.sizeBy.type, "' ] is not a valid [ sizeBy.type ] setting.  Please choose one of [ 'frequency' ] or [ 'continuous' ].  Defaulting to  [ 'frequency' ]."));
        this.settings.sizeBy.type = 'frequency';
      }

      if (!['categorical', null].includes(this.settings.shapeBy.type)) {
        alert("[ '".concat(this.settings.shapeBy.type, "' ] is not a valid [ shapeBy.type ] setting.  Please choose [ 'categorical' ].  Defaulting to  [ null ]."));
        this.settings.shapeBy.type = null;
      }

      this.settings.stratify = this.settings.colorBy.type === 'categorical';
      this.settings.colorify = this.settings.colorBy.type !== null;
      this.settings.sizify = this.settings.sizeBy.type === 'frequency' || this.settings.sizeBy.type === 'continuous' && this.settings.sizeBy.variable !== null;
      this.settings.shapify = this.settings.shapeBy.variable !== null; // freq table
      // TODO: add bars to horizontal table view

      if (this.settings.freqTable.structure === 'horizontal' && !this.settings.stratify) this.settings.freqTable.structure = 'vertical';
      if (this.settings.freqTable.structure === 'horizontal') this.settings.freqTable.bars = false; // Define array of modal text.

      var texts = [];

      if (Array.isArray(this.settings.explanation)) {
        // Update explanation text depending on aesthetics.
        this.settings.explanation = this.settings.explanation.map(function (text) {
          // event count type
          text = text.replace('[event-count-type]', _this.settings.eventCountType === 'current-id' ? 'number of individuals currently experiencing the event' : _this.settings.eventCountType === 'cumulative-id' ? 'number of individuals who have ever experienced the event' : 'total number of events'); // frequency aesthetic

          if (/\[frequency-aesthetic]/.test(text)) {
            if (_this.settings.colorBy.type === 'frequency' && _this.settings.sizeBy.type === 'frequency') text = text.replace('[frequency-aesthetic]', 'color and size');else if (_this.settings.colorBy.type === 'frequency') text = text.replace('[frequency-aesthetic]', 'color');else if (_this.settings.sizeBy.type === 'frequency') text = text.replace('[frequency-aesthetic]', 'size');else text = null;
          }

          return text;
        });
        texts = texts.concat(this.settings.explanation.filter(function (el) {
          return el !== null && !(_this.settings.hideControls && el.includes('controls'));
        }));
      }

      if (Array.isArray(this.settings.information)) texts = texts.concat(this.settings.information);
      this.settings.text = texts.filter(function (text) {
        return typeof text === 'string';
      }); // sequences

      if (this.settings.sequences) {
        this.settings.loop = false;
        this.settings.runSequences = true;
        this.settings.animationTrack = 'sequence';
        this.settings.sequences.forEach(function (sequence) {
          sequence.eventIndex = 0;
        });
      } else {
        this.settings.runSequences = false;
        this.settings.animationTrack = 'full';
      } // progress


      if (this.settings.stateChange === 'ordered') this.settings.displayProgress = false;
    }

    var settings = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, dataMapping()), aesthetics()), freqTable()), timing()), dimensions()), forceSimulation()), modal()), states()), miscellaneous()), {}, {
      update: update
    });

    function controls(main) {
      var container = this.util.addElement('controls', main).classed('fdg-hidden', this.settings.hideControls);
      var hide = this.util.addElement('hide', container, 'span');
      return {
        controlsContainer: container,
        hide: hide
      };
    }

    function addTimer(progress) {
      var timer = this.util.addElement('timer', progress);
      timer.width = timer.node().clientWidth;
      timer.innerRadius = timer.width / 8;
      timer.svg = this.util.addElement('timer__svg', timer, 'svg').attr('width', timer.width).attr('height', timer.width);
      timer.arc = d3.arc().innerRadius(timer.width / 2.25).outerRadius(timer.width / 2 - 1).startAngle(0);
      timer.g = this.util.addElement('timer__path', timer.svg, 'g').attr('transform', "translate(".concat(timer.width / 2, ",").concat(timer.width / 2, ")"));
      timer.background = this.util.addElement('timer__path', timer.g, 'path').classed('fdg-timer__path--background', true).datum({
        endAngle: 2 * Math.PI
      }).attr('d', timer.arc);
      timer.foreground = this.util.addElement('timer__path', timer.g, 'path').classed('fdg-timer__path--foreground', true).datum({
        endAngle: 0
      }).attr('d', timer.arc);
      timer.percentComplete = this.util.addElement('timer__percent-complete', timer.g, 'text').text('0%');
      return timer;
    }

    function addCountdown(progress) {
      var resetDelay = this.settings.resetDelay / 1000;
      return this.util.addElement('countdown', progress).classed('fdg-sidebar__label', true).selectAll('div').data(d3.range(-1, resetDelay)).join('div').text(function (d) {
        return "Looping in ".concat(d + 1, " second").concat(d === 0 ? '' : 's');
      }).classed('fdg-hidden', function (d) {
        return d !== resetDelay - 1;
      }).classed('fdg-invisible', function (d) {
        return d === resetDelay - 1;
      });
    }

    function sidebar(main) {
      var container = this.util.addElement('sidebar', main);
      this.settings.width.sidebar = container.node().clientWidth;
      var events = this.util.addElement('events', container).html(this.settings.eventLabel);
      var legends = this.util.addElement('legends', container);
      var progress = this.util.addElement('progress', container).classed('fdg-hidden', !this.settings.displayProgress);
      var timepoint = this.util.addElement('timepoint', progress).classed('fdg-sidebar__label', true).html("".concat(this.settings.timepoint, " ").concat(this.settings.timepoint !== 1 ? this.settings.timeUnit + 's' : this.settings.timeUnit));
      var timeRelative = this.util.addElement('time-relative', progress).classed('fdg-sidebar__sub-label', true).html(this.settings.timeRelative);
      var timer = addTimer.call(this, progress);
      var countdown = addCountdown.call(this, progress);
      var freqTable = this.util.addElement('freq-table', container);
      return {
        sidebarContainer: container,
        events: events,
        legends: legends,
        progress: progress,
        timepoint: timepoint,
        timeRelative: timeRelative,
        timer: timer,
        countdown: countdown,
        freqTable: freqTable
      };
    }

    function canvas(main) {
      var _this = this;

      var container = this.util.addElement('animation', main);
      this.settings.width.canvas = container.node().clientWidth; // background SVG - orbits

      var svgBackground = this.util.addElement('svg--background', container, 'svg').attr('width', this.settings.width.main).attr('height', this.settings.height.main).style('position', 'absolute').style('left', -this.settings.width.sidebar).style('top', 0); // canvas - bubbles

      var canvas = this.util.addElement('canvas', container, 'canvas').attr('width', this.settings.width.canvas).attr('height', this.settings.height.main);
      canvas.context = canvas.node().getContext('2d'); // foreground SVG - annotations

      var svgForeground = this.util.addElement('svg--foreground', container, 'svg').attr('width', this.settings.width.canvas).attr('height', this.settings.height.main);
      var sequenceOverlay = this.util.addElement('sequence-overlay', svgForeground, 'g').classed('fdg-focus-annotation', true).classed('fdg-hidden', !this.settings.stateChangeAnnotation).attr('transform', 'translate(20,20)');
      sequenceOverlay.background = this.util.addElement('sequence-overlay__background', sequenceOverlay, 'text').classed('fdg-focus-annotation__background fdg-focus-annotation__text', true).attr('alignment-baseline', 'hanging');
      sequenceOverlay.background.sequence = this.util.addElement('sequence-overlay__background__sequence', sequenceOverlay.background, 'tspan').classed('fdg-focus-annotation__label', true).attr('x', 0).attr('y', 0).attr('alignment-baseline', 'hanging');
      sequenceOverlay.background.event = this.util.addElement('sequence-overlay__background__event', sequenceOverlay.background, 'tspan').classed('fdg-focus-annotation__event-count', true).attr('x', 0).attr('y', 30).attr('alignment-baseline', 'hanging');
      sequenceOverlay.foreground = this.util.addElement('sequence-overlay__foreground', sequenceOverlay, 'text').classed('fdg-focus-annotation__foreground fdg-focus-annotation__text', true).attr('alignment-baseline', 'hanging');
      sequenceOverlay.foreground.sequence = this.util.addElement('sequence-overlay__foreground__sequence', sequenceOverlay.foreground, 'tspan').classed('fdg-focus-annotation__label', true).attr('x', 0).attr('y', 0).attr('alignment-baseline', 'hanging');
      sequenceOverlay.foreground.event = this.util.addElement('sequence-overlay__foreground__event', sequenceOverlay.foreground, 'tspan').classed('fdg-focus-annotation__event-count', true).attr('x', 0).attr('y', 30).attr('alignment-baseline', 'hanging');
      var customAnnotations = this.util.addElement('custom-annotations', svgForeground, 'g');
      var focusAnnotations = this.util.addElement('focus-annotations', svgForeground, 'g'); // modal

      var modalContainer = this.util.addElement('modal', container).attr('class', function (d) {
        return "fdg-modal ".concat(_this.settings.modalPosition.split('-').map(function (position) {
          return "fdg-modal--".concat(position);
        }).join(' '), " fdg-modal--").concat(_this.settings.modalPosition);
      }).classed('fdg-hidden', this.settings.text.length === 0).style('width', /^\d{1,3}%$/.test(this.settings.modalWidth) ? this.settings.modalWidth : '50%');
      var modal = this.util.addElement('modal__text', modalContainer); // footnotes

      var footnotes = this.util.addElement('footnotes', container);
      footnotes.selectAll('div.fdg-footnote').data(this.settings.footnotes).join('div').classed('fdg-footnote', true).html(function (d) {
        return d;
      });
      return {
        canvasContainer: container,
        svgBackground: svgBackground,
        canvas: canvas,
        svgForeground: svgForeground,
        sequenceOverlay: sequenceOverlay,
        focusAnnotations: focusAnnotations,
        customAnnotations: customAnnotations,
        modal: modal,
        footnotes: footnotes
      };
    }

    function coordinates(metadata) {
      var _this = this;

      // Dimensions of canvas.
      this.settings.orbitRadius = this.settings.width.canvas / (metadata.orbit.length + 1); // Calculate coordinates of event focus.

      this.settings.center = {
        x: this.settings.orbitRadius / 2,
        y: this.settings.height.main / 2
      }; // Calculate dimensions of orbits.

      metadata.orbit.forEach(function (d, i) {
        d.cx = _this.settings.center.x;
        d.cy = _this.settings.center.y;
        d.r = (i + 1) * _this.settings.orbitRadius;
        d.rx = d.r;
        d.ry = d.r - d.r * i / (i + 2);
        d.rAdj = d.r;
        d.rAdjPrev = d.r;
      });
      metadata.event.forEach(function (event, i) {
        // Define radius of the orbit on which the event focus will appear.
        event.radius = event.order * _this.settings.orbitRadius;
        event.rx = event.radius;
        var orbit = metadata.orbit.findIndex(function (orbit) {
          return orbit.values.includes(event);
        });
        event.ry = _this.settings.orbitShape === 'circle' || i === 0 ? event.radius : event.radius - event.radius * orbit / (orbit + 2); // Define angle of event focus.

        event.theta = 2 * Math.PI * event.position / 360; // Define position along orbit on which the event focus will appear.

        event.x = event.order === 0 ? _this.settings.center.x : _this.settings.center.x + event.rx * // number of orbit radii from the center
        Math.cos(event.theta); // position along the circle at the given orbit along which

        event.y = event.order === 0 ? _this.settings.center.y : _this.settings.center.y + event.ry * // number of orbit radii from the center
        Math.sin(event.theta); // y-position of the along the given orbit at which the focus circle at the
      });
    }

    function restartForceSimulation() {
      var _this = this;

      // Remove centering force after first interval.
      if (!!this.forceSimulation && !!this.forceSimulation.force('center') && this.settings.removeCenterForce === true) this.forceSimulation.force('center', null); // Reheat the simulation (alpha(1)) and update the coordinates of the x- and y- forces.

      this.forceSimulation.alpha(1).force('x', d3.forceX().x(function (d) {
        return d.value.coordinates.x;
      }).strength(0.3)).force('y', d3.forceY().y(function (d) {
        return d.value.coordinates.y;
      }).strength(0.3)).force('collide', d3.forceCollide().radius(function (d) {
        return d.value.size + _this.settings.collisionPadding;
      })).restart();
    }

    function decodeBase64(base64, enableUnicode) {
        var binaryString = atob(base64);
        if (enableUnicode) {
            var binaryView = new Uint8Array(binaryString.length);
            for (var i = 0, n = binaryString.length; i < n; ++i) {
                binaryView[i] = binaryString.charCodeAt(i);
            }
            return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
        }
        return binaryString;
    }

    function createURL(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
        var source = decodeBase64(base64, enableUnicode);
        var start = source.indexOf('\n', 10) + 1;
        var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
        var blob = new Blob([body], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    }

    function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
        var url;
        return function WorkerFactory(options) {
            url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
            return new Worker(url, options);
        };
    }

    var WorkerFactory = createBase64WorkerFactory('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1kaXNwYXRjaC52Mi5taW4uanMnKTsKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1xdWFkdHJlZS52Mi5taW4uanMnKTsKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy10aW1lci52Mi5taW4uanMnKTsKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1mb3JjZS52Mi5taW4uanMnKTsgLy9zZWxmLmltcG9ydFNjcmlwdHMoJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZDMtZm9yY2UtcmV1c2VAMS4wLjEvYnVpbGQvZDMtZm9yY2UtcmV1c2UubWluLmpzJyk7CgogICAgc2VsZi5pbXBvcnRTY3JpcHRzKCdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2QzLWZvcmNlLXNhbXBsZWRAMS4wLjAvYnVpbGQvZDMtZm9yY2Utc2FtcGxlZC5taW4uanMnKTsKCiAgICBvbm1lc3NhZ2UgPSBmdW5jdGlvbiBvbm1lc3NhZ2UoZXZlbnQpIHsKICAgICAgdmFyIF9ldmVudCRkYXRhID0gZXZlbnQuZGF0YSwKICAgICAgICAgIG5vZGVzID0gX2V2ZW50JGRhdGEubm9kZXMsCiAgICAgICAgICBsYXlvdXQgPSBfZXZlbnQkZGF0YS5sYXlvdXQsCiAgICAgICAgICBzdHJlbmd0aCA9IF9ldmVudCRkYXRhLnN0cmVuZ3RoLAogICAgICAgICAgb3JiaXRSYWRpdXMgPSBfZXZlbnQkZGF0YS5vcmJpdFJhZGl1cywKICAgICAgICAgIHggPSBfZXZlbnQkZGF0YS54LAogICAgICAgICAgeSA9IF9ldmVudCRkYXRhLnksCiAgICAgICAgICByYWRpdXMgPSBfZXZlbnQkZGF0YS5yYWRpdXMsCiAgICAgICAgICBpZCA9IF9ldmVudCRkYXRhLmlkOwogICAgICB2YXIgc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbigpLm5vZGVzKG5vZGVzKTsKICAgICAgaWYgKGxheW91dCA9PT0gJ2NpcmN1bGFyJykgc2ltdWxhdGlvbi5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhyYWRpdXMgKyAwLjUpKSAvLyBjb2xsaXNpb24gZGV0ZWN0aW9uCiAgICAgIC8vLmZvcmNlKCdjaGFyZ2UnLCBkMy5mb3JjZU1hbnlCb2R5KCkuc3RyZW5ndGgoc3RyZW5ndGgpKSAvLyBjaGFyZ2UKICAgICAgLy8uZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHlSZXVzZSgpLnN0cmVuZ3RoKHN0cmVuZ3RoKSkgLy8gY2hhcmdlCiAgICAgIC5mb3JjZSgnY2hhcmdlJywgZDMuZm9yY2VNYW55Qm9keVNhbXBsZWQoKS5zdHJlbmd0aChzdHJlbmd0aCkpIC8vIGNoYXJnZQogICAgICAuZm9yY2UoJ3gnLCBkMy5mb3JjZVgoeCkuc3RyZW5ndGgoMC4zKSkuZm9yY2UoJ3knLCBkMy5mb3JjZVkoeSkuc3RyZW5ndGgoMC4zKSk7ZWxzZSBpZiAobGF5b3V0ID09PSAncmFkaWFsJykgc2ltdWxhdGlvbi5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhyYWRpdXMgKyAwLjUpKSAvLyBjb2xsaXNpb24gZGV0ZWN0aW9uCiAgICAgIC5mb3JjZSgncicsIGQzLmZvcmNlUmFkaWFsKG9yYml0UmFkaXVzIC8gMikpOyAvLyBwb3NpdGlvbmluZwogICAgICAvLyBzdG9wIHNpbXVsYXRpb24KCiAgICAgIHNpbXVsYXRpb24uc3RvcCgpOyAvLyBpbmNyZW1lbnQgc2ltdWxhdGlvbiBtYW51YWxseQoKICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBNYXRoLmNlaWwoTWF0aC5sb2coc2ltdWxhdGlvbi5hbHBoYU1pbigpKSAvIE1hdGgubG9nKDEgLSBzaW11bGF0aW9uLmFscGhhRGVjYXkoKSkpOyBpIDwgbjsgKytpKSB7CiAgICAgICAgc2ltdWxhdGlvbi50aWNrKCk7CiAgICAgIH0gLy8gcmV0dXJuIHVwZGF0ZWQgbm9kZXMgYXJyYXkgdG8gYmUgZHJhd24gYW5kIHJlbmRlcmVkCgoKICAgICAgcG9zdE1lc3NhZ2UoewogICAgICAgIG5vZGVzOiBub2RlcywKICAgICAgICByYWRpdXM6IHJhZGl1cywKICAgICAgICBpZDogaWQKICAgICAgfSk7CiAgICB9OwoKfSgpKTsKCg==', 'data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yY2VTaW11bGF0aW9uV29ya2VyLmpzIiwic291cmNlcyI6WyJzcmMvaW5pdC9hZGRTdGF0aWNGb3JjZVNpbXVsYXRpb24vZm9yY2VTaW11bGF0aW9uV29ya2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1kaXNwYXRjaC52Mi5taW4uanMnKTtcclxuc2VsZi5pbXBvcnRTY3JpcHRzKCdodHRwczovL2QzanMub3JnL2QzLXF1YWR0cmVlLnYyLm1pbi5qcycpO1xyXG5zZWxmLmltcG9ydFNjcmlwdHMoJ2h0dHBzOi8vZDNqcy5vcmcvZDMtdGltZXIudjIubWluLmpzJyk7XHJcbnNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1mb3JjZS52Mi5taW4uanMnKTtcclxuLy9zZWxmLmltcG9ydFNjcmlwdHMoJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZDMtZm9yY2UtcmV1c2VAMS4wLjEvYnVpbGQvZDMtZm9yY2UtcmV1c2UubWluLmpzJyk7XHJcbnNlbGYuaW1wb3J0U2NyaXB0cyhcclxuICAgICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2QzLWZvcmNlLXNhbXBsZWRAMS4wLjAvYnVpbGQvZDMtZm9yY2Utc2FtcGxlZC5taW4uanMnXHJcbik7XHJcblxyXG5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgICBub2RlcywgLy8gZGF0YVxyXG4gICAgICAgIGxheW91dCxcclxuICAgICAgICBzdHJlbmd0aCxcclxuICAgICAgICBvcmJpdFJhZGl1cywgLy8gZm9yY2Ugc2ltdWxhdGlvbiBzZXR0aW5nc1xyXG4gICAgICAgIHgsXHJcbiAgICAgICAgeSwgLy8gY29vcmRpbmF0ZXNcclxuICAgICAgICByYWRpdXMsXHJcbiAgICAgICAgaWQsXHJcbiAgICB9ID0gZXZlbnQuZGF0YTtcclxuXHJcbiAgICBjb25zdCBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKCkubm9kZXMobm9kZXMpO1xyXG5cclxuICAgIGlmIChsYXlvdXQgPT09ICdjaXJjdWxhcicpXHJcbiAgICAgICAgc2ltdWxhdGlvblxyXG4gICAgICAgICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMocmFkaXVzICsgMC41KSkgLy8gY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAvLy5mb3JjZSgnY2hhcmdlJywgZDMuZm9yY2VNYW55Qm9keSgpLnN0cmVuZ3RoKHN0cmVuZ3RoKSkgLy8gY2hhcmdlXHJcbiAgICAgICAgICAgIC8vLmZvcmNlKCdjaGFyZ2UnLCBkMy5mb3JjZU1hbnlCb2R5UmV1c2UoKS5zdHJlbmd0aChzdHJlbmd0aCkpIC8vIGNoYXJnZVxyXG4gICAgICAgICAgICAuZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHlTYW1wbGVkKCkuc3RyZW5ndGgoc3RyZW5ndGgpKSAvLyBjaGFyZ2VcclxuICAgICAgICAgICAgLmZvcmNlKCd4JywgZDMuZm9yY2VYKHgpLnN0cmVuZ3RoKDAuMykpXHJcbiAgICAgICAgICAgIC5mb3JjZSgneScsIGQzLmZvcmNlWSh5KS5zdHJlbmd0aCgwLjMpKTtcclxuICAgIGVsc2UgaWYgKGxheW91dCA9PT0gJ3JhZGlhbCcpXHJcbiAgICAgICAgc2ltdWxhdGlvblxyXG4gICAgICAgICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMocmFkaXVzICsgMC41KSkgLy8gY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAuZm9yY2UoJ3InLCBkMy5mb3JjZVJhZGlhbChvcmJpdFJhZGl1cyAvIDIpKTsgLy8gcG9zaXRpb25pbmdcclxuXHJcbiAgICAvLyBzdG9wIHNpbXVsYXRpb25cclxuICAgIHNpbXVsYXRpb24uc3RvcCgpO1xyXG5cclxuICAgIC8vIGluY3JlbWVudCBzaW11bGF0aW9uIG1hbnVhbGx5XHJcbiAgICBmb3IgKFxyXG4gICAgICAgIHZhciBpID0gMCxcclxuICAgICAgICAgICAgbiA9IE1hdGguY2VpbChNYXRoLmxvZyhzaW11bGF0aW9uLmFscGhhTWluKCkpIC8gTWF0aC5sb2coMSAtIHNpbXVsYXRpb24uYWxwaGFEZWNheSgpKSk7XHJcbiAgICAgICAgaSA8IG47XHJcbiAgICAgICAgKytpXHJcbiAgICApIHtcclxuICAgICAgICBzaW11bGF0aW9uLnRpY2soKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gdXBkYXRlZCBub2RlcyBhcnJheSB0byBiZSBkcmF3biBhbmQgcmVuZGVyZWRcclxuICAgIHBvc3RNZXNzYWdlKHsgbm9kZXMsIHJhZGl1cywgaWQgfSk7XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJzZWxmIiwiaW1wb3J0U2NyaXB0cyIsIm9ubWVzc2FnZSIsImV2ZW50IiwiZGF0YSIsIm5vZGVzIiwibGF5b3V0Iiwic3RyZW5ndGgiLCJvcmJpdFJhZGl1cyIsIngiLCJ5IiwicmFkaXVzIiwiaWQiLCJzaW11bGF0aW9uIiwiZDMiLCJmb3JjZVNpbXVsYXRpb24iLCJmb3JjZSIsImZvcmNlQ29sbGlkZSIsImZvcmNlTWFueUJvZHlTYW1wbGVkIiwiZm9yY2VYIiwiZm9yY2VZIiwiZm9yY2VSYWRpYWwiLCJzdG9wIiwiaSIsIm4iLCJNYXRoIiwiY2VpbCIsImxvZyIsImFscGhhTWluIiwiYWxwaGFEZWNheSIsInRpY2siLCJwb3N0TWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7O0lBQUFBLElBQUksQ0FBQ0MsYUFBTCxDQUFtQix3Q0FBbkI7SUFDQUQsSUFBSSxDQUFDQyxhQUFMLENBQW1CLHdDQUFuQjtJQUNBRCxJQUFJLENBQUNDLGFBQUwsQ0FBbUIscUNBQW5CO0lBQ0FELElBQUksQ0FBQ0MsYUFBTCxDQUFtQixxQ0FBbkI7O0lBRUFELElBQUksQ0FBQ0MsYUFBTCxDQUNJLG1GQURKOztJQUlBQyxTQUFTLEdBQUcsbUJBQVVDLEtBQVYsRUFBaUI7SUFBQSxvQkFVckJBLEtBQUssQ0FBQ0MsSUFWZTtJQUFBLE1BRXJCQyxLQUZxQixlQUVyQkEsS0FGcUI7SUFBQSxNQUdyQkMsTUFIcUIsZUFHckJBLE1BSHFCO0lBQUEsTUFJckJDLFFBSnFCLGVBSXJCQSxRQUpxQjtJQUFBLE1BS3JCQyxXQUxxQixlQUtyQkEsV0FMcUI7SUFBQSxNQU1yQkMsQ0FOcUIsZUFNckJBLENBTnFCO0lBQUEsTUFPckJDLENBUHFCLGVBT3JCQSxDQVBxQjtJQUFBLE1BUXJCQyxNQVJxQixlQVFyQkEsTUFScUI7SUFBQSxNQVNyQkMsRUFUcUIsZUFTckJBLEVBVHFCO0lBWXpCLE1BQU1DLFVBQVUsR0FBR0MsRUFBRSxDQUFDQyxlQUFILEdBQXFCVixLQUFyQixDQUEyQkEsS0FBM0IsQ0FBbkI7SUFFQSxNQUFJQyxNQUFNLEtBQUssVUFBZixFQUNJTyxVQUFVLENBQ0xHLEtBREwsQ0FDVyxTQURYLEVBQ3NCRixFQUFFLENBQUNHLFlBQUgsR0FBa0JOLE1BQWxCLENBQXlCQSxNQUFNLEdBQUcsR0FBbEMsQ0FEdEI7SUFFSTtJQUNBO0lBSEosR0FJS0ssS0FKTCxDQUlXLFFBSlgsRUFJcUJGLEVBQUUsQ0FBQ0ksb0JBQUgsR0FBMEJYLFFBQTFCLENBQW1DQSxRQUFuQyxDQUpyQjtJQUFBLEdBS0tTLEtBTEwsQ0FLVyxHQUxYLEVBS2dCRixFQUFFLENBQUNLLE1BQUgsQ0FBVVYsQ0FBVixFQUFhRixRQUFiLENBQXNCLEdBQXRCLENBTGhCLEVBTUtTLEtBTkwsQ0FNVyxHQU5YLEVBTWdCRixFQUFFLENBQUNNLE1BQUgsQ0FBVVYsQ0FBVixFQUFhSCxRQUFiLENBQXNCLEdBQXRCLENBTmhCLEVBREosS0FRSyxJQUFJRCxNQUFNLEtBQUssUUFBZixFQUNETyxVQUFVLENBQ0xHLEtBREwsQ0FDVyxTQURYLEVBQ3NCRixFQUFFLENBQUNHLFlBQUgsR0FBa0JOLE1BQWxCLENBQXlCQSxNQUFNLEdBQUcsR0FBbEMsQ0FEdEI7SUFBQSxHQUVLSyxLQUZMLENBRVcsR0FGWCxFQUVnQkYsRUFBRSxDQUFDTyxXQUFILENBQWViLFdBQVcsR0FBRyxDQUE3QixDQUZoQixFQXZCcUI7SUEyQnpCOztJQUNBSyxFQUFBQSxVQUFVLENBQUNTLElBQVgsR0E1QnlCOztJQStCekIsT0FDSSxJQUFJQyxDQUFDLEdBQUcsQ0FBUixFQUNJQyxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVRCxJQUFJLENBQUNFLEdBQUwsQ0FBU2QsVUFBVSxDQUFDZSxRQUFYLEVBQVQsSUFBa0NILElBQUksQ0FBQ0UsR0FBTCxDQUFTLElBQUlkLFVBQVUsQ0FBQ2dCLFVBQVgsRUFBYixDQUE1QyxDQUZaLEVBR0lOLENBQUMsR0FBR0MsQ0FIUixFQUlJLEVBQUVELENBSk4sRUFLRTtJQUNFVixJQUFBQSxVQUFVLENBQUNpQixJQUFYO0lBQ0gsR0F0Q3dCOzs7SUF5Q3pCQyxFQUFBQSxXQUFXLENBQUM7SUFBRTFCLElBQUFBLEtBQUssRUFBTEEsS0FBRjtJQUFTTSxJQUFBQSxNQUFNLEVBQU5BLE1BQVQ7SUFBaUJDLElBQUFBLEVBQUUsRUFBRkE7SUFBakIsR0FBRCxDQUFYO0lBQ0gsQ0ExQ0Q7Ozs7OzsifQ==', false);
    /* eslint-enable */

    function simulate(data, x, y, id) {
      var worker = new WorkerFactory();
      worker.postMessage({
        // data
        nodes: data,
        // force simulation settings
        layout: this.settings.staticLayout,
        strength: this.settings.chargeStrength,
        orbitRadius: this.settings.orbitRadius,
        // coordinates
        x: x,
        y: y,
        // aesthetics
        radius: this.settings.minRadius,
        // miscellaneous
        id: id
      });
      return worker;
    }

    function draw(worker, color) {
      var main = this;

      worker.onmessage = function (event) {
        var className = "fdg-static--".concat(event.data.id.replace(/[^0-9_a-z]/gi, '-'));
        main.layout.svgBackground.selectAll(".".concat(className)).remove();
        var g = main.layout.svgBackground.insert('g', ':first-child').classed("fdg-static ".concat(className), true).attr('transform', "translate(".concat(main.settings.width.sidebar, ",0)")); // translate to the central focus

        if (main.settings.staticLayout == 'radial') g.attr('transform', "translate(".concat(main.settings.width.sidebar + main.settings.orbitRadius / 2, ",").concat(main.settings.height / 2, ")"));
        var marks = g.selectAll('.fdg-static__mark').data(event.data.nodes).join(main.settings.shape === 'circle' ? 'circle' : 'rect').classed('fdg-static__mark', true).attr('fill', function (d) {
          return d.color;
        }).attr('fill-opacity', 0.25);
        if (main.settings.shape === 'circle') marks.attr('cx', function (d) {
          return d.x;
        }).attr('cy', function (d) {
          return d.y;
        }).attr('r', event.data.radius);else marks.attr('x', function (d) {
          return d.x - event.data.radius;
        }).attr('y', function (d) {
          return d.y - event.data.radius;
        }).attr('width', event.data.radius * 2).attr('height', event.data.radius * 2);
      };
    }

    function addStaticForceSimulation() {
      var _this = this;

      if (this.settings.drawStaticSeparately) {
        this.layout.svgBackground.selectAll('.fdg-static').remove(); // Capture individuals without state change.

        var noStateChange = this.data.nested.filter(function (d) {
          return d.value.noStateChange;
        }).map(function (d) {
          return {
            key: d.key,
            colorValue: d.value.colorValue,
            color: d.value.color
          };
        }); // Simulate and render force layout separately for individuals within each color stratum.

        if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
          this.metadata.event[0].foci.forEach(function (focus) {
            var data = noStateChange.filter(function (d) {
              return d.colorValue === focus.key;
            }); // Pass data, coordinates, and color to web worker.

            var worker = simulate.call(_this, data, focus.x, focus.y, focus.key); // Pass web worker to draw function.

            draw.call(_this, worker);
          });
        } // Simulate and render force layout for all individuals.
        else {
            // Pass data, coordinates, and color to web worker.
            var worker = simulate.call(this, noStateChange, this.settings.orbitRadius / 2, this.settings.height.main / 2, 'main'); // Pass web worker to draw function.

            draw.call(this, worker);
          }
      }
    }

    function getState(group, index) {
      var _this = this;

      var minTimepoint = d3.min(group, function (d) {
        return d.start_timepoint;
      });
      var maxTimepoint = d3.max(group, function (d) {
        return d.end_timepoint;
      });
      var state = group.find(function (d, i) {
        return d.start_timepoint <= _this.settings.timepoint && _this.settings.timepoint <= d.end_timepoint;
      }); // first (and hopefully only) state that overlaps the current timepoint

      switch (true) {
        case index !== undefined:
          state = group[index];
          break;

        case this.settings.timepoint >= maxTimepoint:
          state = group[group.length - 1];
          break;

        case this.settings.timepoint < minTimepoint:
          state = group[0];
          break;

        case state === undefined:
          state = group.slice().sort(function (a, b) {
            return b.start_timepoint - a.start_timepoint;
          }).find(function (d) {
            return d.start_timepoint <= _this.settings.timepoint;
          });
          break;
      }

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

    function getAestheticValues(group, state) {
      var colorValue = this.settings.colorBy.type === 'frequency' ? countStateChanges.call(this, group) : this.settings.colorBy.variable !== null ? state[this.settings.colorBy.variable] : null;
      var sizeValue = this.settings.sizeBy.type === 'frequency' ? countStateChanges.call(this, group) : this.settings.sizeBy.variable !== null ? state[this.settings.sizeBy.variable] : null;
      var shapeValue = this.settings.shapeBy.type === 'frequency' ? countStateChanges.call(this, group) : this.settings.shapeBy.variable !== null ? state[this.settings.shapeBy.variable] : null;
      return {
        colorValue: colorValue,
        sizeValue: sizeValue,
        shapeValue: shapeValue
      };
    }

    function getCoordinates(state, colorValue) {
      var destination = this.settings.stratify && this.settings.colorBy.stratify ? this.metadata.event.find(function (event) {
        return event.key === state.event;
      }).foci.find(function (focus) {
        return focus.key === colorValue;
      }) : this.metadata.event.find(function (event) {
        return event.key === state.event;
      });
      var coordinates = {
        x: destination.x,
        y: destination.y
      };
      return coordinates;
    }

    function getColorScale(colorValue) {
      var colorScale = this.settings.stratify && this.settings.sizeBy.type === 'frequency' ? this.metadata.strata.find(function (stratum) {
        return stratum.key === colorValue;
      }).colorScale : this.scales.color;
      return colorScale;
    }

    function getColor(scale, value) {
      var color = scale !== undefined ? scale(value) : 'rgb(170,170,170)';
      var fill = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
      var stroke = color.replace('rgb', 'rgba').replace(')', ', 1)');
      return {
        color: color,
        fill: fill,
        stroke: stroke
      };
    }

    function getSize(scale, value) {
      var size = scale !== undefined ? scale(value) : this.settings.minRadius;
      return size;
    }

    function getShape(scale, value) {
      var shape = scale !== undefined ? scale(value) : this.settings.shape;
      return shape;
    }

    function getAesthetics(aestheticValues, colorScale) {
      var color = getColor.call(this, this.scales.color, aestheticValues.colorValue);
      var size = getSize.call(this, this.scales.size, aestheticValues.sizeValue);
      var shape = getShape.call(this, this.scales.shape, aestheticValues.shapeValue);
      return _objectSpread2(_objectSpread2({}, color), {}, {
        // color, fill, stroke
        size: size,
        shape: shape
      });
    }

    function nestedData(data) {
      var _this = this;

      data.nested.forEach(function (d, i) {
        var _d$value$statePreviou;

        // Capture next state.
        var currentState = getState.call(_this, d.value.group); // On state change update current and previous state objects of individual.

        if (d.value.state !== currentState) {
          d.value.statePrevious = d.value.state;
          d.value.state = currentState;
        } // Get aesthetic values.


        var aestheticValues = getAestheticValues.call(_this, d.value.group, d.value.state);
        d.value.colorScale = getColorScale.call(_this, aestheticValues.colorValue);
        var aesthetics = getAesthetics.call(_this, aestheticValues, d.value.colorScale); // Calcualate distance from origin and to destination.

        d.value.distance = Math.sqrt(Math.pow(d.x - _this.settings.center.x, 2) + Math.pow(d.y - _this.settings.center.y, 2));
        d.value.distanceFromFocus = Math.sqrt(Math.pow(d.x - d.value.coordinates.x, 2) + Math.pow(d.y - d.value.coordinates.y, 2));
        d.value.inVicinityOfFocus = d.value.distanceFromFocus < _this.settings.orbitRadius / 16; // Update coordinates once node reaches vicinity of destination or when time since
        // previous state crosses some threshold.

        d.value.state.transitTime++;
        d.value.transitTime++;
        var transitThreshold = 500 / Math.ceil(Math.sqrt(_this.settings.speeds[_this.settings.speed]));

        if (_this.settings.enforceFocusVicinity === false || d.value.inVicinityOfFocus || ((_d$value$statePreviou = d.value.statePrevious) === null || _d$value$statePreviou === void 0 ? void 0 : _d$value$statePreviou.event) === _this.settings.eventCentral || d.value.transitTime > transitThreshold) {
          d.value.transitTime = 0;
          d.value.coordinates = getCoordinates.call(_this, d.value.state, aestheticValues.colorValue);
        }

        Object.assign(d.value, aestheticValues, aesthetics);
      });
    }

    // Capture IDs in the given state.
    function filterData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['value'];
      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      return data.filter(function (d, i) {
        return props.reduce(function (value, prop) {
          return value[prop];
        }, d) === value;
      });
    }

    // Maintain a set of any IDs that have existed in the given state.
    function updateIdSet(data, set) {
      var cumulative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (cumulative) data.forEach(function (id) {
        set.add(id.key);
      });else return new Set(data.map(function (id) {
        return id.key;
      }));
    }

    // Count the number of events, i.e. the number of times any ID has existed in the given state.
    function countCumulative(data, timepoint, event, stratum) {
      return data.filter(function (d) {
        return d.start_timepoint <= timepoint && d.event === event && (stratum === undefined || d[stratum.key] === stratum.value);
      }).length;
    }

    function getFreqs(d, event, metadata) {
      // Calculate the current number of individuals and events.
      var idNumerator = this.settings.eventCountType === 'cumulative-id' ? d.nIdsCumulative : d.nIds;
      var eventNumerator = d.nEvents; // Calculate the total number of individuals and events.

      var idDenominator = d !== event ? d.individuals.length // number of individuals in the stratum
      : metadata.id.length; // total number of individuals

      var eventDenominator = d !== event ? event.nEvents // number of events at the given state
      : event.nEventsTotal; // total number of events (doesn't really have any use but hey, it's something)
      // Calculate proportions.

      var idProportion = idNumerator / idDenominator;
      var eventProportion = eventNumerator / eventDenominator;
      return {
        idNumerator: idNumerator,
        eventNumerator: eventNumerator,
        idDenominator: idDenominator,
        eventDenominator: eventDenominator,
        idProportion: idProportion,
        eventProportion: eventProportion
      };
    }

    function formatValues(d) {
      // Format the counts and proportions.
      var idNumerator = d3.format(',d')(d.freqs.idNumerator);
      var eventNumerator = d3.format(',d')(d.freqs.eventNumerator);
      var idPercent = d3.format('.1%')(d.freqs.idDenominator > 0 ? d.freqs.idProportion : 0);
      var eventPercent = d3.format('.1%')(d.freqs.eventDenominator > 0 ? d.freqs.eventProportion : 0);
      var idNumeratorPercent = "".concat(idNumerator, " (").concat(idPercent, ")");
      var eventNumeratorPercent = "".concat(eventNumerator, " (").concat(eventPercent, ")");
      return {
        idNumerator: idNumerator,
        eventNumerator: eventNumerator,
        idPercent: idPercent,
        eventPercent: eventPercent,
        idNumeratorPercent: idNumeratorPercent,
        eventNumeratorPercent: eventNumeratorPercent
      };
    }

    function defineCellValues(d) {
      var _this = this;

      var cells = [{
        key: 'label',
        label: '',
        value: d.label
      }];

      if (this.settings.freqTable.structure === 'vertical') {
        this.settings.freqTable.columns.forEach(function (column) {
          if (column === 'id') cells.push({
            key: 'id',
            label: _this.settings.individualLabel,
            value: d.fmt.idNumeratorPercent
          });
          if (column === 'event') cells.push({
            key: 'event',
            label: _this.settings.evetLabel,
            value: d.fmt.eventNumerator
          });
        });
      } // one column per stratum
      else {
          if (this.settings.freqTable.countType === 'id') cells.push({
            key: 'id',
            label: this.settings.individualLabel,
            value: d.fmt.idNumeratorPercent
          });else cells.push({
            key: 'event',
            label: this.settings.eventLabel,
            value: d.fmt.eventNumerator
          });
          if (d.foci) d.foci.forEach(function (focus) {
            if (_this.settings.freqTable.countType === 'id') cells.push({
              key: "id--".concat(focus.key),
              label: focus.key,
              value: focus.fmt.idNumeratorPercent
            });else cells.push({
              key: "event--".concat(focus.key),
              label: focus.key,
              value: focus.fmt.eventNumerator
            });
          });
        }

      return cells;
    }

    function eventMetadata(data) {
      var _this = this;

      this.metadata.event.forEach(function (event) {
        // Subset data on individuals in the given state.
        event.data = filterData(data.nested, ['value', 'state', 'event'], event.key); // Update current set of individuals.

        event.ids = updateIdSet(event.data, event.ids);
        event.nIds = event.ids.size; // Update cumulative set of individuals.

        updateIdSet(event.data, event.idsCumulative, true);
        event.nIdsCumulative = event.idsCumulative.size; // Update cumulative number of events.

        event.nEvents = countCumulative(data, _this.settings.timepoint, event.key); // Calculate numerators, denominators, and proportions.

        event.freqs = getFreqs.call(_this, event, event, _this.metadata);
        event.fmt = formatValues.call(_this, event); // Calculate the change in IDs in the given state from the previous timepoint.

        event.change = event.nIds - event.nIdsPrevious;
        if (event.foci) event.foci.forEach(function (focus) {
          // Subset data on individuals in the given state and stratum.
          focus.data = filterData(event.data, ['value', 'colorValue'], focus.key); // Update current set of individuals.

          focus.ids = updateIdSet(focus.data, focus.ids);
          focus.nIds = focus.ids.size; // Update cumulative set of individuals.

          updateIdSet(focus.data, focus.idsCumulative, true);
          focus.nIdsCumulative = focus.idsCumulative.size; // Update cumulative number of events.

          focus.nEvents = countCumulative(data, _this.settings.timepoint, event.key, {
            key: _this.settings.colorBy.variable,
            value: focus.key
          }); // Calculate numerators, denominators, and proportions.

          focus.freqs = getFreqs.call(_this, focus, event, _this.metadata);
          focus.fmt = formatValues.call(_this, focus);
          focus.cells = defineCellValues.call(_this, focus);
          focus.change = focus.nIds - focus.nIdsPrevious;
        }); // Define an array for the frequency table.

        event.cells = defineCellValues.call(_this, event);
      });
    }

    function data(data) {
      // Count the number of individuals at each focus at previous timepoint.
      this.metadata.event.forEach(function (event) {
        event.prevCount = event.count;
        if (event.foci) event.foci.forEach(function (focus) {
          focus.prevCount = focus.count;
        });
      });
      nestedData.call(this, data);
      eventMetadata.call(this, data);
    }

    function resize() {
      var _this = this;

      this.settings.width.main = this.layout.main.node().clientWidth;
      this.settings.height.main = this.layout.main.node().clientHeight;
      this.settings.width.sidebar = this.layout.sidebarContainer.node().clientWidth;
      this.settings.width.canvas = this.layout.canvasContainer.node().clientWidth; // timer

      this.layout.timer.width = this.layout.timer.node().clientWidth;
      this.layout.timer.svg.attr('width', this.layout.timer.width).attr('height', this.layout.timer.width);
      this.layout.timer.arc.innerRadius(this.layout.timer.width / 2.25).outerRadius(this.layout.timer.width / 2);
      this.layout.timer.g.attr('transform', "translate(".concat(this.layout.timer.width / 2, ",").concat(this.layout.timer.width / 2, ")"));
      this.layout.timer.background.attr('d', this.layout.timer.arc);
      this.layout.timer.foreground.attr('d', this.layout.timer.arc); // background SVG

      this.layout.svgBackground.attr('width', this.settings.width.main).attr('height', this.settings.height.main).style('left', -this.settings.width.sidebar); // canvas

      this.layout.canvas.attr('width', this.settings.width.canvas).attr('height', this.settings.height.main); // SVG

      this.layout.svgForeground.attr('width', this.settings.width.canvas).attr('height', this.settings.height.main);
      coordinates.call(this, this.metadata); // orbits

      this.orbits.attr('cx', function (d) {
        return d.cx;
      }).attr('cy', function (d) {
        return d.cy;
      }).attr('r', function (d) {
        return d.r;
      });
      this.layout.svgBackground.select('g.fdg-g--orbits').attr('transform', "translate(".concat(this.settings.width.sidebar, ",0)")); // focus coordinates

      if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
        this.metadata.event.forEach(function (event, i) {
          // Update coordinates of categorical foci.
          event.foci.forEach(function (focus, j) {
            focus.x = event.x + 50 * Math.cos(focus.angle);
            focus.dx = event.x + (i === 0 ? 75 : 50) * Math.cos(focus.angle);
            focus.y = event.y + 50 * Math.sin(focus.angle);
            focus.dy = event.y + (i === 0 ? 75 : 50) * Math.sin(focus.angle); // Position stratum foci along orbits rather than on a circle at event focus.

            if (_this.settings.stratificationPositioning === 'orbital') {
              focus.theta = event.theta + _this.settings.arcLength * _this.settings.offsets[j] / (2 * Math.PI * event.radius) * 360; // Define position along orbit on which the stratum focus will appear.

              focus.x = event.order === 0 ? focus.x : _this.settings.center.x + event.radius * // number of orbit radii from the center
              Math.cos(focus.theta); // position along the circle at the given orbit along which

              focus.dx = focus.x;
              focus.y = event.order === 0 ? focus.y : _this.settings.center.y + event.radius * // number of orbit radii from the center
              Math.sin(focus.theta); // y-position of the along the given orbit at which the focus circle at the

              focus.dy = focus.y;
            }
          });
          event.fociLabels.selectAll("text.fdg-focus-annotation__text").attr('x', function (d) {
            return d.dx;
          }).attr('y', function (d) {
            return d.dy;
          });
        });
      } // Update the node data.


      data.call(this, this.sequence ? this.sequence.data : this.data);
      restartForceSimulation.call(this); // static force simulation

      addStaticForceSimulation.call(this); // focus annotations

      this.focusAnnotations.attr('transform', function (d) {
        return "translate(".concat(d.x, ",").concat(d.y, ")");
      }); // custom annotations

      if (this.customAnnotations) {
        this.settings.annotations.forEach(function (annotation) {
          annotation.radius = annotation.orbit * _this.settings.orbitRadius;
          annotation.theta = 2 * Math.PI * annotation.angle / 360;
          annotation.x = _this.settings.center.x + annotation.radius * // number of orbit radii from the center
          Math.cos(annotation.theta); // position along the circle at the given orbit along which

          annotation.y = annotation.order === 0 ? _this.settings.center.y : _this.settings.center.y + annotation.radius * // number of orbit radii from the center
          Math.sin(annotation.theta); // y-position of the along the given orbit at which the focus circle at the
        });
        this.customAnnotations.attr('transform', function (d) {
          return "translate(".concat(d.x, ",").concat(d.y, ")");
        });
      }
    }

    function display() {
      var main = this;
      var container = this.controls.container.append('div').classed('fdg-control--display', true);
      var inputs = container.append('div').classed('fdg-display-controls', true).datum({
        state: !this.settings.minimizeControls,
        symbol: this.settings.minimizeControls ? '+' : '-'
      }).html(function (d) {
        return "Controls <span class = 'fdg-expand'>".concat(d.symbol, "</span>");
      }).attr('title', function (d) {
        return d.state ? 'Hide controls.' : 'Display controls.';
      });
      inputs.on('click', function (d) {
        d.state = !d.state;
        d.symbol = d.state ? '-' : '+';
        main.controls.display.inputs.html("Controls <span class = 'fdg-expand'>".concat(d.symbol, "</span>")).attr('title', function (d) {
          return d.state ? 'Hide controls.' : 'Display controls.';
        });
        main.controls.containers.each(function () {
          this.classList.toggle('fdg-control--collapsed');
        });
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function fadeOut(selection) {
      return selection.transition().duration(this.settings.modalSpeed).style('opacity', 0);
    }

    function getNextSequence() {
      var _this = this;

      var increment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (increment) this.settings.sequenceIndex++;
      var sequence = this.settings.sequences[this.settings.sequenceIndex];
      var start_orbit = this.metadata.orbit.find(function (orbit) {
        return +orbit.key === sequence.start_order;
      });
      sequence.events = start_orbit ? start_orbit.values : [this.metadata.event.find(function (event) {
        return event.key === _this.settings.eventCentral;
      })];
      fadeOut.call(this, this.layout.sequenceOverlay.background.sequence);
      fadeOut.call(this, this.layout.sequenceOverlay.foreground.sequence);
      fadeOut.call(this, this.layout.sequenceOverlay.background.event);
      fadeOut.call(this, this.layout.sequenceOverlay.foreground.event);
      return sequence;
    }

    function fadeIn(selection, html) {
      return selection.html(html).style('opacity', 0).transition().duration(this.settings.modalSpeed / 5).style('opacity', 1);
    }

    function structure(data) {
      var _this = this;

      var grouped = d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (group) {
        // individual-level values - calculated once
        var duration = d3.sum(group, function (d) {
          return d.duration;
        });
        var noStateChange = group.length === 1 && group[0].event === _this.settings.eventCentral; // state-level values - calculated once per timepoint

        var state = getState.call(_this, group, 0);
        var aestheticValues = getAestheticValues.call(_this, group, state);
        var coordinates = getCoordinates.call(_this, state, aestheticValues.colorValue);
        var distance = Math.sqrt(Math.pow(coordinates.x - _this.settings.center.x, 2) + Math.pow(coordinates.y - _this.settings.center.y, 2));
        var colorScale = getColorScale.call(_this, aestheticValues.colorValue);
        var aesthetics = getAesthetics.call(_this, aestheticValues, colorScale);
        return _objectSpread2(_objectSpread2({
          index: _this.metadata.id.findIndex(function (id) {
            return id.key === state.id;
          }),
          group: group,
          // array: data
          duration: duration,
          // number: total duration of individual
          noStateChange: noStateChange,
          // boolean: did individual ever change state?
          stateprevious: null,
          // object: datum at previous timepoint
          state: state,
          // object: datum at current timepoint
          transitTime: 0
        }, aestheticValues), {}, {
          // number/string, number, string: colorValue, sizeValue, shapeValue
          coordinates: coordinates,
          // object: { x, y }
          distance: distance,
          colorScale: colorScale
        }, aesthetics);
      }).entries(data);
      return grouped;
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

    function constant$1(x) {
      return function() {
        return x;
      };
    }

    function forceManyBodySampled() {
      var nodes,
          alpha,
          strength = constant$1(-30),
          strengths,
          indicesRepulse,
          prevIndex = 0,
          distanceMin2 = 1,
          distanceMax2 = Infinity,
          neighborSize = function () {
            return 15;
          },
          updateSize = function (nodes) { return Math.pow(nodes.length, 0.75); },
          sampleSize = function (nodes) { return Math.pow(nodes.length, 0.25); },
          numNeighbors,
          numUpdate,
          numSamples,
          chargeMultiplier = function (nodes) {
            return nodes.length < 100 ? 1 : nodes.length < 200 ? 3 : Math.sqrt(nodes.length);
          },
          cMult,
          rand = Math.random;

      function addRandomNode(node) {
        var randIdx = Math.floor(rand() * nodes.length),
            randNode = nodes[randIdx],
            randDist = (node.x - randNode.x) * (node.x - randNode.x) + (node.y - randNode.y) * (node.y - randNode.y),
            currIdx,
            currNode,
            currDist,
            maxI,
            maxDist = -Infinity,
            i = -1;

        // Is this already in the list?
        if (node.nearest.indexOf(randIdx) >= 0) return;

        // If there is room for another, add it.
        if (node.nearest.length < numNeighbors) {
          node.nearest.push(randIdx);
          return;
        }

        // Replace the farthest away "neighbor" with the new node.
        while (++i < node.nearest.length) {
          currIdx = node.nearest[i];
          currNode = nodes[currIdx];
          currDist = Math.hypot(node.x - currNode.x, node.y - currNode.y);
          if (currDist > maxDist) {
            maxI = i;
            maxDist = currDist;
          }
        }

        if (randDist < maxDist) {
          node.nearest[maxI] = randIdx;
        }
      }

      function getRandIndices(indices, num) {
        num = Math.floor(num);
        var i,
            n = nodes.length,
            cnt = n - num,
            randIdx,
            temp;

        // Choose random indices.
        for (i = n-1; i >= cnt; --i) {
          randIdx = Math.floor(rand() * i);
          temp = indices[randIdx];
          indices[randIdx] = indices[i];
          indices[i] = temp;
        }

        return indices.slice(cnt);
      }

      function approxRepulse(node) {
        var i,
            randIndices,
            currNode,
            w,
            x,
            y,
            l;

        // Choose random nodes to update.
        randIndices = getRandIndices(indicesRepulse, numSamples);

        for (i = randIndices.length - 1; i >= 0; --i) {
          currNode = nodes[randIndices[i]];

          if (currNode === node) continue;

          x = currNode.x - node.x;
          y = currNode.y - node.y;
          l = x * x + y * y;

          if (l >= distanceMax2) continue;

          // Limit forces for very close nodes; randomize direction if coincident.
          if (x === 0) x = (rand() - 0.5) * 1e-6, l += x * x;
          if (y === 0) y = (rand() - 0.5) * 1e-6, l += y * y;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);

          w = strengths[node.index] * alpha * cMult / l;
          node.vx += x * w;
          node.vy += y * w;
        }
      }

      function constantRepulse(node) {
        var i,
            nearest,
            currNode,
            w,
            x,
            y,
            l;

        // Update the list of nearest nodes.
        if (numNeighbors) addRandomNode(node);

        nearest = node.nearest;

        if (numNeighbors) for (i = nearest.length - 1; i >= 0; --i) {
          currNode = nodes[nearest[i]];

          if (currNode === node) continue;

          x = currNode.x - node.x;
          y = currNode.y - node.y;
          l = x * x + y * y;

          if (l >= distanceMax2) continue;

          // Limit forces for very close nodes; randomize direction if coincident.
          if (x === 0) x = (rand() - 0.5) * 1e-6, l += x * x;
          if (y === 0) y = (rand() - 0.5) * 1e-6, l += y * y;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);

          w = strengths[node.index] * alpha * cMult / l;
          node.vx += x * w;
          node.vy += y * w;
        }
      }

      function force(_) {
        var i = 0, j = prevIndex, n = nodes.length, upperIndex = prevIndex + numUpdate;
        for (alpha = _; i < n || j < upperIndex; ++i, ++j) {
          if (j < upperIndex) approxRepulse(nodes[j%n]);
          if (numNeighbors && i < n) constantRepulse(nodes[i]);
        }
        prevIndex = upperIndex % n;
      }

      function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, node;
        indicesRepulse = new Array(n);
        for (i = 0; i < n; ++i) indicesRepulse[i] = i;
        strengths = new Array(n);
        
        // Cannot be negative.
        numNeighbors = Math.min(Math.ceil(neighborSize(nodes)), n);
        numNeighbors = numNeighbors < 0 ? 0 : Math.min(numNeighbors, nodes.length);
        numUpdate = Math.ceil(updateSize(nodes));
        numUpdate = numUpdate < 0 ? 0 : Math.min(numUpdate, n);
        numSamples = Math.ceil(sampleSize(nodes));
        numSamples = numSamples < 0 ? 0 : Math.min(numSamples, n);

        cMult = chargeMultiplier(nodes);

        alpha = 1;
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          strengths[node.index] = +strength(node, i, nodes);
          node.nearest = [];
          while (node.nearest.length < numNeighbors) addRandomNode(node);
        }
      }

      force.initialize = function(_) {
        nodes = _;
        initialize();
      };

      force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : strength;
      };

      force.distanceMin = function(_) {
        return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
      };

      force.distanceMax = function(_) {
        return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
      };

      force.neighborSize = function(_) {
        return arguments.length ? (neighborSize = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : neighborSize;
      };

      force.updateSize = function(_) {
        return arguments.length ? (updateSize = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : updateSize;
      };

      force.sampleSize = function(_) {
        return arguments.length ? (sampleSize = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : sampleSize;
      };

      force.chargeMultiplier = function(_) {
        return arguments.length ? (chargeMultiplier = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : chargeMultiplier;
      };

      force.source = function(_) {
        return arguments.length ? (rand = _, force) : rand;
      };

      return force;
    }

    function circle(d) {
      this.layout.canvas.context.moveTo(d.x + d.size, d.y);
      this.layout.canvas.context.arc(d.x, d.y, d.value.size, 0, 2 * Math.PI);

      if (this.settings.fill) {
        this.layout.canvas.context.fillStyle = d.value.fill;
        this.layout.canvas.context.fill();
      }

      this.layout.canvas.context.strokeStyle = d.value.stroke;
      this.layout.canvas.context.stroke();
    }

    function square(d) {
      this.layout.canvas.context.rect(d.x - d.value.size, d.y - d.value.size, d.value.size * 2, d.value.size * 2);

      if (this.settings.fill) {
        this.layout.canvas.context.fillStyle = d.value.fill;
        this.layout.canvas.context.fill();
      }

      this.layout.canvas.context.strokeStyle = d.value.stroke;
      this.layout.canvas.context.stroke();
    }

    // TODO: use some kind of cos/sin shit to make a perfect equilateral triangle
    function triangle(d) {
      var ctx = this.layout.canvas.context;
      var side = d.value.size * 2; // * Math.sqrt(3)/6;

      var dist = side / Math.sqrt(3);
      var centroid = [d.x, d.y];
      var top = [d.x, d.y - dist];
      var left = [d.x - dist, d.y + dist];
      var right = [d.x + dist, d.y + dist];
      ctx.moveTo.apply(ctx, top);
      ctx.lineTo.apply(ctx, left);
      ctx.lineTo.apply(ctx, right);
      ctx.lineTo.apply(ctx, top);

      if (this.settings.fill) {
        this.layout.canvas.context.fillStyle = d.value.fill;
        this.layout.canvas.context.fill();
      }

      this.layout.canvas.context.strokeStyle = d.value.stroke;
      this.layout.canvas.context.stroke();
    }

    function diamond(d) {
      var ctx = this.layout.canvas.context;
      var halfWidth = d.value.size * Math.sqrt(2);
      ctx.moveTo(d.x, d.y - halfWidth);
      ctx.lineTo(d.x + halfWidth, d.y);
      ctx.lineTo(d.x, d.y + halfWidth);
      ctx.lineTo(d.x - halfWidth, d.y);
      ctx.lineTo(d.x, d.y - halfWidth);

      if (this.settings.fill) {
        this.layout.canvas.context.fillStyle = d.value.fill;
        this.layout.canvas.context.fill();
      }

      this.layout.canvas.context.strokeStyle = d.value.stroke;
      this.layout.canvas.context.stroke();
    }

    function star(d) {
      var ctx = this.layout.canvas.context;
      var spikes = 5;
      var step = Math.PI / spikes;
      var innerRadius = d.value.size * 0.75;
      var outerRadius = d.value.size * 1.5;
      var rot = Math.PI / 2 * 3;
      var x = d.x;
      var y = d.y;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y - outerRadius);

      for (var i = 0; i < spikes; i++) {
        x = d.x + Math.cos(rot) * outerRadius;
        y = d.y + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = d.x + Math.cos(rot) * innerRadius;
        y = d.y + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }

      ctx.lineTo(d.x, d.y - outerRadius);
      ctx.closePath(); //ctx.lineWidth = 5;

      ctx.strokeStyle = d.value.stroke;
      ctx.stroke();
      ctx.fillStyle = d.value.fill;
      ctx.fill();
    }

    // TODO: use some kind of cos/sin shit to make a perfect equilateral triangle
    function triangle$1(d) {
      var ctx = this.layout.canvas.context;
      var side = d.value.size * 2; // * Math.sqrt(3)/6;

      var dist = side / Math.sqrt(3);
      var centroid = [d.x, d.y];
      var top = [d.x, d.y + dist];
      var left = [d.x - dist, d.y - dist];
      var right = [d.x + dist, d.y - dist];
      ctx.moveTo.apply(ctx, top);
      ctx.lineTo.apply(ctx, left);
      ctx.lineTo.apply(ctx, right);
      ctx.lineTo.apply(ctx, top);

      if (this.settings.fill) {
        this.layout.canvas.context.fillStyle = d.value.fill;
        this.layout.canvas.context.fill();
      }

      this.layout.canvas.context.strokeStyle = d.value.stroke;
      this.layout.canvas.context.stroke();
    }

    function tick(data) {
      var _this = this;

      this.layout.canvas.context.clearRect(0, 0, this.settings.width.canvas, this.settings.height.main);
      this.layout.canvas.context.save();
      data.nested.sort(function (a, b) {
        return a.value.stateChanges - b.value.stateChanges;
      }) // draw bubbles with more state changes last
      .forEach(function (d, i) {
        _this.layout.canvas.context.beginPath();

        switch (d.value.shape) {
          case 'circle':
            circle.call(_this, d);
            break;

          case 'square':
            square.call(_this, d);
            break;

          case 'triangle':
            triangle.call(_this, d);
            break;

          case 'diamond':
            diamond.call(_this, d);
            break;

          case 'star':
            star.call(_this, d);
            break;

          case 'triangleDown':
            triangle$1.call(_this, d);
            break;

          default:
            circle.call(_this, d);
        }
      });
      this.layout.canvas.context.restore();
    }

    // forces (d3.forceX and d3.forceY) instead of the centering force (d3.forceCenter). The
    // positioning forces, unlike the centering force, prevent detached subgraphs from escaping
    // the viewport.
    //
    // https://observablehq.com/@d3/disjoint-force-directed-graph?collection=@d3/d3-force

    function addForceSimulation(data) {
      var _this = this;

      var forceSimulation = d3.forceSimulation().nodes(data.nested.filter(function (d) {
        return !(_this.settings.drawStaticSeparately && d.value.noStateChange);
      })).alphaDecay(0.01).velocityDecay(0.9).force('center', d3.forceCenter(d3.mean(data.nested, function (d) {
        return d.value.coordinates.x;
      }), d3.mean(data.nested, function (d) {
        return d.value.coordinates.y;
      }))) // cleared after first interval
      .force('x', d3.forceX().x(function (d) {
        return d.value.coordinates.x;
      }).strength(0.3)).force('y', d3.forceY().y(function (d) {
        return d.value.coordinates.y;
      }).strength(0.3)).force('charge', this.settings.manyBody === 'forceManyBodyReuse' ? forceManyBodyReuse().strength(this.settings.chargeStrength) : this.settings.manyBody === 'forceManyBodySampled' ? forceManyBodySampled().strength(this.settings.chargeStrength * this.metadata.id.length / 1000) : d3.forceManyBody().strength(this.settings.chargeStrength)).force('collide', d3.forceCollide().radius(function (d) {
        return d.value.size + _this.settings.collisionPadding;
      })).on('tick', tick.bind(this, data));
      return forceSimulation;
    }

    function progress() {
      // Update timepoint.
      this.layout.timepoint.text("".concat(this.settings.timepoint, " ").concat(this.settings.timepoint !== 1 ? this.settings.timeUnit + 's' : this.settings.timeUnit)); // Update timer.

      this.layout.progress.attr('title', "The animation is ".concat(d3.format('.1%')(this.settings.progress), " complete with ").concat(this.settings.duration - this.settings.timepoint, " ").concat(this.settings.timeUnit.split(' ')[0], " to go."));
      this.layout.timer.foreground.transition().duration(this.settings.speed).attrTween('d', this.util.arcTween(this.settings.progress * Math.PI * 2, this.layout.timer.arc));
      this.layout.timer.percentComplete.text(this.settings.progress < 0.0095 ? d3.format('.1%')(this.settings.progress) : d3.format('.0%')(this.settings.progress)); // Update timepoint control.

      this.controls.timepoint.inputs.property('value', this.settings.timepoint);
    }

    function legends(data) {
      // color legend
      if (this.settings.colorify && this.settings.colorBy.type === 'categorical') {
        var colorCounts = d3.nest().key(function (d) {
          return d.value.colorValue;
        }).rollup(function (group) {
          return group.length;
        }).entries(data.nested);
        this.legends.color.counts.text(function (d) {
          var colorCount = colorCounts.find(function (di) {
            return di.key === d;
          });
          var value = colorCount ? colorCount.value : 0;
          return d3.format(',d')(value);
        });
      } // shape legend


      if (this.settings.shapify && this.settings.shapeBy.type === 'categorical') {
        var shapeCounts = d3.nest().key(function (d) {
          return d.value.shapeValue;
        }).rollup(function (group) {
          return group.length;
        }).entries(data.nested);
        this.legends.shape.counts.text(function (d) {
          var shapeCount = shapeCounts.find(function (di) {
            return di.key === d;
          });
          var value = shapeCount ? shapeCount.value : 0;
          return d3.format(',d')(value);
        });
      }
    }

    // Update focus percentages.
    function counts() {
      var _this = this;

      if (this.settings.eventCount) this.focusAnnotations.selectAll('tspan.fdg-focus-annotation__event-count').text(function (d) {
        return _this.settings.eventCountType === 'cumulative-event' ? d.fmt.eventNumerator : d.fmt.idNumeratorPercent;
      });
      if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) this.metadata.event.forEach(function (event) {
        event.fociLabels.selectAll('text').text(function (d) {
          return _this.settings.eventCountType === 'cumulative-event' ? d.fmt.eventNumeratorPercent : d.fmt.idNumeratorPercent;
        });
      });
    }

    // Update frequency table.
    function freqTable$1() {
      var main = this;
      var maxProportion = d3.max(this.layout.freqTable.tr.data(), function (d) {
        return d.freqs.idProportion;
      });
      this.layout.freqTable.tr.each(function (d) {
        var relativeProportion = d.freqs.idProportion / maxProportion;
        var relativeProportionFmt = d3.format('.1%')(relativeProportion);
        var tr = d3.select(this);
        tr.selectAll('td').data(d.cells).join('td').style('background', function (di, i) {
          return di.key === 'id' && main.settings.freqTable.bars ? "linear-gradient(to right, var(--background-darkest) 0, var(--background-darkest) ".concat(relativeProportionFmt, ", transparent ").concat(relativeProportionFmt, ")") : null;
        }).text(function (d) {
          return d.value;
        });
      });
    }

    function text(data) {
      var main = this;
      this.settings.progress = this.settings.stateChange === 'ordered' ? (this.settings.timepoint - 1) / (this.settings.duration - 1) // progress > 0 for first timepoint of first sequence - annoying
      : this.settings.timepoint / this.settings.duration;
      progress.call(this);
      legends.call(this, data);
      counts.call(this);
      freqTable$1.call(this); // Display timed annotations.

      if (this.settings.annotations && Array.isArray(this.settings.annotations)) this.customAnnotations.filter(function (d) {
        return d.timepoint <= main.settings.timepoint && +d3.select(this).attr('opacity') === 0;
      }).transition().duration(this.settings.modalSpeed / 2).attr('opacity', 1);
    }

    function updateText() {
      var _this = this;

      if (this.settings.timepoint < this.settings.duration) {
        if (this.prevEvent === undefined || this.currEvent.orbitLabel !== this.prevEvent.orbitLabel) {
          this.layout.sequenceOverlay.background.sequence.style('opacity', 1).transition().duration(this.settings.modalSpeed / 5).style('opacity', 0).on('end', function () {
            _this.layout.sequenceOverlay.background.sequence.html(_this.currEvent.orbitLabel || _this.currEvent.key).style('opacity', 0).transition().duration(_this.settings.modalSpeed / 5).style('opacity', 1);
          });
          this.layout.sequenceOverlay.foreground.sequence.style('opacity', 1).transition().duration(this.settings.modalSpeed / 5).style('opacity', 0).on('end', function () {
            _this.layout.sequenceOverlay.foreground.sequence.html(_this.currEvent.orbitLabel || _this.currEvent.key).style('opacity', 0).transition().duration(_this.settings.modalSpeed / 5).style('opacity', 1);
          });
        }

        if (this.currEvent.orbitLabel && this.currEvent.key) {
          this.layout.sequenceOverlay.background.event.style('opacity', 1).transition().duration(this.settings.modalSpeed / 5).style('opacity', 0).on('end', function () {
            _this.layout.sequenceOverlay.background.event.html(_this.currEvent.key).style('opacity', 0).transition().duration(_this.settings.modalSpeed / 5).style('opacity', 1);
          });
          this.layout.sequenceOverlay.foreground.event.style('opacity', 1).transition().duration(this.settings.modalSpeed / 5).style('opacity', 0).on('end', function () {
            _this.layout.sequenceOverlay.foreground.event.html(_this.currEvent.key).style('opacity', 0).transition().duration(_this.settings.modalSpeed / 5).style('opacity', 1);
          });
        }
      } else {
        this.layout.sequenceOverlay.background.sequence.style('opacity', 1).transition().duration(this.settings.modalSpeed / 5).style('opacity', 0).on('end', function () {
          return _this.layout.sequenceOverlay.background.sequence.html(null);
        });
        this.layout.sequenceOverlay.foreground.sequence.style('opacity', 1).transition().duration(this.settings.modalSpeed / 5).style('opacity', 0).on('end', function () {
          return _this.layout.sequenceOverlay.foreground.sequence.html(null);
        });
        this.layout.sequenceOverlay.background.event.style('opacity', 1).transition().duration(this.settings.modalSpeed / 5).style('opacity', 0).on('end', function () {
          return _this.layout.sequenceOverlay.background.event.html(null);
        });
        this.layout.sequenceOverlay.foreground.event.style('opacity', 1).transition().duration(this.settings.modalSpeed / 5).style('opacity', 0).on('end', function () {
          return _this.layout.sequenceOverlay.foreground.event.html(null);
        });
      }
    }

    function timeoutBetweenStates() {
      var _this = this;

      if (this.settings.stateChange === 'ordered') {
        var _this$currEvent;

        this.prevEvent = this.currEvent;
        this.currEvent = this.metadata.event.find(function (event) {
          return event.start_timepoint <= _this.settings.timepoint && _this.settings.timepoint <= event.end_timepoint;
        });

        if (this.settings.timepoint === ((_this$currEvent = this.currEvent) === null || _this$currEvent === void 0 ? void 0 : _this$currEvent.start_timepoint)) {
          this.interval.stop();
          updateText.call(this); // Skip timeout before first state.

          if (this.prevEvent !== undefined) this.timeout = d3.timeout(function () {
            _this.interval = startInterval.call(_this, _this.data);
          }, this.settings.modalSpeed);else this.interval = startInterval.call(this, this.data);
        }
      }
    }

    function orbits() {
      var main = this; //if (this.settings.pulseOrbits) {

      this.orbits.each(function (d) {
        d.rAdjPrev = d.rAdj;
        var distances = d3.merge(d.values.map(function (di) {
          return di.data;
        })).map(function (d) {
          return d.value.distance;
        });
        var rAdj = distances.length ? Math.max(d3.median(distances), d.r) : d.r;
        var diff = rAdj - d.rAdjPrev;
        d.rAdj = isNaN(diff) ? d.rAdjPrev : d.rAdjPrev + Math.min(diff / 10, main.settings.orbitRadius / 100); //d.change = d3.sum(d.values, (di) => di.change);
        //if (d.change > 0) {
        //if (!isNaN(d.rAdj))

        d3.select(this).transition().duration(main.settings.speeds[main.settings.speed]).attr('r', d.rAdj); //.duration(main.settings.speeds[main.settings.speed] / 2)
        //.attr('stroke-width', 0.5 * d.change)
        //.transition()
        //.duration(main.settings.speeds[main.settings.speed] / 2)
        //.attr('stroke-width', 0.5);
        //}
      }); //}
    }

    function update$1(data$1) {
      // Update the node data.
      data.call(this, data$1); // Gradually transition the radius of the orbits to match the median position of the nodes
      // along each orbit.  As the nodes at each focus influence the position of nodes at other foci,
      // nodes gradually congregate off their orbit.

      orbits.call(this); // Update timer, focus labels, and annotations.

      text.call(this, data$1);
    }

    function countdown() {
      var _this = this;

      var counter = this.settings.resetDelay / 1000 - 1;
      this.layout.countdown.classed('fdg-invisible', false).classed('fdg-hidden', function (d) {
        return d !== counter;
      });
      var interval = d3.interval(function () {
        counter--;

        _this.layout.countdown.classed('fdg-hidden', function (d) {
          return d !== counter;
        });
      }, 1000);
      return interval;
    }

    function fadeOut$1(modalSpeed) {
      // Transition text from full opacity to zero opacity to create fade-out effect.
      d3.select(this).transition().duration(modalSpeed / 15).delay(modalSpeed - modalSpeed / 15 * 2).style('opacity', 0);
    }

    function fadeIn$1(selection, modalSpeed) {
      // Transition text from zero opacity to full opacity to create fade-in effect.
      selection.style('opacity', 0).transition().duration(modalSpeed / 15).style('opacity', 1).on('end', function () {
        fadeOut$1.call(this, modalSpeed);
      });
    }

    function emphasizeComponent(component) {
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'outline';
      var value1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'thick groove rgba(215,25,28,0)';
      var value2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'thick groove rgba(215,25,28,.5)';
      var duration = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      if (duration) component.style(style, value1).transition().duration(this.settings.modalSpeed / 15).style(style, value2).transition().duration(this.settings.modalSpeed / 15).delay(this.settings.modalSpeed - this.settings.modalSpeed / 15 * 2).style(style, value1).on('end', function () {
        return component.style(style, null);
      });else {
        component.style(style, value2);
        d3.timeout(function () {
          component.style(style, null);
        }, this.settings.modalSpeed);
      }
    }

    function update$2() {
      this.modalText = this.settings.text[this.settings.modalIndex];
      if (this.settings.modalIndex === this.settings.text.length - 1 && this.modal) this.modal.stop(); // Update modal text.

      this.layout.modal.html(this.modalText).call(fadeIn$1, this.settings.modalSpeed); // Highlight referenced component.

      switch (true) {
        case /time/i.test(this.modalText):
          emphasizeComponent.call(this, this.layout.progress); //emphasizeComponent.call(this, this.focusAnnotations);

          break;

        case /annotations/i.test(this.modalText):
          emphasizeComponent.call(this, this.layout.focusAnnotations.selectAll('.fdg-focus-annotation__event-count'));
          break;

        case /number of events.*color/i.test(this.modalText):
          emphasizeComponent.call(this, this.legends.color);
          break;

        case /number of events.*size/i.test(this.modalText):
          emphasizeComponent.call(this, this.legends.size);
          break;

        case /static/i.test(this.modalText):
          // Style static bubbles differently than components.
          emphasizeComponent.call(this, this.layout.svgBackground.selectAll('.fdg-static__mark'), 'stroke', 'rgba(215,25,28,0)', 'rgba(215,25,28,.5)', false);
          break;

        case /controls/i.test(this.modalText):
          if (this.settings.hideControls === false) emphasizeComponent.call(this, this.layout.controlsContainer.classed('fdg-hidden', this.settings.hideControls));
          break;
      }
    }

    function runModal() {
      var _this = this;

      // Set initial modal text.
      update$2.call(this);
      this.modal = d3.interval(function () {
        _this.settings.modalIndex++; // Update modal text.

        update$2.call(_this);
      }, this.settings.modalSpeed);
    }

    function resetAnimation(data) {
      var _this = this;

      this.settings.timepoint = 0;
      this.settings.progress = 0;
      this.settings.modalIndex = 0;
      this.controls.timepoint.inputs.attr('value', 0);

      if (this.settings.runSequences) {
        this.settings.sequenceIndex = 0;
        this.settings.eventIndex = 0;
        this.sequence = getNextSequence.call(this, false);
      } // Update the event object of the population.


      this.metadata.event.forEach(function (event) {
        event.prevCount = 0;
        event.count = 0;
        event.cumulative = 0;
        event.ids = new Set();
        event.nIds = 0;
        event.idsCumulative = new Set();
        event.nIdsCumulative = 0;
      });
      data.nested.forEach(function (d) {
        d.value.statePrevious = null;
        d.value.state = getState.call(_this, d.value.group);
        var aestheticValues = getAestheticValues.call(_this, d.value.group, d.value.state);
        d.value.coordinates = getCoordinates.call(_this, d.value.state, aestheticValues.colorValue);
        d.value.colorScale = getColorScale.call(_this, aestheticValues.colorValue);
        var aesthetics = getAesthetics.call(_this, aestheticValues, d.value.colorScale);
        Object.assign(d.value, aestheticValues, aesthetics);
      });
      if (this.modal) this.modal.stop();
      runModal.call(this); // Display timed annotations.

      if (this.settings.annotations && Array.isArray(this.settings.annotations)) this.customAnnotations.attr('opacity', function (d) {
        return d.timepoint > _this.settings.timepoint ? 0 : 1;
      });
    }

    function timeout(data, countdown) {
      var _this = this;

      if (this.timeout) this.timeout.stop();
      var timeout = d3.timeout(function () {
        resetAnimation.call(_this, data);
        progress.call(_this);
        countdown.stop();
        timeout.stop();

        _this.layout.countdown.classed('fdg-invisible', function (d) {
          return d === _this.settings.resetDelay / 1000 - 1;
        }).classed('fdg-hidden', function (d) {
          return d !== _this.settings.resetDelay / 1000 - 1;
        });

        _this.interval = startInterval.call(_this, data);
      }, this.settings.resetDelay);
      return timeout;
    }

    function reset(data) {
      this.interval.stop(); // Reheat the animation one last time so marks reach to their final destination.

      restartForceSimulation.call(this); // Display a visual countdown to reset.

      var countdown$1 = countdown.call(this); // Set a timeout before resetting the animation.

      this.timeout = timeout.call(this, data, countdown$1);
    }

    function getNextEventInSequence() {
      var _this = this;

      this.sequence.eventIndex++;
      var event = this.sequence.events.find(function (event, i) {
        return i === _this.sequence.eventIndex;
      });
      fadeOut.call(this, this.layout.sequenceOverlay.background.event);
      fadeOut.call(this, this.layout.sequenceOverlay.foreground.event);
      return event;
    }

    function fadeOutAll() {
      fadeOut.call(this, this.layout.sequenceOverlay.background.sequence);
      fadeOut.call(this, this.layout.sequenceOverlay.foreground.sequence);
      fadeOut.call(this, this.layout.sequenceOverlay.background.event);
      fadeOut.call(this, this.layout.sequenceOverlay.foreground.event);
    }

    function runNextSequence() {
      // Stop interval.
      if (this.interval) this.interval.stop(); // While sequences remain run next sequence.

      if (this.settings.sequenceIndex < this.settings.sequences.length - 1 || this.sequence.events && this.sequence.eventIndex < this.sequence.events.length - 1) {
        // Get sequence.
        if (this.sequence.eventIndex === this.sequence.events.length - 1) this.sequence = getNextSequence.call(this);else this.sequence.event = getNextEventInSequence.call(this); // Run sequence.

        this.timeout = runSequence.call(this);
      } // Otherwise clear sequence text.
      else fadeOutAll.call(this);
    }

    var increment = function increment(data, _increment) {
      var _this = this;

      // Increment timepoint.
      this.settings.timepoint += !!_increment; // Update speed.

      if (Array.isArray(this.settings.speedChange) && this.settings.speedChange.map(function (speed) {
        return speed.timepoint;
      }).includes(this.settings.timepoint)) {
        this.settings.speed = this.settings.speedChange.find(function (speed) {
          return speed.timepoint === _this.settings.timepoint;
        }).speed;
        if (!!this.interval) this.interval.stop();
        this.interval = startInterval.call(this, this.sequence ? this.sequence.data : this.data);
      } // Update focus label.


      if (Array.isArray(this.settings.eventFocusLabelChange) && this.settings.eventFocusLabelChange.map(function (change) {
        return change.timepoint;
      }).includes(this.settings.timepoint)) {
        var eventFocusLabelChange = this.settings.eventFocusLabelChange.find(function (change) {
          return change.timepoint === _this.settings.timepoint;
        });
        var focusAnnotation = this.focusAnnotations.filter(function (d) {
          return d.key === eventFocusLabelChange.old_label;
        }).selectAll('.fdg-focus-annotation__label tspan').text(eventFocusLabelChange.new_label);
      }

      timeoutBetweenStates.call(this); // Update animation if current timepoint is less than full duration of animation.

      if (this.settings.timepoint <= this.settings.duration) update$1.call(this, data); // Otherwise if animation is sequenced, run next sequence.
      else if (this.sequence) runNextSequence.call(this); // Otherwise restart animation.
        else if (this.settings.loop === true) reset.call(this, data); // Reheat the force simulation.

      restartForceSimulation.call(this);
    }; // Default returns an interval that runs increment() every time unit.

    function startInterval(data) {
      var interval = d3.interval(increment.bind(this, data), this.settings.speeds[this.settings.speed]);
      return interval;
    }

    // TODO: figure out how to make this function work from the UI as well as automatically with the flow of the animation
    // TODO: modularize this function with declaritive subfunctions
    // TODO: separate mid-sequence updates from new sequence updates

    function runSequence() {
      var _this = this;

      // Update the sequence button corresponding to the current sequence.
      this.controls.sequences.inputs.classed('fdg-button--current', function (d) {
        return d.label === _this.sequence.label;
      }); //const start_orbit = this.metadata.orbit
      //    .find((orbit) => +orbit.key === this.sequence.start_order);
      //this.sequence.events = start_orbit.values;

      this.sequence.event = this.sequence.events.find(function (event, i) {
        return i === _this.sequence.eventIndex;
      }); // Update progress text.

      this.settings.timepoint = 0;
      this.layout.timepoint.html('0 days');
      this.layout.timer.percentComplete.html('0%'); // TODO: transition text in and out

      if (this.sequence.eventIndex === 0) {
        this.layout.timeRelative.html(this.sequence.timeRelative || this.settings.timeRelative); // fade in

        this.sequence.backgroundSequence = fadeIn.call(this, this.layout.sequenceOverlay.background.sequence, this.sequence.label);
        this.sequence.foregroundSequence = fadeIn.call(this, this.layout.sequenceOverlay.foreground.sequence, this.sequence.label);
      } // fade in


      this.sequence.backgroundEvent = fadeIn.call(this, this.layout.sequenceOverlay.background.event, "".concat(this.settings.individualUnit.replace(/^(.)/, function (_char) {
        return _char.toUpperCase();
      }), "s: ").concat(this.sequence.event.key));
      this.sequence.foregroundEvent = fadeIn.call(this, this.layout.sequenceOverlay.foreground.event, "".concat(this.settings.individualUnit.replace(/^(.)/, function (_char2) {
        return _char2.toUpperCase();
      }), "s: ").concat(this.sequence.event.key)); // Subset data to the specified set of states.

      if (this.sequence.eventIndex === 0) this.sequence.data = this.data.filter(function (d) {
        return _this.sequence.start_order <= d.event_order && d.event_order <= _this.sequence.end_order;
      }).map(function (d) {
        return _objectSpread2({}, d);
      });

      if (this.sequence.eventIndex === 0) {
        // Re-calculate start and end timepoints from first state in sequence.
        d3.nest().key(function (d) {
          return d.id;
        }).rollup(function (group) {
          var baseline = group[0]; // first state in sequence

          var timeShift = baseline.start_timepoint; // Track cumulative duration to send individuals to the final state in the sequence prematurely.

          var duration_cumulative = 0;
          group.forEach(function (d, i) {
            duration_cumulative += d.duration;
            d.duration_cumulative = duration_cumulative; // Adjust start and end timepoint.

            d.start_timepoint = d === baseline ? 1 : d.start_timepoint - timeShift + 1;
            d.end_timepoint = d.start_timepoint + d.duration - 1; // Set start timepoint to sequence duration if start timepoint is greater than sequence duration.

            if (!!_this.sequence.duration && d.start_timepoint > _this.sequence.duration) d.start_timepoint = _this.sequence.duration; // Set end timepoint to sequence duration if end timepoint is greater than sequence duration.

            if (!!_this.sequence.duration && d.end_timepoint > _this.sequence.duration) d.end_timepoint = _this.sequence.duration;
          });
          return group;
        }).entries(this.sequence.data);
      } // Re-define nested data with sequence subset.
      // TODO: define a function to maintain state of nodes through animation, e.g. when changing
      // animation track between full animation and sequences or resetting the animation


      if (this.sequence.eventIndex === 0) {
        this.sequence.data.nested = structure.call(this, this.sequence.data);
        this.sequence.data.nested.forEach(function (d) {
          var node = _this.nodes.find(function (node) {
            return node.key === d.key;
          });

          for (var prop in node) {
            if (['key', 'value'].includes(prop) === false) d[prop] = node[prop];
          }
        });
      } // Lock nodes in place while another event sequence runs.


      this.sequence.data.nested.forEach(function (d) {
        d.value.locked = d.value.state.event !== _this.sequence.event.key;
      });
      var duration = d3.max(this.sequence.data.nested.filter(function (d) {
        return d.value.locked === false;
      }), function (d) {
        return d.value.state.duration;
      }) + 1;
      this.settings.duration = this.sequence.duration ? Math.min(this.sequence.duration, duration) : duration; // Re-define force simulation.

      if (this.forceSimulation) this.forceSimulation.stop();
      this.forceSimulation = addForceSimulation.call(this, this.sequence.data);
      this.nodes = this.forceSimulation.nodes();
      this.forceSimulation.force('center', null);
      data.call(this, this.sequence.data);
      text.call(this, this.sequence.data); // Stop the current animation

      if (this.interval) this.interval.stop(); // Start the sequence animation.

      var timeout = d3.timeout(function () {
        _this.interval = startInterval.call(_this, _this.sequence.data);
      }, this.settings.modalSpeed);
      return timeout;
    }

    function sequence(d) {
      var _this = this;

      this.settings.animationTrack = 'sequence';
      this.layout.sequenceOverlay.classed('fdg-hidden', false);
      this.settings.sequenceIndex = this.settings.sequences.findIndex(function (sequence) {
        return sequence === d;
      });
      this.sequence = getNextSequence.call(this, false);
      this.sequence.eventIndex = 0;
      this.timeout = d3.timeout(function () {
        runSequence.call(_this);
      }, 1000);
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

      // Toggle setting.
      this.settings.playPause = playPause.find(function (value) {
        return value.action !== _this.settings.playPause;
      }).action; // Update tooltip and display text.

      this.controls.playPause.inputs.attr('title', "".concat(playPause.find(function (value) {
        return value.action !== _this.settings.playPause;
      }).label, " animation")).html(playPause.find(function (value) {
        return value.action !== _this.settings.playPause;
      }).html); // Stop animation.

      if (this.interval) this.interval.stop(); // Restart animation.

      if (this.settings.playPause === 'play') this.interval = startInterval.call(this, this.sequence ? this.sequence.data : this.data);
    }

    function fullAnimation(d) {
      var _this = this;

      console.log('full animation');
      this.settings.animationTrack = 'full'; // Update settings.

      this.settings.duration = this.settings_initial.duration;
      this.settings.loop = this.settings_initial.loop; // Update text.

      this.layout.sequenceOverlay.classed('fdg-hidden', true);
      this.layout.timeRelative.html(this.settings_initial.timeRelative); // Stop current interval and force simulation.

      if (this.interval) this.interval.stop();
      if (this.forceSimulation) this.forceSimulation.stop(); // Restart force simulation.

      this.forceSimulation = addForceSimulation.call(this, this.data); // Reset animation.

      resetAnimation.call(this, this.data); // Restart interval.

      this.timeout = d3.timeout(function () {
        _this.interval = startInterval.call(_this, _this.data);
      }, 1000); // Play animation.

      if (this.settings.playPause !== 'play') toggle.call(this);
    }

    function sequences() {
      var _this = this;

      if (!!this.settings.sequences) {
        var main = this;
        var container = this.util.addElement('sequences', this.layout.controls).classed('fdg-control fdg-control--sequences', true);
        var inputs = container.selectAll('div').data([this].concat(_toConsumableArray(this.settings.sequences))).join('div').classed('fdg-button fdg-button--sequence', true).attr('title', function (d) {
          return "View ".concat(d !== _this ? "sequence ".concat(d.label) : 'full animation', ".");
        }).text(function (d, i) {
          return d.label ? d.label : d === _this ? 'Full Animation' : "Sequence ".concat(i + 1);
        });
        inputs.on('click', function (d) {
          // Toggle control.
          inputs.classed('fdg-button--current', false);
          this.classList.toggle('fdg-button--current'); // Stop any running interval or timeout.

          if (main.interval) main.interval.stop();
          if (main.timeout) main.timeout.stop(); // TODO: figure out if force simulation should be maintained or if it's sufficient to
          // maintain the position of nodes on the nexted data array.
          //if (main.forceSimulation) main.forceSimulation.stop();
          // Update sequence property.

          delete main.sequence;
          main.sequence = d !== main ? d : null; // Run sequence or...

          if (d !== main) sequence.call(main, d); // ...full animation.
          else fullAnimation.call(main, d);
        });
        return {
          container: container,
          inputs: inputs
        };
      }
    }

    function stepSequences() {
      if (!!this.settings.sequences) {
        var container = this.util.addElement('sequences', this.layout.controls).classed('fdg-control fdg-control--step-sequences', true);
        var inputs = container.selectAll('div').data(['<<', '>>']).join('div').classed('fdg-button fdg-button--step-sequence', true).attr('title', function (d) {
          return d === '<<' ? 'View previous sequence.' : 'View next sequence.';
        }).style('width', '35%').style('float', function (d, i) {
          return i === 0 ? 'left' : 'right';
        }).text(function (d, i) {
          return d;
        });
        inputs.on('click', function (d) {});
        return {
          container: container,
          inputs: inputs
        };
      }
    }

    function speed() {
      var _this = this;

      var main = this;
      var container = this.controls.container.append('div').classed('fdg-control fdg-control--speed', true);
      var inputs = container.selectAll('div').data(Object.keys(this.settings.speeds).map(function (key) {
        return {
          label: key,
          value: _this.settings.speeds[key]
        };
      })).enter().append('div').attr('class', function (d) {
        return "fdg-button ".concat(d.label, " ").concat(d.label === _this.settings.speed ? 'fdg-button--current' : '');
      }).attr('title', function (d) {
        return "Advance the animation every ".concat(_this.settings.speeds[d.label] / 1000, " second(s).");
      }).text(function (d) {
        return d.label;
      });
      inputs.on('click', function (d) {
        main.settings.speed = d.label;
        inputs.classed('fdg-button--current', function (di) {
          return di.label === d.label;
        });

        if (main.settings.playPause === 'play') {
          if (!!main.interval) main.interval.stop();
          main.interval = startInterval.call(main, main.sequence ? main.sequence.data : main.data);
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
        if (_this.timeout) _this.timeout.stop();
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

    function timepoint() {
      var _this = this;

      var main = this;
      var container = this.controls.container.append('div').classed('fdg-control fdg-control--timepoint', true).classed('fdg-hidden', this.settings.stateChange === 'ordered');
      var inputs = container.append('div').classed("fdg-button fdg-input", true).append('input').attr('type', 'number').attr('title', "Choose a timepoint.").attr('value', +this.settings.timepoint).attr('min', 1).attr('max', this.settings.duration);
      inputs.on('click', function () {
        // Pause simulation.
        if (_this.settings.playPause !== 'pause') toggle.call(_this);
      });
      inputs.on('change', function () {
        // Pause simulation.
        if (main.settings.playPause !== 'pause') toggle.call(main);
        main.settings.timepoint = +this.value - 1;
        increment.call(main, main.sequence ? main.sequence.data : main.data, true);
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
        if (_this.timeout) _this.timeout.stop();
        if (_this.interval) _this.interval.stop(); // TODO: why isn't this handled in resetAnimation?

        if (_this.settings.runSequences) {
          _this.settings.sequences.forEach(function (sequence) {
            sequence.eventIndex = 0;
          });

          _this.settings.sequenceIndex = 0;
          _this.sequence = getNextSequence.call(_this, false);
        }

        resetAnimation.call(_this, _this.settings.animationTrack === 'sequence' ? _this.sequence.data : _this.data);
        if (_this.forceSimulation) _this.forceSimulation.stop(); // Restart force simulation.

        _this.forceSimulation = addForceSimulation.call(_this, _this.settings.animationTrack === 'sequence' ? _this.sequence.data : _this.data); // Start the animation.

        if (_this.settings.playPause === 'play') _this.timeout = d3.timeout(function () {
          // Run first sequence.
          if (_this.settings.animationTrack === 'sequence') runSequence.call(_this); // calls startInterval
          // Run full animation.
          else _this.interval = startInterval.call(_this, _this.data);
        }, 1000 // this.settings.delay ? this.settings.modalSpeed : 0
        );
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function eventList() {
      var _this = this;

      var container, inputs;

      if (this.settings.colorBy.type === 'frequency' || this.settings.sizeBy.type === 'frequency') {
        var main = this;
        container = this.controls.container.append('div').classed('fdg-control fdg-control--event-list', true);
        inputs = container.selectAll('div').data(this.metadata.event).enter().append('div').attr('class', function (d) {
          return "fdg-button ".concat(_this.settings.eventChangeCount.includes(d.key) ? 'fdg-button--current' : '');
        }).attr('title', function (d) {
          return "".concat(_this.settings.eventChangeCount.includes(d.key) ? 'Remove' : 'Add', " ").concat(d.key, " ").concat(_this.settings.eventChangeCount.includes(d.key) ? 'from' : 'to', " the list of events that control bubble ").concat(_this.settings.colorBy.type === 'frequency' && _this.settings.sizeBy.type === 'frequency' ? 'color and size' : _this.settings.colorBy.type === 'frequency' ? 'color' : _this.settings.sizeBy.type === 'frequency' ? 'size' : "[ something isn't right here ].", ".");
        }).text(function (d) {
          return d.key;
        });
        inputs.on('click', function (d) {
          var _this2 = this;

          this.classList.toggle('fdg-button--current'); // Update event array.

          if (main.settings.eventChangeCount.includes(this.textContent)) main.settings.eventChangeCount.splice(main.settings.eventChangeCount.findIndex(function (event) {
            return event === _this2.textContent;
          }), 1);else main.settings.eventChangeCount.push(this.textContent); // Update tooltip.

          this.title = "".concat(main.settings.eventChangeCount.includes(d.key) ? 'Remove' : 'Add', " ").concat(d.key, " ").concat(main.settings.eventChangeCount.includes(d.key) ? 'from' : 'to', " the list of events that control bubble ").concat(main.settings.colorBy.type === 'frequency' && main.settings.sizeBy.type === 'frequency' ? 'color and size' : main.settings.colorBy.type === 'frequency' ? 'color' : main.settings.sizeBy.type === 'frequency' ? 'size' : "[ something isn't right here ].", "."); // Update color-size toggle.
          //main.controls.colorSizeToggle.inputs.attr(
          //    'title',
          //    (di) =>
          //        `Quantify the number of ${main.util.csv(main.settings.eventChangeCount)} events by ${
          //            di !== 'both' ? di : 'color and size'
          //        }.`
          //);
          // Update legend label.

          main.legends.container.classed('fdg-invisible', main.settings.eventChangeCount.length === 0).selectAll('span.fdg-measure').text(main.util.csv(main.settings.eventChangeCount));
          increment.call(main, main.data, false);
        });
      }

      return {
        container: container,
        inputs: inputs
      };
    }

    function addControls() {
      this.controls = {
        container: this.layout.controlsContainer
      };
      this.controls.display = display.call(this);
      this.controls.playPause = playPause$1.call(this);
      this.controls.timepoint = timepoint.call(this);
      this.controls.sequences = sequences.call(this);
      this.controls.stepSequences = stepSequences.call(this);
      this.controls.speed = speed.call(this);
      this.controls.reset = reset$1.call(this);
      this.controls.eventList = eventList.call(this); // Capture all controls in a selection.

      this.controls.containers = this.controls.container.selectAll('.fdg-control'); // Capture all buttons in a selection.

      this.controls.buttons = this.controls.container.selectAll('.fdg-button'); // Add interactivity to buttons.

      this.controls.container.selectAll('.fdg-button').on('mousedown', function () {
        this.classList.toggle('fdg-button--clicked');
      }).on('mouseup', function () {
        this.classList.toggle('fdg-button--clicked');
      }).on('mouseout', function () {
        if (this.classList.contains('fdg-button--clicked')) this.classList.toggle('fdg-button--clicked');
      });
      this.controls.containers.each(function () {
        this.classList.toggle('fdg-control--collapsed');
      });
    }

    function color$1(svg, legendDimensions) {
      var _this = this;

      var marks = svg.selectAll('rect.legend-mark').data(this.scales.color.range()).enter().append('rect').classed('legend-mark', true).attr('x', function (d, i) {
        return i * (legendDimensions[0] / _this.settings.colorBy.nColors);
      }).attr('y', 0).attr('width', legendDimensions[0] / this.settings.colorBy.nColors).attr('height', legendDimensions[1] / 3).attr('fill', function (d) {
        return d;
      }).attr('fill-opacity', 0.5).attr('stroke', function (d) {
        return d;
      }).attr('stroke-opacity', 1);
      return marks;
    }

    function size$1(svg, legendDimensions) {
      var _this = this;

      var marks = svg.selectAll('circle.legend-mark').data(d3.range(this.settings.colorBy.nColors)).join(this.settings.shape === 'circle' ? 'circle' : 'rect').classed('legend-mark', true).attr('fill', function (d) {
        return '#aaa';
      }).attr('fill-opacity', 0.5).attr('stroke', function (d) {
        return '#aaa';
      }).attr('stroke-opacity', 1);
      if (this.settings.shape === 'circle') marks.attr('cx', function (d, i) {
        return i * (legendDimensions[0] / _this.settings.colorBy.nColors) + legendDimensions[0] / _this.settings.colorBy.nColors / 2;
      }).attr('cy', legendDimensions[1] / 4).attr('r', function (d, i) {
        return i + _this.settings.minRadius;
      });else if (this.settings.shape === 'square') marks.attr('x', function (d, i) {
        return i * (legendDimensions[0] / _this.settings.colorBy.nColors) + legendDimensions[0] / _this.settings.colorBy.nColors / 2 - (i + _this.settings.minRadius);
      }).attr('y', function (d, i) {
        return legendDimensions[1] / 4 - (i + _this.settings.minRadius);
      }).attr('width', function (d, i) {
        return (i + _this.settings.minRadius) * 2;
      }).attr('height', function (d, i) {
        return (i + _this.settings.minRadius) * 2;
      });
      return marks;
    }

    function both(svg, legendDimensions) {
      var _this = this;

      var marks = svg.selectAll('circle.legend-mark').data(this.scales.color.range()).join(this.settings.shape === 'circle' ? 'circle' : 'rect').classed('legend-mark', true).attr('fill', function (d) {
        return d;
      }).attr('fill-opacity', 0.5).attr('stroke', function (d) {
        return d;
      }).attr('stroke-opacity', 1);
      if (this.settings.shape === 'circle') marks.attr('cx', function (d, i) {
        return i * (legendDimensions[0] / _this.settings.colorBy.nColors) + legendDimensions[0] / _this.settings.colorBy.nColors / 2;
      }).attr('cy', legendDimensions[1] / 4).attr('r', function (d, i) {
        return i + _this.settings.minRadius;
      });else if (this.settings.shape === 'square') marks.attr('x', function (d, i) {
        return i * (legendDimensions[0] / _this.settings.colorBy.nColors) + legendDimensions[0] / _this.settings.colorBy.nColors / 2 - (i + _this.settings.minRadius);
      }).attr('y', function (d, i) {
        return legendDimensions[1] / 4 - (i + _this.settings.minRadius);
      }).attr('width', function (d, i) {
        return (i + _this.settings.minRadius) * 2;
      }).attr('height', function (d, i) {
        return (i + _this.settings.minRadius) * 2;
      });
      return marks;
    }

    var makeLegendMarks = {
      color: color$1,
      size: size$1,
      both: both
    };

    function makeLegend(type) {
      var legendDimensions = [200, 50]; // container

      var container = this.legends.container.append('div'); // label

      var label = container.append('div').classed('fdg-sidebar__label fdg-legend__label', true).html("Number of events" //`Number of <span class = "fdg-measure">${this.util.csv(
      //    this.settings.eventChangeCount
      //)}</span> events`
      ); // svg

      var svg = container.append('svg').attr('width', legendDimensions[0]).attr('height', legendDimensions[1]).append('g').attr('transform', "translate(".concat(this.legends.svgWidth / 2 - this.legends.radius - 6, ",0)")); // marks

      var marks = makeLegendMarks[type].call(this, svg, legendDimensions); // lower end of scale

      var lower = svg.append('text').attr('x', legendDimensions[0] / this.settings.colorBy.nColors / 2).attr('y', legendDimensions[1] / 2 + 16).attr('text-anchor', 'middle').html('0'); // upper end of scale

      var upper = svg.append('text').attr('x', legendDimensions[0] - legendDimensions[0] / this.settings.colorBy.nColors / 2).attr('y', legendDimensions[1] / 2 + 16).attr('text-anchor', 'middle').html("".concat(this.settings.colorBy.nColors - 1, "+"));
      return container;
    }

    function frequency() {
      var container;
      if (this.settings.colorBy.type === 'frequency' && this.settings.sizeBy.type === 'frequency') container = makeLegend.call(this, 'both');else if (this.settings.colorBy.type === 'frequency') container = makeLegend.call(this, 'color');else if (this.settings.sizeBy.type === 'frequency') container = makeLegend.call(this, 'size');
      return container;
    }

    function legendTable(label, domain) {
      var container = this.legends.container.append('div'); // Add table element.

      container.table = container.append('table'); // Add header row.

      container.header = container.table.append('thead').append('tr').selectAll('th').data([label, 'n']).join('th').attr('class', function (d, i) {
        return i === 0 ? 'fdg-sidebar__label fdg-legend__label' : null;
      }).attr('colspan', function (d, i) {
        return i === 0 ? 2 : null;
      }).style('text-align', function (d, i) {
        return i === 0 ? 'left' : 'right';
      }).html(function (d) {
        return d;
      }); // Add body rows.

      container.rows = container.table.append('tbody').selectAll('tr').data(domain).join('tr'); // Add SVG elements to first cell of each row.

      container.symbols = container.rows.append('td').append('svg').style('width', this.legends.svgWidth).style('height', this.legends.svgHeight).append('g').attr('transform', 'translate(0,2)'); // Add labels to second cell of each row.

      container.labels = container.rows.append('td') //.style('padding-left', `${this.legends.svgWidth / 2 - this.legends.radius}px`)
      .html(function (d) {
        return d;
      }); // Add counts to third cell of each row.

      container.counts = container.rows.append('td');
      return container;
    }

    function categorical() {
      var _this = this;

      var container = legendTable.call(this, this.settings.colorBy.label, this.scales.color.domain()); // Draw symbols

      container.symbols.append('circle').attr('cx', this.legends.svgWidth / 2).attr('cy', this.legends.svgHeight / 2).attr('r', this.legends.radius).attr('fill', function (d) {
        return _this.scales.color(d);
      }); // Update counts.

      container.counts.text(function (d) {
        return d3.format(',d')(_this.metadata.id.filter(function (di) {
          return di.colorStratum === d;
        }).length);
      });
      return container;
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
        return g.append('text').classed('fdg-sidebar__label fdg-legend__label', true).attr('x', marginLeft).attr('y', marginTop + marginBottom - height - 6).attr('fill', 'currentColor').attr('text-anchor', 'middle').attr('transform', "translate(".concat(width / 2, ",0)")).attr('font-weight', 'bold').attr('font-size', '1.25rem').html(title);
      });
      return svg.node();
    }

    function continuous$1() {
      var container = this.legends.container.append('div');
      container.node().appendChild(continuous({
        color: this.scales.color,
        title: this.settings.colorBy.label,
        width: 200,
        height: 50,
        tickValues: [this.scales.color.domain()[0], (this.scales.color.domain()[1] - this.scales.color.domain()[0]) / 2, this.scales.color.domain()[1]]
      }));
      return container;
    }

    function color$2() {
      var container;

      if (this.settings.colorify) {
        switch (this.settings.colorBy.type) {
          case 'frequency':
            container = frequency.call(this);
            break;

          case 'categorical':
            container = categorical.call(this);
            break;

          case 'continuous':
            container = continuous$1.call(this);
            break;

          default:
            return;
        }

        container.classed("fdg-legend fdg-legend--color fdg-legend--".concat(this.settings.colorBy.type), true);
      }

      return container;
    }

    function size$2() {
      var container;

      if (this.settings.sizify && this.settings.colorBy.type !== 'frequency') {
        container = makeLegend.call(this, 'size').classed("fdg-legend fdg-legend--size fdg-legend--".concat(this.settings.sizeBy.type), true);
      }

      return container;
    }

    function circle$1(legendItem) {
      var area = Math.PI * Math.pow(this.legends.radius, 2); //console.log('circle: ', Math.round(area));

      return legendItem.append('circle').attr('cx', this.legends.svgWidth / 2).attr('cy', this.legends.svgHeight / 2).attr('r', this.legends.radius).attr('fill', 'none').attr('stroke', '#444');
    }

    function square$1(legendItem) {
      var side = Math.sqrt(Math.PI) * this.legends.radius;

      return legendItem.append('rect').attr('x', this.legends.svgWidth / 2 - side / 2).attr('y', this.legends.svgHeight / 2 - side / 2).attr('width', side).attr('height', side).attr('fill', 'none').attr('stroke', '#444');
    }

    function triangle$2(legendItem) {
      var side = this.legends.radius * 2.69; // side length

      var height = side * Math.sqrt(3) / 2; // height of triangle

      var x = this.legends.svgWidth / 2; // horizontal centerpoint

      var y = height / 2; // vertical centerpoint
      //console.log('triangle: ', Math.round(area));
      // vertices

      var top = [x, y - height / 2];
      var left = [x - height / 2, y + height / 2];
      var right = [x + height / 2, y + height / 2];
      return legendItem.append('polygon').attr('points', [top, left, right]).attr('fill', 'none').attr('stroke', '#444');
    }

    function diamond$1(legendItem) {
      var side = Math.sqrt(Math.PI) * this.legends.radius;
      var x = this.legends.svgWidth / 2;
      var y = this.legends.svgHeight / 2;
      return legendItem.append('rect').attr('transform', "rotate(45 ".concat(x, " ").concat(y, ")")).attr('x', x).attr('y', y).attr('width', side).attr('height', side).attr('fill', 'none').attr('stroke', '#444');
    }

    //<svg height="210" width="500">
    //  <polygon points="100,10 40,198 190,78 10,78 160,198"
    //  style="fill:lime;stroke:purple;stroke-width:5;fill-rule:nonzero;" />
    //</svg>
    function star$1(legendItem) {
      var spikes = 5;
      var step = Math.PI / spikes;
      var innerRadius = this.legends.radius * 0.6;
      var outerRadius = this.legends.radius * 1.2;
      var dist = this.legends.radius * 2 / Math.sqrt(3);
      var rot = Math.PI / 2 * 3;
      var x = this.legends.svgWidth / 2;
      var y = this.legends.svgHeight / 2 + dist;
      var centroid = [x, y];
      var coordinates = [];

      for (var i = 0; i < spikes; i++) {
        x = centroid[0] + Math.cos(rot) * outerRadius;
        y = centroid[1] + Math.sin(rot) * outerRadius;
        coordinates.push([x, y]);
        rot += step;
        x = centroid[0] + Math.cos(rot) * innerRadius;
        y = centroid[1] + Math.sin(rot) * innerRadius;
        coordinates.push([x, y]);
        rot += step;
      }

      return legendItem.append('polygon').attr('points', coordinates).attr('fill', 'none').attr('stroke', '#444');
    }

    function triangleDown(legendItem) {
      var side = this.legends.radius * 2.69; // side length

      var height = side * Math.sqrt(3) / 2; // height of triangle

      var x = this.legends.svgWidth / 2; // horizontal centerpoint

      var y = height / 2; // vertical centerpoint
      // vertices

      var left = [x - height / 2, y - height / 2];
      var right = [x + height / 2, y - height / 2];
      var bottom = [x, y + height / 2];
      return legendItem.append('polygon').attr('points', [left, right, bottom]).attr('fill', 'none').attr('stroke', '#444');
    }

    function shape$1() {
      var _this = this;

      var main = this;
      var container;

      if (this.settings.shapify) {
        container = legendTable.call(this, this.settings.shapeBy.label, this.scales.shape.domain()).classed("fdg-legend fdg-legend--shape fdg-legend--".concat(this.settings.shapeBy.type), true); // Draw symbols

        var shapes = {
          circle: circle$1,
          square: square$1,
          triangle: triangle$2,
          diamond: diamond$1,
          star: star$1,
          triangleDown: triangleDown
        };
        container.symbols.each(function (value, i) {
          var shape = shapes[main.scales.shape(value)].call(main, d3.select(this)).classed('fdg-legend__shape', true).classed('fdg-legend__symbol', true);
        }); // Update counts.

        container.counts.text(function (d) {
          return d3.format(',d')(_this.metadata.id.filter(function (di) {
            return di.shapeStratum === d;
          }).length);
        });
      }

      return container;
    }

    function addLegends() {
      this.legends = {
        container: this.layout.legends,
        svgWidth: 40
      };
      this.legends.svgHeight = this.legends.svgWidth / 2;
      this.legends.radius = this.legends.svgHeight / 2 - 3;
      this.legends.color = color$2.call(this);
      this.legends.size = size$2.call(this);
      this.legends.shape = shape$1.call(this); //this.legends.container.selectAll('.fdg-legend__label')
      //    .style('padding-left', `${this.legends.svgWidth/2 - this.legends.radius}px`);
    }

    function addFreqTable() {
      var _this = this;

      var main = this;
      var freqTable = {
        container: this.layout.freqTable.classed('fdg-hidden', this.settings.freqTable.display === false).classed('fdg-freq-table--vertical', this.settings.freqTable.structure === 'vertical').classed('fdg-freq-table--horizontal', this.settings.freqTable.structure === 'horizontal')
      };
      freqTable.title = this.util.addElement('freq-table__title', freqTable.container).classed('fdg-sidebar__label', true).text(this.settings.freqTable.structure === 'vertical' ? this.settings.freqTable.title : this.settings.freqTable.countType === 'id' ? "Number of ".concat(this.settings.individualLabel) : "Number of ".concat(this.settings.eventLabel));
      freqTable.table = freqTable.container.append('table').classed('fdg-freq-table__table', true);
      freqTable.thead = freqTable.table.append('thead').classed('fdg-freq-table__thead', true).classed('fdg-hidden', this.settings.freqTable.header === false); // Add column headers.

      freqTable.th = freqTable.thead.selectAll('th').data(this.settings.freqTable.structure === 'vertical' ? this.settings.freqTable.columns : ['', 'Total'].concat(_toConsumableArray(this.metadata.strata.map(function (stratum) {
        return stratum.key;
      })))).join('th').attr('class', function (d, i) {
        return "fdg-freq-table__th--".concat(i === 0 ? 'label' : i === 1 ? 'individual' : i === 2 ? 'event' : i);
      }).classed('fdg-freq-table__th', true).text(function (d) {
        return d === 'label' ? '' : d === 'id' ? _this.settings.individualLabel : d === 'event' ? _this.settings.eventLabel : d;
      }); // Add info icon explaining bars.

      if (this.settings.freqTable.bars) freqTable.th.filter(function (d) {
        return d === 'id';
      }).html(function (d) {
        return "".concat(_this.settings.individualLabel, " <span ", "class = 'fdg-info-icon'", " ").concat(_this.settings.colorBy.type === 'categorical' ? "title = 'Gray background represents the percentage of individuals in the given group at the given state'" : "title = 'Gray background represents the percentage of individuals at the given state'", ">&#9432;</span>");
      });
      freqTable.tbody = freqTable.table.append('tbody').classed('fdg-freq-table__tbody', true); // Add table rows.

      freqTable.tr = freqTable.tbody.selectAll('tr').data(this.data.freqTable.filter(function (d) {
        return !(_this.settings.freqTable.includeEventCentral === false && d.state === _this.settings.eventCentral) && !(_this.settings.freqTable.structure === 'horizontal' && !d.foci);
      } // exclude central event row(s) // exclude strata rows
      )).join('tr').attr('class', function (d) {
        return d.state !== d.label ? 'fdg-freq-table__tr--subgroup' : null;
      }).classed('fdg-freq-table__tr', true).style('font-size', function (d) {
        return d.group !== d.value ? '1rem' : '1.25rem';
      }); // Add table cells.

      freqTable.tr.each(function (d, i) {
        var tr = d3.select(this);
        var td = tr.selectAll('td').data(d.cells).join('td').attr('class', function (di, i) {
          return main.settings.freqTable.structure === 'vertical' ? "fdg-freq-table__td--".concat(di.key) : "fdg-freq-table__td--".concat(di.key === 'label' ? 'label' : 'freq');
        }).classed('fdg-freq-table__td', true).style('background', function (di, i) {
          return i === 1 && main.settings.freqTable.bars ? "linear-gradient(to right, var(--background-darkest) 0, var(--background-darkest) ".concat(d.proportionFmt, ", transparent ").concat(d.proportionFmt, ")") : null;
        }) // add background to individual cell proportional to the percentage of individuals at state or focus
        .text(function (di) {
          return di.value;
        });
      });
      freqTable.td = freqTable.tr.selectAll('td');
      return freqTable;
    }

    function addOrbits() {
      var g = this.layout.svgBackground.append('g').classed('fdg-g fdg-g--orbits', true).attr('transform', "translate(".concat(this.settings.width.sidebar, ",0)"));
      var shadows = g.append('defs').selectAll('filter').data(this.metadata.orbit).join('filter').attr('id', function (d, i) {
        return "orbit--".concat(i);
      });
      shadows.append('feDropShadow').attr('dx', 0).attr('dy', 0).attr('stdDeviation', 5).attr('flood-color', 'black');
      var orbits = g.selectAll('.fdg-orbit').data(this.metadata.orbit).join(this.settings.orbitShape).classed('fdg-orbit', true).attr('cx', function (d) {
        return d.cx;
      }).attr('cy', function (d) {
        return d.cy;
      }).attr('r', function (d) {
        return d.r;
      }).attr('rx', function (d) {
        return d.rx;
      }).attr('ry', function (d) {
        return d.ry;
      }).attr('fill', 'none').attr('stroke', '#aaa').attr('stroke-width', '2.5').style('filter', function (d, i) {
        return "url(#orbit--".concat(i, ")");
      });
      return orbits;
    }

    function isCenter(d) {
      return Math.round(d.x) === Math.round(this.settings.orbitRadius / 2);
    }

    function isLessThanCenter(d) {
      return d.order === 1 || Math.round(d.x) < Math.round(this.settings.width.canvas / 2);
    }

    function getRelative(d) {
      var centered = d.key === this.settings.eventCentral || this.settings.focusOffset === 'none' || this.settings.focusOffset === 'heuristic' && isCenter.call(this, d);
      var above = this.settings.focusOffset === 'above' || this.settings.focusOffset === 'heuristic' && isLessThanCenter.call(this, d) === true;
      var below = this.settings.focusOffset === 'below' || this.settings.focusOffset === 'heuristic' && isLessThanCenter.call(this, d) === false;
      return d.key === this.settings.eventCentral || this.settings.focusOffset === 'none' ? 0 : this.settings.focusOffset === 'heuristic' && d.position === 0 ? Math.round(this.settings.orbitRadius / 4) : 0;
    }

    function isCenter$1(d) {
      return Math.round(d.y) === Math.round(this.settings.height.main / 2);
    }

    function isLessThanCenter$1(d) {
      return Math.round(d.y) < Math.round(this.settings.height.main / 2);
    }

    function getPosition(d) {
      var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var position = isCenter$1.call(this, d) ? 'middle' : isLessThanCenter$1.call(this, d) ? 'hanging' : 'baseline';
      if (reverse) position = position === 'hanging' ? 'baseline' : position === 'baseline' ? 'hanging' : position;
      return position;
    }

    function getRelative$1(d) {
      var centered = d.key === this.settings.eventCentral || this.settings.focusOffset === 'none' || this.settings.focusOffset === 'heuristic' && isCenter$1.call(this, d);
      var above = this.settings.focusOffset === 'above' || this.settings.focusOffset === 'heuristic' && isLessThanCenter$1.call(this, d) === true;
      var below = this.settings.focusOffset === 'below' || this.settings.focusOffset === 'heuristic' && isLessThanCenter$1.call(this, d) === false;
      return centered ? 0 : above ? -Math.round(this.settings.height.main / 12) : below ? Math.round(this.settings.height.main / 12) : 0;
    }

    function addLabel(text) {
      var _this = this;

      var label = text.append('tspan').classed('fdg-focus-annotation__label', true).attr('x', 0) //.attr('text-anchor', (d) => getTextAnchor.call(this, d))
      .attr('text-anchor', 'middle').attr('alignment-baseline', 'middle').style('font-size', this.settings.eventLabelFontSize).style('font-weight', this.settings.eventLabelFontWeight).text(function (d) {
        return d.key;
      });
      if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) label.attr('alignment-baseline', function (d) {
        return getPosition.call(_this, d, true);
      });
      return label;
    }

    function addEventCount(text) {
      var eventCount = text.append('tspan').classed('fdg-focus-annotation__event-count', true).classed('fdg-hidden', this.settings.eventCount === false).attr('x', 0).attr('dy', '1.3em') //.attr('text-anchor', (d) => getTextAnchor.call(this, d));
      .attr('text-anchor', 'middle').attr('alignment-baseline', 'middle').style('font-size', this.settings.eventCountFontSize).style('font-weight', this.settings.eventCountFontWeight);
      return eventCount;
    }

    function categoricallyReposition(text, label, eventCount) {
      var _this = this;

      if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
        text.style('transform', function (d) {
          return "translate(".concat(isCenter$1.call(_this, d) ? '-5em,0' : '0,-5em', ")");
        });
        label.attr('text-anchor', function (d) {
          return d.key === _this.settings.eventCentral ? 'start' : 'middle';
        });
        eventCount.attr('text-anchor', 'middle').classed('fdg-hidden', true);
      }
    }

    function addFocusAnnotations() {
      var _this = this;

      var main = this; // Define a radial gradient background to emphasize annotation text.
      //const radialGradient = this.layout.focusAnnotations
      //    .append('defs')
      //    .append('radialGradient')
      //    .attr('id', 'radial-gradient');
      //radialGradient.append('stop')
      //    .attr('offset', '0%')
      //    .attr('stop-color', '#aaa')
      //    .attr('stop-opacity', 1);
      //radialGradient.append('stop')
      //    .attr('offset', '100%')
      //    .attr('stop-color', 'white')
      //    .attr('stop-opacity', 0);

      var fociLabels = this.layout.focusAnnotations.selectAll('g.fdg-focus-annotation').data(this.metadata.event).join('g').classed('fdg-focus-annotation', true).attr('transform', function (d) {
        return "translate(".concat(d.x, ",").concat(d.y, ")");
      }); // background - white annotation highlight
      // foreground - black annotation text

      ['background', 'foreground'].forEach(function (pos) {
        var texts = fociLabels.append('text').classed("fdg-focus-annotation__text fdg-focus-annotation__".concat(pos), true);
        texts.each(function (d, i) {
          var text = d3.select(this);
          text.attr('transform', function (d) {
            return "translate(".concat(getRelative.call(main, d), ",").concat(getRelative$1.call(main, d), ")");
          });
        });
        var label = addLabel.call(_this, texts).attr('y', 0).attr('dy', 0);

        _this.util.wrap(label, _this.settings.orbitRadius);

        var eventCount = addEventCount.call(_this, texts); // Position annotations differently in categorical layout.

        categoricallyReposition.call(_this, texts, label, eventCount);
      }); // Annotate strata at each focus.

      if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
        this.metadata.event.forEach(function (event) {
          event.fociLabels = _this.layout.focusAnnotations.append('g').classed('fdg-focus-annotation fdg-focus-annotation--categorical', true);
          ['background', 'foreground'].forEach(function (pos) {
            var texts = event.fociLabels.selectAll("text.fdg-focus-annotation__".concat(pos)).data(event.foci).join('text').classed("fdg-focus-annotation__event-count fdg-focus-annotation__text fdg-focus-annotation__".concat(pos), true).attr('x', function (d) {
              return d.dx;
            }).attr('dx', function (d) {
              return event.key === _this.settings.eventCentral ? null : '-1em';
            }).attr('y', function (d) {
              return d.dy;
            }).attr('text-anchor', function (d) {
              return event.key === _this.settings.eventCentral ? 'middle' : 'end';
            }).attr('alignment-baseline', function (d) {
              return getPosition.call(_this, d, true);
            });
          });
        });
      } // Add a radial gradient behind annotations to make text easier to read.
      //const offset = 50;
      //fociLabels.each(function(d) {
      //    const g = d3.select(this);
      //    const dimensions = this.getBBox();
      //    const rect = g
      //        .insert('rect', ':first-child')
      //        .attr('x', dimensions.x - offset)
      //        .attr('y', dimensions.y - offset)
      //        .attr('width', dimensions.width + offset*2)
      //        .attr('height', dimensions.height + offset*2)
      //        .attr('fill', 'url(#radial-gradient)')
      //        //.attr('transform', text.attr('transform'));
      //});


      return fociLabels;
    }

    function addCustomAnnotations() {
      var _this = this;

      var annotations;

      if (this.settings.annotations && Array.isArray(this.settings.annotations)) {
        this.settings.annotations.forEach(function (annotation) {
          annotation.radius = annotation.orbit * _this.settings.orbitRadius;
          annotation.theta = 2 * Math.PI * annotation.angle / 360;
          annotation.x = _this.settings.center.x + annotation.radius * // number of orbit radii from the center
          Math.cos(annotation.theta); // position along the circle at the given orbit along which

          annotation.y = annotation.order === 0 ? _this.settings.center.y : _this.settings.center.y + annotation.radius * // number of orbit radii from the center
          Math.sin(annotation.theta); // y-position of the along the given orbit at which the focus circle at the
        });
        annotations = this.layout.customAnnotations.selectAll('g.fdg-custom-annotation').data(this.settings.annotations).join('g').classed('fdg-custom-annotation', true).attr('transform', function (d) {
          return "translate(".concat(d.x, ",").concat(d.y, ")");
        }).attr('opacity', function (d) {
          return d.timepoint > _this.settings.timepoint ? 0 : 1;
        });
        annotations.html(function (d) {
          return d.value;
        }); //['background', 'foreground'].forEach((pos) => {
        //    const text = annotations
        //        .append('text')
        //        .classed(`fdg-focus-annotation__text fdg-focus-annotation__${pos}`, true)
        //        .attr('alignment-baseline', d => d.angle > 0 ? 'hanging' : d.angle < 0 ? 'baseline' : 'middle')
        //        .html(d => d.value)
        //        .each(function(d) {
        //            const selection = d3.select(this);
        //            // Apply attributes.
        //            if (typeof d.attr === 'object' && d.attr !== null)
        //                Object.keys(d.attr).forEach(attr => {
        //                    selection.attr(attr, d.attr[attr]);
        //                });
        //            // Apply styles.
        //            if (typeof d.style === 'object' && d.style !== null)
        //                Object.keys(d.style).forEach(style => {
        //                    selection.style(style, d.style[style]);
        //                });
        //        });
        //});
      }

      return annotations;
    }

    function dataDriven() {
      // controls
      addControls.call(this); // sidebar

      addLegends.call(this);
      this.layout.freqTable = addFreqTable.call(this); // Draw concentric circles.

      this.orbits = addOrbits.call(this); // Annotate foci.

      this.focusAnnotations = addFocusAnnotations.call(this); // Add custom annotations.

      this.customAnnotations = addCustomAnnotations.call(this);
    }

    function layout() {
      var main = this.util.addElement('main', d3.select(this.element)).datum(this);
      this.settings.width = {
        main: main.node().clientWidth
      };
      this.settings.height = {
        main: main.node().clientHeight
      };

      for (var prop in this.settings.root) {
        document.querySelector(':root').style.setProperty("--".concat(prop), this.settings.root[prop], 'important');
      } // controls positioned absolutely


      var controlsLayout = controls.call(this, main); // sidebar to the left

      var sidebarLayout = sidebar.call(this, main); // animation to the right

      var canvasLayout = canvas.call(this, main); // add resize event

      window.addEventListener('resize', resize.bind(this));
      return _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({
        main: main
      }, controlsLayout), sidebarLayout), canvasLayout), {}, {
        dataDriven: dataDriven
      });
    }

    function id() {
      var _this = this;

      var nest = d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (group) {
        return {
          duration: d3.sum(group, function (d) {
            return +d.duration;
          }),
          "static": group.length === 1,
          colorStratum: _this.settings.colorBy.type === 'categorical' ? group[0][_this.settings.colorBy.variable] : null,
          shapeStratum: _this.settings.shapeBy.type === 'categorical' ? group[0][_this.settings.shapeBy.variable] : null
        };
      }).entries(this.data);
      nest.forEach(function (d, i) {
        Object.assign(d, d.value);
      });
      return nest;
    }

    function updateIdDependentSettings(metadata) {
      var _this = this;

      this.settings.duration = this.settings.duration || d3.max(metadata.id, function (id) {
        return id.duration;
      });
      this.settings.text = this.settings.text.filter(function (text) {
        return (// Remove if:
          //   - text contains static
          //   - there are no static IDs
          //   - static IDs are drawn separately
          !(/static/i.test(text) && (metadata.id.every(function (id) {
            return id["static"] === false;
          }) || _this.settings.drawStaticSeparately === false))
        );
      }).map(function (text) {
        return text.replace('[duration]', d3.format(',d')(_this.settings.duration));
      });
      this.settings.minRadius = this.settings.minRadius || Math.max(Math.min(3000 / metadata.id.filter(function (d) {
        return !(_this.settings.drawStaticSeparately && d["static"]);
      }).length, this.settings.maxRadius), 1);
      this.settings.staticRadius = this.settings.staticRadius || Math.max(3000 / metadata.id.length, 1);
      this.settings.maxRadius = this.settings.minRadius + this.settings.colorBy.nColors;
      this.settings.chargeStrength = -(2000 / metadata.id.filter(function (d) {
        return !(_this.settings.drawStaticSeparately && d["static"]);
      }).length);
      this.settings.staticChargeStrength = -(2000 / metadata.id.length);
      this.settings.fill = this.settings.fill || metadata.id.length <= 2500;
    }

    function event() {
      // Group data by event.
      var nest = d3.nest().key(function (d) {
        return d.event;
      }).rollup(function (group) {
        var datum = group[0];
        var order = parseInt(datum.event_order);
        var position = datum.hasOwnProperty('event_position') ? parseInt(datum.event_position) : null;
        return {
          order: order,
          position: position,
          ids: new Set(),
          // individuals in the state currently
          nIds: 0,
          // number of individuals in the state currently
          nIdsPrevious: 0,
          idsCumulative: new Set(),
          // individuals that have ever been in the state
          nIdsCumulative: 0,
          // number of individuals that have ever been in the state
          nEvents: 0,
          // number of times any individual has been in the state up to the current timepoint, i.e. the total number of events that have occurred so far
          nEventsTotal: group.length,
          // total number of events
          allIds: _toConsumableArray(new Set(group.map(function (d) {
            return d.id;
          })).values()).sort()
        };
      }).entries(this.data).sort(function (a, b) {
        return a.value.order - b.value.order || a.value.position - b.value.position;
      });
      var event = nest.map(function (event, i) {
        Object.assign(event, event.value); // remove nesting

        delete event.value;
        event.start_timepoint = i === 0 ? 1 : nest[i - 1].end_timepoint + 1;
        event.end_timepoint = event.start_timepoint + event.allIds.length - 1;
        event.rank = i;
        return event;
      });
      return event;
    }

    function updateEventDependentSettings(metadata) {
      this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].key;
      this.settings.eventChangeCount = this.settings.eventChangeCount || metadata.event.slice(1).map(function (event) {
        return event.key;
      });
    }

    function orbit(metadata) {
      var _this = this;

      var nest = d3.nest().key(function (d) {
        return d.order;
      }).entries(metadata.event.filter(function (event) {
        return event.key !== _this.settings.eventCentral;
      }));
      nest.forEach(function (orbit, i) {
        orbit.label = Array.isArray(_this.settings.orbitLabels) && _this.settings.orbitLabels.length === nest.length ? _this.settings.orbitLabels[i] : "Orbit ".concat(i + 1);
        orbit.values.sort(function (a, b) {
          return a.position - b.position;
        }).forEach(function (event) {
          event.orbitLabel = orbit.label;
        });
      });
      return nest;
    }

    function strata(metadata) {
      var _this = this;

      var nest;

      if (this.settings.stratify) {
        nest = d3.nest().key(function (d) {
          return d[_this.settings.colorBy.variable];
        }).entries(this.data).sort(function (a, b) {
          var aOrder = Array.isArray(_this.settings.colorBy.order) ? _this.settings.colorBy.order.indexOf(a.key) : null;
          var bOrder = Array.isArray(_this.settings.colorBy.order) ? _this.settings.colorBy.order.indexOf(b.key) : null;
          var orderSort = aOrder - bOrder;
          var alphaSort = a.key < b.key ? -1 : 1;
          return orderSort ? orderSort : alphaSort;
        });
        this.settings.colorBy.nStrata = nest.length;
        this.settings.colorBy.theta = 2 * Math.PI / this.settings.colorBy.nStrata;
        nest.forEach(function (stratum, i) {
          //ids: new Set(), // individuals in the state currently
          //nIds: 0, // number of individuals in the state currently
          //idsCumulative: new Set(), // individuals that have ever been in the state
          //nIdsCumulative: 0, // number of individuals that have ever been in the state
          //nEvents: 0, // number of times any individual has been in the state up to the current timepoint, i.e. the total number of events that have occurred so far
          //nEventsTotal: group.length, // total number of events
          var colorScheme = _this.settings.colorBy.colorSchemes[i];
          stratum.colorScheme = d3["scheme".concat(colorScheme.substring(0, 1).toUpperCase()).concat(colorScheme.substring(1), "s")]; // domain: number of recurrent events
          //  range: sequential, single-hue color scheme of the same length

          stratum.colorScale = d3.scaleLinear().domain(d3.range(_this.settings.nColors)).range(stratum.colorScheme[9].reverse().slice(0, _this.settings.nColors).reverse()).clamp(true);
          stratum.individuals = metadata.id.filter(function (d) {
            return d.colorStratum === stratum.key;
          });
          stratum.duration = d3.max(stratum.individuals, function (d) {
            return d.duration;
          });
          stratum.nIndividuals = stratum.individuals.length;
          stratum.nEvents = stratum.values.length; // TODO: figure out how to shift the foci to match the order in the legend

          stratum.angle = _this.settings.colorBy.nStrata % 2 ? (_this.settings.colorBy.nStrata - i - 1) * _this.settings.colorBy.theta : (_this.settings.colorBy.nStrata - i - 1) * _this.settings.colorBy.theta + Math.PI / _this.settings.colorBy.nStrata;
        });
      }

      return nest;
    }

    function shape$2(metadata) {
      var _this = this;

      var nest;

      if (this.settings.shapify) {
        nest = d3.nest().key(function (d) {
          return d[_this.settings.shapeBy.variable];
        }).entries(this.data).sort(function (a, b) {
          var aOrder = Array.isArray(_this.settings.shapeBy.order) ? _this.settings.shapeBy.order.indexOf(a.key) : null;
          var bOrder = Array.isArray(_this.settings.shapeBy.order) ? _this.settings.shapeBy.order.indexOf(b.key) : null;
          var orderSort = aOrder - bOrder;
          var alphaSort = a.key < b.key ? -1 : 1;
          return orderSort ? orderSort : alphaSort;
        });
      }

      return nest;
    }

    function color$3(metadata) {
      var scale;

      if (this.settings.colorify) {
        var colorBy = this.settings.colorBy; // scale domain

        var domain = colorBy.type === 'frequency' ? d3.range(colorBy.nColors) : colorBy.type === 'continuous' ? d3.extent(this.data, function (d) {
          return d[colorBy.variable];
        }) : colorBy.type === 'categorical' ? metadata.strata.map(function (d) {
          return d.key;
        }) : null; // scale

        var range;

        switch (colorBy.type) {
          case 'frequency':
            range = colorBy.mirror ? d3["scheme".concat(colorBy.colorScheme)][colorBy.nColors].reverse() : d3["scheme".concat(colorBy.colorScheme)][colorBy.nColors];
            scale = d3.scaleLinear().domain(domain).range(range).clamp(true);
            break;

          case 'continuous':
            scale = d3.scaleSequential(d3["interpolate".concat(colorBy.colorScheme)]).domain(domain); // Invert color scale.

            if (colorBy.mirror) {
              var interpolator = scale.interpolator(); // read the color scale's interpolator

              var mirror = function mirror(t) {
                return interpolator(1 - t);
              }; // returns the mirror image of the interpolator


              scale.interpolator(mirror); // updates the scale's interpolator
            }

            break;

          case 'categorical':
            var scheme = d3["scheme".concat(colorBy.colorScheme)];
            range = scheme.every(function (el) {
              return typeof el === 'string';
            }) ? scheme : scheme[Math.min(Math.max(3, domain.length), 9)];
            scale = d3.scaleOrdinal().domain(domain).range(range.map(function (color) {
              return d3.rgb(color) + '';
            }));
            break;

          default:
            scale = null;
        }
      }

      return scale;
    }

    function size$3(metadata) {
      var scale;

      if (this.settings.sizify) {
        var sizeBy = this.settings.sizeBy; // scale domain

        var domain = sizeBy.type === 'frequency' ? [0, this.settings.colorBy.nColors] : sizeBy.type === 'continuous' ? d3.extent(this.data, function (d) {
          return d[sizeBy.variable];
        }) : null; // scale range

        var range = [this.settings.minRadius, this.settings.maxRadius]; // scale

        scale = d3.scaleLinear().domain(domain).range(range).clamp(true);
      }

      return scale;
    }

    function shape$3(metadata) {
      var scale;

      if (this.settings.shapify) {
        var shapeBy = this.settings.shapeBy; // scale domain

        var domain = shapeBy.type === 'categorical' ? metadata.shape.map(function (d) {
          return d.key;
        }) : null; // scale range

        var range = shapeBy.shapes; // scale

        scale = d3.scaleOrdinal().domain(domain).range(range);
      }

      return scale;
    }

    function scales(metadata) {
      var color = color$3.call(this, metadata);
      var size = size$3.call(this, metadata);
      var shape = shape$3.call(this, metadata);
      return {
        color: color,
        size: size,
        shape: shape
      };
    }

    function focus(metadata) {
      var _this = this;

      // Stratify only when the color aesthetic is categorical.
      if (this.settings.colorBy.type === 'categorical') {
        // Define a consistent arc length when positioning strata along orbit.
        if (this.settings.stratificationPositioning === 'orbital') {
          this.settings.arcLength = this.settings.orbitRadius / 200;
          this.settings.offsets = this.settings.stratificationPositioning === 'orbital' ? metadata.strata.length % 2 ? d3.range(-Math.floor(metadata.strata.length / 2), Math.floor(metadata.strata.length / 2) + 1) : d3.range(-metadata.strata.length / 2 + 0.5, metadata.strata.length / 2 + 0.5) : null;
        } // Define coordinates of stratified foci as a function of event coordinates.


        metadata.event.forEach(function (event, i) {
          event.foci = metadata.strata.map(function (stratum, j) {
            var focus = _objectSpread2(_objectSpread2({}, stratum), {}, {
              x: event.x + 50 * Math.cos(stratum.angle),
              dx: event.x + (i === 0 ? 75 : 50) * Math.cos(stratum.angle),
              y: event.y + 50 * Math.sin(stratum.angle),
              dy: event.y + (i === 0 ? 75 : 50) * Math.sin(stratum.angle),
              ids: new Set(),
              nIds: 0,
              nIdsPrevious: 0,
              idsCumulative: new Set(),
              nIdsCumulative: 0,
              nEvents: 0
            }); // Position stratum foci along orbits rather than on a circle at event focus.


            if (_this.settings.stratificationPositioning === 'orbital') {
              focus.theta = event.theta + _this.settings.arcLength * _this.settings.offsets[j] / (2 * Math.PI * event.radius) * 360; // Define position along orbit on which the stratum focus will appear.

              focus.x = event.order === 0 ? focus.x : _this.settings.center.x + event.radius * // number of orbit radii from the center
              Math.cos(focus.theta); // position along the circle at the given orbit along which

              focus.dx = focus.x;
              focus.y = event.order === 0 ? focus.y : _this.settings.center.y + event.radius * // number of orbit radii from the center
              Math.sin(focus.theta); // y-position of the along the given orbit at which the focus circle at the

              focus.dy = focus.y;
            }

            return focus;
          });
        });
      }
    }

    function freqTable$2(metadata) {
      var _this = this;

      var freqTable = d3.merge(metadata.event.map(function (event) {
        // One row per event per focus plus an overall event record.
        var rowGroup = _this.settings.colorBy.type === 'categorical' ? [event].concat(_toConsumableArray(event.foci)) : [event]; // For each row calculate numerators, denominators, and proportions.

        rowGroup.forEach(function (d) {
          d.state = event.key; // state

          d.label = d.key; // state or stratum

          d.freqs = getFreqs.call(_this, d, event, metadata);
          d.fmt = formatValues.call(_this, d);
        });
        return rowGroup;
      })); // Define an array of values to populate the frequency table.

      freqTable.forEach(function (d) {
        d.cells = defineCellValues.call(_this, d);
      });
      return freqTable;
    }

    function defineMetadata() {
      var metadata = {}; // Define ID set and update settings that depend on the ID set.

      metadata.id = id.call(this);
      updateIdDependentSettings.call(this, metadata); // Define event set and update settings that depend on event set.

      metadata.event = event.call(this);
      updateEventDependentSettings.call(this, metadata); // Define orbit set.

      metadata.orbit = orbit.call(this, metadata); // Determine the dimensions of the canvas, the position of the foci, and the size of the orbits.

      coordinates.call(this, metadata); // Define strata set.

      metadata.strata = strata.call(this, metadata); // Define shape set.

      metadata.shape = shape$2.call(this, metadata); // Define color scale.

      this.scales = scales.call(this, metadata); // Define the offset of each stratum as function of the focus coordinates, the stratum
      // sequence, and theta.

      focus.call(this, metadata); // Calculate frequencies and percentages to populate annotation foci and frequency table.

      this.data.freqTable = freqTable$2.call(this, metadata);
      return metadata;
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
            d[variable] = ['event_order', 'start_timepoint', 'end_timepoint', 'duration'].includes(variable) ? +d[_this.settings[setting]] : d[_this.settings[setting]];
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
          // This approach assumes data are already sorted chronologically.
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
            d.duration = d.end_timepoint - d.start_timepoint + 1;
          } // Track transit time of node during each state.


          d.transitTime = 0;
        }); // Define sequence

        group.sort(function (a, b) {
          var start_timepoint = a.start_timepoint - b.start_timepoint;
          var end_timepoint = a.end_timepoint - b.end_timepoint;
          var event_order = a.event_order - b.event_order; // Realistically states should be unique and non-overlapping within
          // start and end timepoint but if the library were to ever support
          // concurrent states we include event order in the sort.

          return start_timepoint || end_timepoint || event_order;
        }).forEach(function (d, i) {
          d.sequence = i;
        });
      }).entries(this.data);
    }

    // Generates an alternative state progression by orbit, state, and ID.
    function orderByState() {
      var _this = this;

      if (this.settings.stateChange === 'ordered' && this.metadata) {
        // start timepoint
        // - first state: 1
        // - subsequent states: position of ID in ID list of previous state
        //
        // end timepoint
        // - first state: position of ID in ID list of current state
        // - subsequent states: start timepoint of current state + position of ID in ID list of current state
        console.log(this.metadata);
        d3.nest().key(function (d) {
          return d.id;
        }).rollup(function (group) {
          group.sort(function (a, b) {
            return a.event_order - b.event_order || a.event_position - b.event_position || (a.event < b.event ? -1 : 1);
          });
          group.forEach(function (d, i) {
            var currState = _this.metadata.event.find(function (event) {
              return event.key === d.event;
            });

            var prevState = _this.metadata.event.find(function (event) {
              var _group;

              return event.key === ((_group = group[i - 1]) === null || _group === void 0 ? void 0 : _group.event);
            });

            if (i === 0) {
              d.start_timepoint = 1;
              d.end_timepoint = d.start_timepoint + currState.allIds.findIndex(function (id) {
                return id === d.id;
              });
            } else {
              d.start_timepoint = prevState.allIds.findIndex(function (id) {
                return id === d.id;
              }) + prevState.start_timepoint + 1;
              d.end_timepoint = currState.allIds.findIndex(function (id) {
                return id === d.id;
              }) + currState.start_timepoint;
              d.duration = d.end_timepoint - d.start_timepoint + 1;
            }
          });
        }).entries(this.data); // Redefine duration of animation.
        // TODO: duration of animation should be the sum of the number of IDs in each state or something

        this.settings.duration = this.metadata.id.length * this.metadata.orbit.length + 1; //d3.sum(
        //    this.metadata.event,
        //    event => event.allIds.length
        //);
      }
    }

    function sort(has) {
      var numericId = this.data.every(function (d) {
        return /^-?\d+\.?\d*$/.test(d.id) || /^-?\d*\.?\d+$/.test(d.id);
      });
      this.data.sort(function (a, b) {
        var id_diff = numericId ? +a.id - +b.id : a.id < b.id ? -1 : b.id < a.id ? 1 : 0;
        var timepoint_diff = a.start_timepoint - b.start_timepoint;
        return id_diff || timepoint_diff;
      });
    }

    function mutate() {
      // Check for existence of variables.
      var has = hasVariables.call(this); // Apply data mappings.

      mapVariables.call(this); // Define:
      // - start and end timepoints with duration if only duration exists
      // - duration if only start and end points exist
      // - order of states with start and end timepoints

      addVariables.call(this, has); // Define alternative order of events by event order and ID.

      orderByState.call(this); // Sort data by ID then chronologically.

      sort.call(this, has);
    }

    var data$1 = {
      mutate: mutate,
      structure: structure
    };

    function init() {
      var _this = this;

      this.settings_initial = _objectSpread2({}, this.settings); // Update metadata.

      this.metadata.event.forEach(function (event) {
        event.data = _this.data.nested.filter(function (d) {
          return d.value.state.event === event.key;
        });
      }); // Cycle through text that displays over animation.

      runModal.call(this); // Add a static force layout in the background for individuals that never change state (improves
      // performance by reducing the number of nodes in the simulation).

      addStaticForceSimulation.call(this);
      update$1.call(this, this.data); // Add a dynamic force layout in the middleground.

      this.forceSimulation = addForceSimulation.call(this, this.data);
      this.nodes = this.forceSimulation.nodes(); // Reheat the force simulation after initialization to incorporate the centering force before
      // removing the force.
      //increment.call(this, this.data, false);

      this.settings.removeCenterForce = true; // Start the animation.

      if (this.settings.playPause === 'play') this.timeout = d3.timeout(function () {
        // Run first sequence.
        if (_this.settings.runSequences === true) {
          _this.sequence = getNextSequence.call(_this, false);
          runSequence.call(_this); // calls startInterval
        } // Run full animation.
        else _this.interval = startInterval.call(_this, _this.data);
      }, this.settings.delay);
    }

    function forceDirectedGraph(_data_) {
      var _element_ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';

      var _settings_ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var fdg = {
        data: _data_,
        element: _element_,
        settings: util.mergeDeep(settings, _settings_),
        util: util
      };
      settings.update.call(fdg); // Update settings object.

      fdg.layout = layout.call(fdg); // add elements to DOM

      data$1.mutate.call(fdg); // mutate data

      fdg.metadata = defineMetadata.call(fdg); // calculate characteristics of variables in data

      fdg.data.nested = data$1.structure.call(fdg, fdg.data); // structure data

      fdg.layout.dataDriven.call(fdg); // update the DOM

      init.call(fdg); // run the simulation

      return fdg;
    }

    return forceDirectedGraph;

})));
