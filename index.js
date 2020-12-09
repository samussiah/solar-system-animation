(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
          (global.forceDirectedGraph = factory()));
})(this, function () {
    'use strict';

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
        '@babel/helpers - typeof';

        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
            _typeof = function (obj) {
                return typeof obj;
            };
        } else {
            _typeof = function (obj) {
                return obj &&
                    typeof Symbol === 'function' &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? 'symbol'
                    : typeof obj;
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
                writable: true,
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
            if (enumerableOnly)
                symbols = symbols.filter(function (sym) {
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
                    Object.defineProperty(
                        target,
                        key,
                        Object.getOwnPropertyDescriptor(source, key)
                    );
                });
            }
        }

        return target;
    }

    function _toConsumableArray(arr) {
        return (
            _arrayWithoutHoles(arr) ||
            _iterableToArray(arr) ||
            _unsupportedIterableToArray(arr) ||
            _nonIterableSpread()
        );
    }

    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }

    function _iterableToArray(iter) {
        if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter))
            return Array.from(iter);
    }

    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === 'Object' && o.constructor) n = o.constructor.name;
        if (n === 'Map' || n === 'Set') return Array.from(o);
        if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
            return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;

        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

        return arr2;
    }

    function _nonIterableSpread() {
        throw new TypeError(
            'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        );
    }

    function _createForOfIteratorHelper(o, allowArrayLike) {
        var it;

        if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) {
            if (
                Array.isArray(o) ||
                (it = _unsupportedIterableToArray(o)) ||
                (allowArrayLike && o && typeof o.length === 'number')
            ) {
                if (it) o = it;
                var i = 0;

                var F = function () {};

                return {
                    s: F,
                    n: function () {
                        if (i >= o.length)
                            return {
                                done: true,
                            };
                        return {
                            done: false,
                            value: o[i++],
                        };
                    },
                    e: function (e) {
                        throw e;
                    },
                    f: F,
                };
            }

            throw new TypeError(
                'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            );
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
            },
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

        for (
            var _len = arguments.length, objects = new Array(_len), _key = 0;
            _key < _len;
            _key++
        ) {
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

    var util = {
        arcTween: arcTween,
        csv: csv,
        mergeDeep: mergeDeep,
    };

    // TODO: setting checks
    function update() {
        var _this = this;

        if (!['frequency', 'continuous', 'categorical'].includes(this.settings.colorBy.type)) {
            alert(
                '[ '.concat(
                    colorBy,
                    ' ] is not a valid option.  Please choose one of [ frequency ], [ continuous ], or [ categorical ].  Defaulting to  [ frequency ].'
                )
            );
            this.settings.colorBy.type = 'frequency';
        } // aesthetics

        this.settings.stratify = this.settings.colorBy.type === 'categorical';
        this.settings.sizify =
            this.settings.sizeBy.type === 'frequency' ||
            (this.settings.sizeBy.type === 'continuous' && this.settings.sizeBy.variable !== null);
        this.settings.shapify = this.settings.shapeBy.variable !== null; // Define array of modal text.

        var texts = [];

        if (Array.isArray(this.settings.explanation)) {
            // Update explanation text with appropriate shape.
            this.settings.explanation = this.settings.explanation.map(function (text) {
                return text.replace(/bubble/g, _this.settings.shape);
            });
            texts = texts.concat(
                this.settings.explanation.filter(function (el) {
                    return !(_this.settings.hideControls && el.includes('controls'));
                })
            );
        }

        if (Array.isArray(this.settings.information))
            texts = texts.concat(this.settings.information);
        this.settings.text = texts.filter(function (text) {
            return typeof text === 'string';
        });
    }

    var settings = {
        update: update,

        /**-------------------------------------------------------------------------------------------\
        data mapping
      \-------------------------------------------------------------------------------------------**/
        id_var: 'id',
        event_var: 'event',
        event_order_var: 'event_order',
        start_timepoint_var: 'stdy',
        end_timepoint_var: 'endy',
        duration_var: 'duration',
        sequence_var: 'seq',

        /**-------------------------------------------------------------------------------------------\
        aesthetics
      \-------------------------------------------------------------------------------------------**/
        // color
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
            nColors: 6, // min: 3, max: 9
        },
        color: 'rgb(170,170,170)',
        fill: null,
        // defined in ./defineMetadata/defineIdDependentSettings
        // size
        sizeBy: {
            type: 'frequency',
            // ['frequency', 'continuous']
            variable: null,
            label: null,
        },
        minRadius: null,
        // defined in ./defineMetadata/updateIdDependentSettings
        maxRadius: 10,
        // defined in ./defineMetadata/updateIdDependentSettings
        staticRadius: null,
        // defined in ./defineMetadata/updateIdDependentSettings
        // shape
        shapeBy: {
            type: 'categorical',
            // ['categorical']
            variable: null,
            label: null,
            shapes: ['circle', 'square', 'triangle', 'diamond'],
        },
        shape: 'circle',

        /**-------------------------------------------------------------------------------------------\
        animation
      \-------------------------------------------------------------------------------------------**/
        // animation settings
        speed: 'medium',
        speeds: {
            slow: 1000,
            medium: 500,
            fast: 100,
        },
        playPause: 'play',
        pulseOrbits: false,
        loop: true,
        // time settings
        timepoint: 0,
        // initial timepoint
        timeUnit: 'days',
        // time unit that appears in labels
        duration: null,
        // defined in ./defineMetadata/updateIdDependentSettings
        resetDelay: 15000,

        /**-------------------------------------------------------------------------------------------\
        dimensions
      \-------------------------------------------------------------------------------------------**/
        width: null,
        // defined in ./defineMetadata/coordinates
        height: null,
        // defined in ./defineMetadata/coordinates
        orbitRadius: null,
        // defined in ./defineMetadata/coordinates

        /**-------------------------------------------------------------------------------------------\
        force simulation
      \-------------------------------------------------------------------------------------------**/
        manyBody: 'forceManyBodyReuse',
        // ['forceManyBody', 'forceManyBodyReuse', 'forceManyBodySampled']
        chargeStrength: null,
        // defined in ./defineMetadata/updateIdDependentSettings
        collisionPadding: 1,
        staticChargeStrength: null,
        // defined in ./defineMetadata/updateIdDependentSettings
        drawStaticSeparately: false,
        // draw static bubbles in a static force simulation to improve performance
        staticLayout: 'circular',
        // ['circular', 'radial']

        /**-------------------------------------------------------------------------------------------\
        modal
      \-------------------------------------------------------------------------------------------**/
        modal: true,
        // display modals?
        modalSpeed: 15000,
        // amount of time for which each modal appears
        modalIndex: 0,
        explanation: [
            'Each bubble in this animation represents an individual.',
            'As <span class = "fdg-emphasized">time progresses</span> and individuals experience events, their bubble gravitates toward the focus or "planet" representing that event.',
            'The <span class = "fdg-emphasized">number of events</span> an individual has experienced determines the color and/or size of their bubble.',
            '<span class = "fdg-emphasized">Static bubbles</span> represent individuals who never experience an event.',
            'Use the <span class = "fdg-emphasized">controls</span> on the right to interact with and alter the animation.',
            'Continue watching to learn how these individuals progress over the course of [duration] days.',
        ],
        // array of strings
        information: null,
        // array of strings

        /**-------------------------------------------------------------------------------------------\
        event/state
      \-------------------------------------------------------------------------------------------**/
        events: null,
        // defined in ./defineMetadata
        eventCentral: null,
        // defined in ./defineMetadata/updateEventDependentSettings
        eventCount: true,
        // display [ n (%) ] beneath focus labels?
        eventChangeCount: null,
        // defined in ./defineMetadata/updateEventDependentSettings
        eventChangeCountAesthetic: 'color',

        /**-------------------------------------------------------------------------------------------\
        miscellaneous
      \-------------------------------------------------------------------------------------------**/
        nOrbits: null,
        // defined in ./defineMetadata/dataDrivenSettings/orbits
        nFoci: null,
        // defined in ./defineMetadata/updateEventDependentSettings
        hideControls: false,
        hideFreqTable: false,
        eventCentralInFreqTable: false,
    };

    function addElement(name, parent) {
        var tagName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'div';
        var element = parent.append(tagName).classed('fdg-'.concat(name), true);
        return element;
    }

    function controls(main) {
        var controls = addElement('controls', main).classed(
            'fdg-hidden',
            this.settings.hideControls
        );
        var hide = addElement('hide', controls, 'span');
        return {
            controls: controls,
        };
    }

    function addStopwatch(progress) {
        var stopwatch = addElement('stopwatch', progress).style('width', '100%');
        stopwatch.width = stopwatch.node().clientWidth;
        stopwatch.innerRadius = stopwatch.width / 8;
        stopwatch.svg = addElement('stopwatch__svg', stopwatch, 'svg')
            .attr('width', stopwatch.width)
            .attr('height', stopwatch.width);
        stopwatch.arc = d3
            .arc()
            .innerRadius(stopwatch.innerRadius)
            .outerRadius(stopwatch.width / 2 - 1)
            .cornerRadius(12)
            .startAngle(0);
        stopwatch.g = addElement('stopwatch__path', stopwatch.svg, 'g').attr(
            'transform',
            'translate('.concat(stopwatch.width / 2, ',').concat(stopwatch.width / 2, ')')
        );
        stopwatch.background = addElement('stopwatch__path', stopwatch.g, 'path')
            .datum({
                endAngle: 2 * Math.PI,
            })
            .attr('d', stopwatch.arc)
            .style('fill', 'white')
            .style('stroke', 'black')
            .style('stroke-width', 0.5);
        stopwatch.foreground = addElement('stopwatch__path', stopwatch.g, 'path')
            .datum({
                endAngle: 0,
            })
            .attr('d', stopwatch.arc)
            .style('fill', '#a6d96a') //.style('fill-opacity', .5)
            .style('stroke', 'black')
            .style('stroke-width', 0.5);
        stopwatch.percentBackground = addElement('stopwatch__text', stopwatch.g, 'text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .style('font-weight', 'bold')
            .style('stroke', 'white')
            .style('stroke-width', '4px')
            .text('0%');
        stopwatch.percentForeground = addElement('stopwatch__text', stopwatch.g, 'text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .style('font-weight', 'bold') //.style('stroke', 'black')
            //.style('stroke-width', '2px')
            .text('0%');
        return stopwatch;
    }

    function addCountdown(progress) {
        var resetDelay = this.settings.resetDelay / 1000;
        return addElement('countdown', progress)
            .classed('fdg-sidebar__label', true)
            .selectAll('div')
            .data(d3.range(-1, resetDelay))
            .join('div')
            .text(function (d) {
                return 'Looping in '.concat(d + 1, ' second').concat(d === 0 ? '' : 's');
            })
            .classed('fdg-hidden', function (d) {
                return d !== resetDelay - 1;
            })
            .classed('fdg-invisible', function (d) {
                return d === resetDelay - 1;
            });
    }

    function sidebar(main) {
        var sidebar = addElement('sidebar', main);
        var legends = addElement('legends', sidebar);
        var progress = addElement('progress', sidebar);
        var timer = addElement('timer', progress).classed('fdg-sidebar__label', true);
        var stopwatch = addStopwatch.call(this, progress);
        var countdown = addCountdown.call(this, progress);
        var freqTable = addElement('freq-table', sidebar);
        return {
            sidebar: sidebar,
            legends: legends,
            stopwatch: stopwatch,
            progress: progress,
            timer: timer,
            countdown: countdown,
            freqTable: freqTable,
        };
    }

    function canvas(main) {
        var animation = addElement('animation', main);
        this.settings.width = animation.node().clientWidth;
        this.settings.height = animation.node().clientHeight; // progress bar at top

        var progressBar = addElement('progress-bar', animation);
        var progressDay = addElement('progress-day', animation); // background SVG

        var svgBackground = addElement('svg--background', animation, 'svg')
            .attr('width', this.settings.width)
            .attr('height', this.settings.height); // canvas

        var canvas = addElement('canvas', animation, 'canvas')
            .attr('width', this.settings.width)
            .attr('height', this.settings.height);
        canvas.context = canvas.node().getContext('2d'); // SVG

        var svgForeground = addElement('svg--foreground', animation, 'svg')
            .attr('width', this.settings.width)
            .attr('height', this.settings.height);
        var focusAnnotations = addElement('focus-annotations', svgForeground, 'g'); // modal

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
            progressBar: progressBar,
            progressDay: progressDay,
            svgBackground: svgBackground,
            canvas: canvas,
            svgForeground: svgForeground,
            focusAnnotations: focusAnnotations,
            modal: modal,
        };
    }

    function coordinates(metadata) {
        var _this = this;

        // Dimensions of canvas.
        this.settings.orbitRadius = this.settings.width / (metadata.orbit.length + 1); // Calculate coordinates of event focus.

        var centerX = this.settings.orbitRadius / 2;
        var centerY = this.settings.height / 2;
        var theta =
            (2 * Math.PI) /
            (this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral - 1);
        metadata.event.forEach(function (event, i) {
            // Define radius of the orbit on which the event focus will appear.
            event.radius = event.order * _this.settings.orbitRadius; // Define angle of event focus.

            event.theta = (2 * Math.PI * event.position) / 360; // Define position along orbit on which the event focus will appear.

            event.x =
                event.order === 0
                    ? centerX
                    : centerX +
                      event.radius * // number of orbit radii from the center
                          Math.cos(event.theta); // position along the circle at the given orbit along which

            event.y =
                event.order === 0
                    ? centerY
                    : centerY +
                      event.radius * // number of orbit radii from the center
                          Math.sin(event.theta); // y-position of the along the given orbit at which the focus circle at the
        }); // Calculate dimensions of orbits.

        metadata.orbit.forEach(function (d, i) {
            d.cx = centerX;
            d.cy = centerY;
            d.r = (i + 1) * _this.settings.orbitRadius;
        });
    }

    function restartForceSimulation() {
        // Remove centering force after first interval.
        if (this.settings.timepoint > 0 && !!this.forceSimulation)
            this.forceSimulation.force('center', null); // Reheat the simulation (alpha(1)) and update the coordinates of the x- and y- forces.

        this.forceSimulation
            .alpha(1)
            .force(
                'x',
                d3
                    .forceX()
                    .x(function (d) {
                        return d.value.coordinates.x;
                    })
                    .strength(0.3)
            )
            .force(
                'y',
                d3
                    .forceY()
                    .y(function (d) {
                        return d.value.coordinates.y;
                    })
                    .strength(0.3)
            )
            .restart();
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
        var body = source.substring(start) + (sourcemap ? '//# sourceMappingURL=' + sourcemap : '');
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

    var WorkerFactory = createBase64WorkerFactory(
        'Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1kaXNwYXRjaC52Mi5taW4uanMnKTsKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1xdWFkdHJlZS52Mi5taW4uanMnKTsKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy10aW1lci52Mi5taW4uanMnKTsKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1mb3JjZS52Mi5taW4uanMnKTsgLy9zZWxmLmltcG9ydFNjcmlwdHMoJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZDMtZm9yY2UtcmV1c2VAMS4wLjEvYnVpbGQvZDMtZm9yY2UtcmV1c2UubWluLmpzJyk7CgogICAgc2VsZi5pbXBvcnRTY3JpcHRzKCdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2QzLWZvcmNlLXNhbXBsZWRAMS4wLjAvYnVpbGQvZDMtZm9yY2Utc2FtcGxlZC5taW4uanMnKTsKCiAgICBvbm1lc3NhZ2UgPSBmdW5jdGlvbiBvbm1lc3NhZ2UoZXZlbnQpIHsKICAgICAgdmFyIF9ldmVudCRkYXRhID0gZXZlbnQuZGF0YSwKICAgICAgICAgIG5vZGVzID0gX2V2ZW50JGRhdGEubm9kZXMsCiAgICAgICAgICBsYXlvdXQgPSBfZXZlbnQkZGF0YS5sYXlvdXQsCiAgICAgICAgICBzdHJlbmd0aCA9IF9ldmVudCRkYXRhLnN0cmVuZ3RoLAogICAgICAgICAgb3JiaXRSYWRpdXMgPSBfZXZlbnQkZGF0YS5vcmJpdFJhZGl1cywKICAgICAgICAgIHggPSBfZXZlbnQkZGF0YS54LAogICAgICAgICAgeSA9IF9ldmVudCRkYXRhLnksCiAgICAgICAgICByYWRpdXMgPSBfZXZlbnQkZGF0YS5yYWRpdXMsCiAgICAgICAgICBpZCA9IF9ldmVudCRkYXRhLmlkOwogICAgICB2YXIgc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbigpLm5vZGVzKG5vZGVzKTsKICAgICAgaWYgKGxheW91dCA9PT0gJ2NpcmN1bGFyJykgc2ltdWxhdGlvbi5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhyYWRpdXMgKyAwLjUpKSAvLyBjb2xsaXNpb24gZGV0ZWN0aW9uCiAgICAgIC8vLmZvcmNlKCdjaGFyZ2UnLCBkMy5mb3JjZU1hbnlCb2R5KCkuc3RyZW5ndGgoc3RyZW5ndGgpKSAvLyBjaGFyZ2UKICAgICAgLy8uZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHlSZXVzZSgpLnN0cmVuZ3RoKHN0cmVuZ3RoKSkgLy8gY2hhcmdlCiAgICAgIC5mb3JjZSgnY2hhcmdlJywgZDMuZm9yY2VNYW55Qm9keVNhbXBsZWQoKS5zdHJlbmd0aChzdHJlbmd0aCkpIC8vIGNoYXJnZQogICAgICAuZm9yY2UoJ3gnLCBkMy5mb3JjZVgoeCkuc3RyZW5ndGgoMC4zKSkuZm9yY2UoJ3knLCBkMy5mb3JjZVkoeSkuc3RyZW5ndGgoMC4zKSk7ZWxzZSBpZiAobGF5b3V0ID09PSAncmFkaWFsJykgc2ltdWxhdGlvbi5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhyYWRpdXMgKyAwLjUpKSAvLyBjb2xsaXNpb24gZGV0ZWN0aW9uCiAgICAgIC5mb3JjZSgncicsIGQzLmZvcmNlUmFkaWFsKG9yYml0UmFkaXVzIC8gMikpOyAvLyBwb3NpdGlvbmluZwogICAgICAvLyBzdG9wIHNpbXVsYXRpb24KCiAgICAgIHNpbXVsYXRpb24uc3RvcCgpOyAvLyBpbmNyZW1lbnQgc2ltdWxhdGlvbiBtYW51YWxseQoKICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBNYXRoLmNlaWwoTWF0aC5sb2coc2ltdWxhdGlvbi5hbHBoYU1pbigpKSAvIE1hdGgubG9nKDEgLSBzaW11bGF0aW9uLmFscGhhRGVjYXkoKSkpOyBpIDwgbjsgKytpKSB7CiAgICAgICAgc2ltdWxhdGlvbi50aWNrKCk7CiAgICAgIH0gLy8gcmV0dXJuIHVwZGF0ZWQgbm9kZXMgYXJyYXkgdG8gYmUgZHJhd24gYW5kIHJlbmRlcmVkCgoKICAgICAgcG9zdE1lc3NhZ2UoewogICAgICAgIG5vZGVzOiBub2RlcywKICAgICAgICByYWRpdXM6IHJhZGl1cywKICAgICAgICBpZDogaWQKICAgICAgfSk7CiAgICB9OwoKfSgpKTsKCg==',
        'data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yY2VTaW11bGF0aW9uV29ya2VyLmpzIiwic291cmNlcyI6WyJzcmMvaW5pdC9hZGRTdGF0aWNGb3JjZVNpbXVsYXRpb24vZm9yY2VTaW11bGF0aW9uV29ya2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1kaXNwYXRjaC52Mi5taW4uanMnKTtcclxuc2VsZi5pbXBvcnRTY3JpcHRzKCdodHRwczovL2QzanMub3JnL2QzLXF1YWR0cmVlLnYyLm1pbi5qcycpO1xyXG5zZWxmLmltcG9ydFNjcmlwdHMoJ2h0dHBzOi8vZDNqcy5vcmcvZDMtdGltZXIudjIubWluLmpzJyk7XHJcbnNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1mb3JjZS52Mi5taW4uanMnKTtcclxuLy9zZWxmLmltcG9ydFNjcmlwdHMoJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZDMtZm9yY2UtcmV1c2VAMS4wLjEvYnVpbGQvZDMtZm9yY2UtcmV1c2UubWluLmpzJyk7XHJcbnNlbGYuaW1wb3J0U2NyaXB0cyhcclxuICAgICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2QzLWZvcmNlLXNhbXBsZWRAMS4wLjAvYnVpbGQvZDMtZm9yY2Utc2FtcGxlZC5taW4uanMnXHJcbik7XHJcblxyXG5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgICBub2RlcywgLy8gZGF0YVxyXG4gICAgICAgIGxheW91dCxcclxuICAgICAgICBzdHJlbmd0aCxcclxuICAgICAgICBvcmJpdFJhZGl1cywgLy8gZm9yY2Ugc2ltdWxhdGlvbiBzZXR0aW5nc1xyXG4gICAgICAgIHgsXHJcbiAgICAgICAgeSwgLy8gY29vcmRpbmF0ZXNcclxuICAgICAgICByYWRpdXMsXHJcbiAgICAgICAgaWQsXHJcbiAgICB9ID0gZXZlbnQuZGF0YTtcclxuXHJcbiAgICBjb25zdCBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKCkubm9kZXMobm9kZXMpO1xyXG5cclxuICAgIGlmIChsYXlvdXQgPT09ICdjaXJjdWxhcicpXHJcbiAgICAgICAgc2ltdWxhdGlvblxyXG4gICAgICAgICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMocmFkaXVzICsgMC41KSkgLy8gY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAvLy5mb3JjZSgnY2hhcmdlJywgZDMuZm9yY2VNYW55Qm9keSgpLnN0cmVuZ3RoKHN0cmVuZ3RoKSkgLy8gY2hhcmdlXHJcbiAgICAgICAgICAgIC8vLmZvcmNlKCdjaGFyZ2UnLCBkMy5mb3JjZU1hbnlCb2R5UmV1c2UoKS5zdHJlbmd0aChzdHJlbmd0aCkpIC8vIGNoYXJnZVxyXG4gICAgICAgICAgICAuZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHlTYW1wbGVkKCkuc3RyZW5ndGgoc3RyZW5ndGgpKSAvLyBjaGFyZ2VcclxuICAgICAgICAgICAgLmZvcmNlKCd4JywgZDMuZm9yY2VYKHgpLnN0cmVuZ3RoKDAuMykpXHJcbiAgICAgICAgICAgIC5mb3JjZSgneScsIGQzLmZvcmNlWSh5KS5zdHJlbmd0aCgwLjMpKTtcclxuICAgIGVsc2UgaWYgKGxheW91dCA9PT0gJ3JhZGlhbCcpXHJcbiAgICAgICAgc2ltdWxhdGlvblxyXG4gICAgICAgICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMocmFkaXVzICsgMC41KSkgLy8gY29sbGlzaW9uIGRldGVjdGlvblxyXG4gICAgICAgICAgICAuZm9yY2UoJ3InLCBkMy5mb3JjZVJhZGlhbChvcmJpdFJhZGl1cyAvIDIpKTsgLy8gcG9zaXRpb25pbmdcclxuXHJcbiAgICAvLyBzdG9wIHNpbXVsYXRpb25cclxuICAgIHNpbXVsYXRpb24uc3RvcCgpO1xyXG5cclxuICAgIC8vIGluY3JlbWVudCBzaW11bGF0aW9uIG1hbnVhbGx5XHJcbiAgICBmb3IgKFxyXG4gICAgICAgIHZhciBpID0gMCxcclxuICAgICAgICAgICAgbiA9IE1hdGguY2VpbChNYXRoLmxvZyhzaW11bGF0aW9uLmFscGhhTWluKCkpIC8gTWF0aC5sb2coMSAtIHNpbXVsYXRpb24uYWxwaGFEZWNheSgpKSk7XHJcbiAgICAgICAgaSA8IG47XHJcbiAgICAgICAgKytpXHJcbiAgICApIHtcclxuICAgICAgICBzaW11bGF0aW9uLnRpY2soKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gdXBkYXRlZCBub2RlcyBhcnJheSB0byBiZSBkcmF3biBhbmQgcmVuZGVyZWRcclxuICAgIHBvc3RNZXNzYWdlKHsgbm9kZXMsIHJhZGl1cywgaWQgfSk7XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJzZWxmIiwiaW1wb3J0U2NyaXB0cyIsIm9ubWVzc2FnZSIsImV2ZW50IiwiZGF0YSIsIm5vZGVzIiwibGF5b3V0Iiwic3RyZW5ndGgiLCJvcmJpdFJhZGl1cyIsIngiLCJ5IiwicmFkaXVzIiwiaWQiLCJzaW11bGF0aW9uIiwiZDMiLCJmb3JjZVNpbXVsYXRpb24iLCJmb3JjZSIsImZvcmNlQ29sbGlkZSIsImZvcmNlTWFueUJvZHlTYW1wbGVkIiwiZm9yY2VYIiwiZm9yY2VZIiwiZm9yY2VSYWRpYWwiLCJzdG9wIiwiaSIsIm4iLCJNYXRoIiwiY2VpbCIsImxvZyIsImFscGhhTWluIiwiYWxwaGFEZWNheSIsInRpY2siLCJwb3N0TWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7O0lBQUFBLElBQUksQ0FBQ0MsYUFBTCxDQUFtQix3Q0FBbkI7SUFDQUQsSUFBSSxDQUFDQyxhQUFMLENBQW1CLHdDQUFuQjtJQUNBRCxJQUFJLENBQUNDLGFBQUwsQ0FBbUIscUNBQW5CO0lBQ0FELElBQUksQ0FBQ0MsYUFBTCxDQUFtQixxQ0FBbkI7O0lBRUFELElBQUksQ0FBQ0MsYUFBTCxDQUNJLG1GQURKOztJQUlBQyxTQUFTLEdBQUcsbUJBQVVDLEtBQVYsRUFBaUI7SUFBQSxvQkFVckJBLEtBQUssQ0FBQ0MsSUFWZTtJQUFBLE1BRXJCQyxLQUZxQixlQUVyQkEsS0FGcUI7SUFBQSxNQUdyQkMsTUFIcUIsZUFHckJBLE1BSHFCO0lBQUEsTUFJckJDLFFBSnFCLGVBSXJCQSxRQUpxQjtJQUFBLE1BS3JCQyxXQUxxQixlQUtyQkEsV0FMcUI7SUFBQSxNQU1yQkMsQ0FOcUIsZUFNckJBLENBTnFCO0lBQUEsTUFPckJDLENBUHFCLGVBT3JCQSxDQVBxQjtJQUFBLE1BUXJCQyxNQVJxQixlQVFyQkEsTUFScUI7SUFBQSxNQVNyQkMsRUFUcUIsZUFTckJBLEVBVHFCO0lBWXpCLE1BQU1DLFVBQVUsR0FBR0MsRUFBRSxDQUFDQyxlQUFILEdBQXFCVixLQUFyQixDQUEyQkEsS0FBM0IsQ0FBbkI7SUFFQSxNQUFJQyxNQUFNLEtBQUssVUFBZixFQUNJTyxVQUFVLENBQ0xHLEtBREwsQ0FDVyxTQURYLEVBQ3NCRixFQUFFLENBQUNHLFlBQUgsR0FBa0JOLE1BQWxCLENBQXlCQSxNQUFNLEdBQUcsR0FBbEMsQ0FEdEI7SUFFSTtJQUNBO0lBSEosR0FJS0ssS0FKTCxDQUlXLFFBSlgsRUFJcUJGLEVBQUUsQ0FBQ0ksb0JBQUgsR0FBMEJYLFFBQTFCLENBQW1DQSxRQUFuQyxDQUpyQjtJQUFBLEdBS0tTLEtBTEwsQ0FLVyxHQUxYLEVBS2dCRixFQUFFLENBQUNLLE1BQUgsQ0FBVVYsQ0FBVixFQUFhRixRQUFiLENBQXNCLEdBQXRCLENBTGhCLEVBTUtTLEtBTkwsQ0FNVyxHQU5YLEVBTWdCRixFQUFFLENBQUNNLE1BQUgsQ0FBVVYsQ0FBVixFQUFhSCxRQUFiLENBQXNCLEdBQXRCLENBTmhCLEVBREosS0FRSyxJQUFJRCxNQUFNLEtBQUssUUFBZixFQUNETyxVQUFVLENBQ0xHLEtBREwsQ0FDVyxTQURYLEVBQ3NCRixFQUFFLENBQUNHLFlBQUgsR0FBa0JOLE1BQWxCLENBQXlCQSxNQUFNLEdBQUcsR0FBbEMsQ0FEdEI7SUFBQSxHQUVLSyxLQUZMLENBRVcsR0FGWCxFQUVnQkYsRUFBRSxDQUFDTyxXQUFILENBQWViLFdBQVcsR0FBRyxDQUE3QixDQUZoQixFQXZCcUI7SUEyQnpCOztJQUNBSyxFQUFBQSxVQUFVLENBQUNTLElBQVgsR0E1QnlCOztJQStCekIsT0FDSSxJQUFJQyxDQUFDLEdBQUcsQ0FBUixFQUNJQyxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVRCxJQUFJLENBQUNFLEdBQUwsQ0FBU2QsVUFBVSxDQUFDZSxRQUFYLEVBQVQsSUFBa0NILElBQUksQ0FBQ0UsR0FBTCxDQUFTLElBQUlkLFVBQVUsQ0FBQ2dCLFVBQVgsRUFBYixDQUE1QyxDQUZaLEVBR0lOLENBQUMsR0FBR0MsQ0FIUixFQUlJLEVBQUVELENBSk4sRUFLRTtJQUNFVixJQUFBQSxVQUFVLENBQUNpQixJQUFYO0lBQ0gsR0F0Q3dCOzs7SUF5Q3pCQyxFQUFBQSxXQUFXLENBQUM7SUFBRTFCLElBQUFBLEtBQUssRUFBTEEsS0FBRjtJQUFTTSxJQUFBQSxNQUFNLEVBQU5BLE1BQVQ7SUFBaUJDLElBQUFBLEVBQUUsRUFBRkE7SUFBakIsR0FBRCxDQUFYO0lBQ0gsQ0ExQ0Q7Ozs7OzsifQ==',
        false
    );
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
            id: id,
        });
        return worker;
    }

    function draw(worker, color) {
        var main = this;

        worker.onmessage = function (event) {
            var className = 'fdg-static--'.concat(event.data.id.replace(/[^0-9_a-z]/gi, '-'));
            main.containers.svgBackground.selectAll('.'.concat(className)).remove();
            var g = main.containers.svgBackground
                .insert('g', ':first-child')
                .classed('fdg-static '.concat(className), true); // translate to the central focus

            if (main.settings.staticLayout == 'radial')
                g.attr(
                    'transform',
                    'translate('
                        .concat(main.settings.orbitRadius / 2, ',')
                        .concat(main.settings.height / 2, ')')
                );
            var marks = g
                .selectAll('.fdg-static__mark')
                .data(event.data.nodes)
                .join(main.settings.shape === 'circle' ? 'circle' : 'rect')
                .classed('fdg-static__mark', true)
                .attr('fill', function (d) {
                    return d.color;
                })
                .attr('fill-opacity', 0.25);
            if (main.settings.shape === 'circle')
                marks
                    .attr('cx', function (d) {
                        return d.x;
                    })
                    .attr('cy', function (d) {
                        return d.y;
                    })
                    .attr('r', event.data.radius);
            else
                marks
                    .attr('x', function (d) {
                        return d.x - event.data.radius;
                    })
                    .attr('y', function (d) {
                        return d.y - event.data.radius;
                    })
                    .attr('width', event.data.radius * 2)
                    .attr('height', event.data.radius * 2);
        };
    }

    function addStaticForceSimulation() {
        var _this = this;

        if (this.settings.drawStaticSeparately) {
            this.containers.svgBackground.selectAll('.fdg-static').remove(); // Capture individuals without state change.

            var noStateChange = this.data.nested
                .filter(function (d) {
                    return d.value.noStateChange;
                })
                .map(function (d) {
                    return {
                        key: d.key,
                        colorValue: d.value.colorValue,
                        color: d.value.color,
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
                var worker = simulate.call(
                    this,
                    noStateChange,
                    this.settings.orbitRadius / 2,
                    this.settings.height / 2,
                    'main'
                ); // Pass web worker to draw function.

                draw.call(this, worker);
            }
        }
    }

    function getState(group, index) {
        var _this = this;

        var state =
            index !== undefined
                ? group[index]
                : group.find(function (d, i) {
                      return (
                          (d.start_timepoint <= _this.settings.timepoint &&
                              _this.settings.timepoint <= d.end_timepoint) ||
                          i === group.length - 1
                      );
                  });
        return state;
    }

    function countStateChanges(group) {
        var _this = this;

        var nStateChanges = group
            .filter(function (d) {
                return d.start_timepoint <= _this.settings.timepoint;
            })
            .sort(function (a, b) {
                return a.start_timepoint - b.start_timepoint;
            })
            .filter(function (d, i, data) {
                var eventPrevious = data[i - 1] ? data[i - 1].event : null;
                return (
                    !_this.settings.eventChangeCount.includes(eventPrevious) &&
                    _this.settings.eventChangeCount.includes(d.event)
                );
            }).length;
        return nStateChanges;
    }

    function getAestheticValues(group, state) {
        var colorValue =
            this.settings.colorBy.type === 'frequency'
                ? countStateChanges.call(this, group)
                : this.settings.colorBy.variable !== null
                ? state[this.settings.colorBy.variable]
                : null;
        var sizeValue =
            this.settings.sizeBy.type === 'frequency'
                ? countStateChanges.call(this, group)
                : this.settings.sizeBy.variable !== null
                ? state[this.settings.sizeBy.variable]
                : null;
        var shapeValue =
            this.settings.shapeBy.type === 'frequency'
                ? countStateChanges.call(this, group)
                : this.settings.shapeBy.variable !== null
                ? state[this.settings.shapeBy.variable]
                : null;
        return {
            colorValue: colorValue,
            sizeValue: sizeValue,
            shapeValue: shapeValue,
        };
    }

    function getCoordinates(state, colorValue) {
        var destination =
            this.settings.stratify && this.settings.colorBy.stratify
                ? this.metadata.event
                      .find(function (event) {
                          return event.value === state.event;
                      })
                      .foci.find(function (focus) {
                          return focus.key === colorValue;
                      })
                : this.metadata.event.find(function (event) {
                      return event.value === state.event;
                  });
        var coordinates = {
            x: destination.x,
            y: destination.y,
        };
        return coordinates;
    }

    function getColorScale(colorValue) {
        var colorScale =
            this.settings.stratify && this.settings.sizeBy.type === 'frequency'
                ? this.metadata.strata.find(function (stratum) {
                      return stratum.key === colorValue;
                  }).colorScale
                : this.scales.color;
        return colorScale;
    }

    function getColor(scale, value) {
        var color = scale !== undefined ? scale(value) : 'rgb(170,170,170)';
        var fill = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
        var stroke = color.replace('rgb', 'rgba').replace(')', ', 1)');
        return {
            color: color,
            fill: fill,
            stroke: stroke,
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
        return _objectSpread2(
            _objectSpread2({}, color),
            {},
            {
                // color, fill, stroke
                size: size,
                shape: shape,
            }
        );
    }

    function nestedData() {
        var _this = this;

        this.data.nested.forEach(function (d) {
            // Update individual to next event.
            var currentState = getState.call(_this, d.value.group);

            if (d.value.state !== currentState) {
                d.value.statePrevious = d.value.state;
                d.value.state = currentState;
            }

            var aestheticValues = getAestheticValues.call(_this, d.value.group, d.value.state);
            d.value.coordinates = getCoordinates.call(
                _this,
                d.value.state,
                aestheticValues.colorValue
            );
            d.value.colorScale = getColorScale.call(_this, aestheticValues.colorValue);
            var aesthetics = getAesthetics.call(_this, aestheticValues, d.value.colorScale);
            Object.assign(d.value, aestheticValues, aesthetics);
        });
    }

    // Record change in number of IDs at each focus at current timepoint.
    function eventMetadata() {
        var _this = this;

        this.metadata.event.forEach(function (event) {
            event.data = _this.data.nested.filter(function (d, i) {
                return d.value.state.event === event.value;
            });
            event.count = event.data.length;
            event.proportion = event.count / event.denominator;
            event.proportionFmt = d3.format('.1%')(event.proportion);
            event.cumulative = _this.data.filter(function (d) {
                return d.event === event.value && d.start_timepoint <= _this.settings.timepoint;
            }).length;
            event.countFmt = d3.format(',d')(event.count);
            event.countProportionFmt = ''
                .concat(event.countFmt, ' (')
                .concat(event.proportionFmt, ')');
            event.cumulativeFmt = d3.format(',d')(event.cumulative);
            event.cells = [event.label, event.countProportionFmt, event.cumulativeFmt];
            event.change = event.count - event.prevCount;
            if (event.foci)
                event.foci.forEach(function (focus) {
                    focus.data = event.data.filter(function (d, i) {
                        return d.value.colorValue === focus.key;
                    });
                    focus.count = focus.data.length;
                    focus.proportion = focus.count / focus.denominator;
                    focus.proportionFmt = d3.format('.1%')(focus.proportion);
                    focus.cumulative = _this.data.filter(function (d) {
                        return (
                            d.event === event.value &&
                            d.colorValue === focus.key &&
                            d.start_timepoint <= _this.settings.timepoint
                        );
                    }).length;
                    focus.countFmt = d3.format(',d')(focus.count);
                    focus.countProportionFmt = ''
                        .concat(focus.countFmt, ' (')
                        .concat(focus.proportionFmt, ')');
                    focus.cumulativeFmt = d3.format(',d')(focus.cumulative);
                    focus.cells = [focus.label, focus.countProportionFmt, focus.cumulativeFmt];
                    focus.change = focus.count - focus.prevCount;
                });
        });
    }

    function data() {
        // Count the number of individuals at each focus at previous timepoint.
        this.metadata.event.forEach(function (event) {
            event.prevCount = event.count;
            if (event.foci)
                event.foci.forEach(function (focus) {
                    focus.prevCount = focus.count;
                });
        });
        nestedData.call(this);
        eventMetadata.call(this);
    }

    function resize() {
        var node = this.containers.animation.node();
        this.settings.width = node.clientWidth;
        this.settings.height = this.containers.animation.node().clientHeight; // stopwatch

        this.containers.stopwatch.width = this.containers.stopwatch.node().clientWidth;
        this.containers.stopwatch.innerRadius = this.containers.stopwatch.width / 8;
        this.containers.stopwatch.svg
            .attr('width', this.containers.stopwatch.width)
            .attr('height', this.containers.stopwatch.width);
        this.containers.stopwatch.arc
            .innerRadius(this.containers.stopwatch.innerRadius)
            .outerRadius(this.containers.stopwatch.width / 2 - 1);
        this.containers.stopwatch.g.attr(
            'transform',
            'translate('
                .concat(this.containers.stopwatch.width / 2, ',')
                .concat(this.containers.stopwatch.width / 2, ')')
        );
        this.containers.stopwatch.background.attr('d', this.containers.stopwatch.arc);
        this.containers.stopwatch.foreground.attr('d', this.containers.stopwatch.arc); // background SVG

        this.containers.svgBackground
            .attr('width', this.settings.width)
            .attr('height', this.settings.height); // canvas

        this.containers.canvas
            .attr('width', this.settings.width)
            .attr('height', this.settings.height); // SVG

        this.containers.svgForeground
            .attr('width', this.settings.width)
            .attr('height', this.settings.height);
        coordinates.call(this, this.metadata); // orbits

        this.orbits
            .attr('cx', function (d) {
                return d.cx;
            })
            .attr('cy', function (d) {
                return d.cy;
            })
            .attr('r', function (d) {
                return d.r;
            }); // focus coordinates

        if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
            this.metadata.event.forEach(function (event, i) {
                // Update coordinates of categorical foci.
                event.foci.forEach(function (focus, j) {
                    focus.x = event.x + 50 * Math.cos(focus.angle);
                    focus.dx = event.x + (i === 0 ? 75 : 50) * Math.cos(focus.angle);
                    focus.y = event.y + 50 * Math.sin(focus.angle);
                    focus.dy = event.y + (i === 0 ? 75 : 50) * Math.sin(focus.angle);
                });
                event.fociLabels
                    .selectAll('text.fdg-focus-annotation__text')
                    .attr('x', function (d) {
                        return d.dx;
                    })
                    .attr('y', function (d) {
                        return d.dy;
                    });
            });
        } // Update the node data.

        data.call(this);
        restartForceSimulation.call(this); // static force simulation

        addStaticForceSimulation.call(this); // focus annotations

        this.focusAnnotations.attr('transform', function (d) {
            return 'translate('.concat(d.x, ',').concat(d.y, ')');
        });
    }

    function layout() {
        var main = addElement('main', d3.select(this.element)); // controls positioned absolutely

        var controls$1 = controls.call(this, main); // sidebar to the left

        var sidebar$1 = sidebar.call(this, main); // animation to the right

        var canvas$1 = canvas.call(this, main); // add resize event

        window.addEventListener('resize', resize.bind(this));
        return _objectSpread2(
            _objectSpread2(
                _objectSpread2(
                    {
                        main: main,
                    },
                    controls$1
                ),
                sidebar$1
            ),
            canvas$1
        );
    }

    function id() {
        var _this = this;

        var nest = d3
            .nest()
            .key(function (d) {
                return d.id;
            })
            .rollup(function (group) {
                return {
                    duration: d3.sum(group, function (d) {
                        return +d.duration;
                    }),
                    static: group.length === 1,
                    colorStratum:
                        _this.settings.colorBy.type === 'categorical'
                            ? group[0][_this.settings.colorBy.variable]
                            : null,
                    shapeStratum:
                        _this.settings.shapeBy.type === 'categorical'
                            ? group[0][_this.settings.shapeBy.variable]
                            : null,
                };
            })
            .entries(this.data);
        nest.forEach(function (d, i) {
            Object.assign(d, d.value);
            d.value = d.key;
            delete d.key;
        });
        return nest;
    }

    function updateIdDependentSettings(metadata) {
        var _this = this;

        this.settings.duration =
            this.settings.duration ||
            d3.max(metadata.id, function (id) {
                return id.duration;
            });
        this.settings.text = this.settings.text
            .filter(function (text) {
                return (
                    // Remove if:
                    //   - text contains static
                    //   - there are no static IDs
                    //   - static IDs are drawn separately
                    !(
                        /static/i.test(text) &&
                        (metadata.id.every(function (id) {
                            return id['static'] === false;
                        }) ||
                            _this.settings.drawStaticSeparately === false)
                    )
                );
            })
            .map(function (text) {
                return text.replace('[duration]', d3.format(',d')(_this.settings.duration));
            });
        this.settings.minRadius =
            this.settings.minRadius ||
            Math.min(
                3000 /
                    metadata.id.filter(function (d) {
                        return !(_this.settings.drawStaticSeparately && d['static']);
                    }).length,
                this.settings.maxRadius
            );
        this.settings.staticRadius = this.settings.staticRadius || 3000 / metadata.id.length;
        this.settings.maxRadius = this.settings.minRadius + this.settings.colorBy.nColors;
        this.settings.chargeStrength = -(
            2000 /
            metadata.id.filter(function (d) {
                return !(_this.settings.drawStaticSeparately && d['static']);
            }).length
        );
        this.settings.staticChargeStrength = -(2000 / metadata.id.length);
        this.settings.fill = this.settings.fill || metadata.id.length <= 2500;
    }

    function event() {
        var nest = d3
            .nest()
            .key(function (d) {
                return d.event;
            })
            .rollup(function (group) {
                var event = group[0];
                var order = parseInt(event.event_order);
                var position = event.hasOwnProperty('event_position')
                    ? parseInt(event.event_position)
                    : null;
                return {
                    order: order,
                    position: position,
                    count: 0,
                    prevCount: 0,
                    cumulative: 0,
                    nEvents: group.length,
                };
            })
            .entries(this.data);
        nest.forEach(function (event) {
            Object.assign(event, event.value);
            event.value = event.key;
            delete event.key;
        }); // Define position of event focus along orbit.

        d3.nest()
            .key(function (d) {
                return d.order;
            })
            .rollup(function (group) {
                var n = group.length;
                var range = d3.range(-45, 46);
                group.forEach(function (d, i) {
                    d.position =
                        d.position === null ? d3.quantile(range, (i + 1) / (n + 1)) : d.position;
                });
            })
            .entries(nest); // Ensure events plot in order.

        nest.sort(function (a, b) {
            return a.order - b.order || b.nEvents - a.nEvents;
        });
        return nest;
    }

    function updateEventDependentSettings(metadata) {
        this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].value;
        this.settings.nFoci =
            this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral; // number of event types minus one

        this.settings.eventChangeCount =
            this.settings.eventChangeCount ||
            metadata.event.slice(1).map(function (event) {
                return event.value;
            });
    }

    function orbit(metadata) {
        var _this = this;

        var nest = d3
            .nest()
            .key(function (d) {
                return d.order;
            })
            .entries(
                metadata.event.filter(function (event) {
                    return event.value !== _this.settings.eventCentral;
                })
            );
        return nest;
    }

    function strata(metadata) {
        var _this = this;

        var nest;

        if (this.settings.stratify) {
            nest = d3
                .nest()
                .key(function (d) {
                    return d[_this.settings.colorBy.variable];
                })
                .entries(this.data)
                .sort(function (a, b) {
                    return a.key < b.key ? -1 : 1;
                });
            this.settings.colorBy.nStrata = nest.length;
            this.settings.colorBy.theta = (2 * Math.PI) / this.settings.colorBy.nStrata;
            nest.forEach(function (stratum, i) {
                stratum.value = stratum.key;
                var colorScheme = _this.settings.colorBy.colorSchemes[i];
                stratum.colorScheme =
                    d3[
                        'scheme'
                            .concat(colorScheme.substring(0, 1).toUpperCase())
                            .concat(colorScheme.substring(1), 's')
                    ]; // domain: number of recurrent events
                //  range: sequential, single-hue color scheme of the same length

                stratum.colorScale = d3
                    .scaleLinear()
                    .domain(d3.range(_this.settings.nColors))
                    .range(
                        stratum.colorScheme[9].reverse().slice(0, _this.settings.nColors).reverse()
                    )
                    .clamp(true);
                stratum.nParticipants = metadata.id.filter(function (d) {
                    return d.colorStratum === stratum.value;
                }).length;
                stratum.nEvents = stratum.values.length; // TODO: figure out how to shift the foci to match the order in the legend

                stratum.angle =
                    _this.settings.colorBy.nStrata % 2
                        ? i * _this.settings.colorBy.theta
                        : i * _this.settings.colorBy.theta +
                          Math.PI / _this.settings.colorBy.nStrata;
            });
        }

        return nest;
    }

    function shape(metadata) {
        var _this = this;

        var nest;

        if (this.settings.shapify) {
            nest = d3
                .nest()
                .key(function (d) {
                    return d[_this.settings.shapeBy.variable];
                })
                .entries(this.data)
                .sort(function (a, b) {
                    return a.key < b.key ? -1 : 1;
                });
        }

        return nest;
    }

    function color(metadata) {
        var colorBy = this.settings.colorBy; // scale domain

        var domain =
            colorBy.type === 'frequency'
                ? d3.range(colorBy.nColors)
                : colorBy.type === 'continuous'
                ? d3.extent(this.data, function (d) {
                      return d[colorBy.variable];
                  })
                : colorBy.type === 'categorical'
                ? metadata.strata.map(function (d) {
                      return d.key;
                  })
                : null; // scale

        var range;
        var scale;

        switch (colorBy.type) {
            case 'frequency':
                range = colorBy.mirror
                    ? d3['scheme'.concat(colorBy.colorScheme)][colorBy.nColors].reverse()
                    : d3['scheme'.concat(colorBy.colorScheme)][colorBy.nColors];
                scale = d3.scaleLinear().domain(domain).range(range).clamp(true);
                break;

            case 'continuous':
                scale = d3
                    .scaleSequential(d3['interpolate'.concat(colorBy.colorScheme)])
                    .domain(domain); // Invert color scale.

                if (colorBy.mirror) {
                    var interpolator = scale.interpolator(); // read the color scale's interpolator

                    var mirror = function mirror(t) {
                        return interpolator(1 - t);
                    }; // returns the mirror image of the interpolator

                    scale.interpolator(mirror); // updates the scale's interpolator
                }

                break;

            case 'categorical':
                var scheme = d3['scheme'.concat(colorBy.colorScheme)];
                range = scheme.every(function (el) {
                    return typeof el === 'string';
                })
                    ? scheme
                    : scheme[Math.min(Math.max(3, domain.length), 9)];
                scale = d3
                    .scaleOrdinal()
                    .domain(domain)
                    .range(
                        range.map(function (color) {
                            return d3.rgb(color) + '';
                        })
                    );
                break;

            default:
                scale = null;
        }

        return scale;
    }

    function size(metadata) {
        var sizeBy = this.settings.sizeBy; // scale domain

        var domain =
            sizeBy.type === 'frequency'
                ? [0, this.settings.colorBy.nColors]
                : sizeBy.type === 'continuous'
                ? d3.extent(this.data, function (d) {
                      return d[sizeBy.variable];
                  })
                : null; // scale range

        var range = [this.settings.minRadius, this.settings.maxRadius]; // scale

        var scale = d3.scaleLinear().domain(domain).range(range).clamp(true);
        return scale;
    }

    function shape$1(metadata) {
        var scale;

        if (this.settings.shapify) {
            var shapeBy = this.settings.shapeBy; // scale domain

            var domain =
                shapeBy.type === 'categorical'
                    ? metadata.shape.map(function (d) {
                          return d.key;
                      })
                    : null; // scale range

            var range = shapeBy.shapes; // scale

            scale = d3.scaleOrdinal().domain(domain).range(range);
        }

        return scale;
    }

    function scales(metadata) {
        var color$1 = color.call(this, metadata);
        var size$1 = size.call(this, metadata);
        var shape = shape$1.call(this, metadata);
        return {
            color: color$1,
            size: size$1,
            shape: shape,
        };
    }

    function focus(metadata) {
        if (this.settings.colorBy.type === 'categorical') {
            metadata.event.forEach(function (event, i) {
                event.foci = metadata.strata.map(function (stratum, j) {
                    var focus = _objectSpread2(
                        _objectSpread2({}, stratum),
                        {},
                        {
                            x: event.x + 50 * Math.cos(stratum.angle),
                            dx: event.x + (i === 0 ? 75 : 50) * Math.cos(stratum.angle),
                            y: event.y + 50 * Math.sin(stratum.angle),
                            dy: event.y + (i === 0 ? 75 : 50) * Math.sin(stratum.angle),
                            count: 0,
                            cumulative: 0,
                        }
                    );

                    return focus;
                });
            });
        }
    }

    // Frequency data structure: one record per event/event-stratum
    //
    // - state
    // - stratum
    // - label (state or stratum)
    // - participant denominator (population or stratum total)
    // - participant numerator (number of participants in a given state)
    // - participant proportion
    // - event count
    // - formatted values
    //   - label
    //   - nParticipants (%)
    //   - nEvents
    function freqTable(metadata) {
        var _this = this;

        var freqTable = d3.merge(
            metadata.event.map(function (event) {
                // One record per event per focus plus an overall event record.
                var rowGroup =
                    _this.settings.colorBy.type === 'categorical'
                        ? [event].concat(_toConsumableArray(event.foci))
                        : [event];
                rowGroup.forEach(function (d) {
                    d.state = event.value; // state

                    d.label = d.value; // state or stratum

                    d.denominator = d.label !== d.state ? d.nParticipants : metadata.id.length;
                    d.proportion = d.count / d.denominator;
                    d.proportionFmt = d3.format('.1%')(d.proportion); // Table cell values.

                    d.countFmt = d3.format(',d')(d.count);
                    d.countProportionFmt = ''.concat(d.countFmt, ' (').concat(d.proportionFmt, ')');
                    d.cumulativeFmt = d3.format(',d')(d.cumulative);
                    d.cells = [d.label, d.countProportionFmt, d.cumulativeFmt];
                    d.cells.proportion = d.proportion;
                });
                return rowGroup;
            })
        );
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

        metadata.shape = shape.call(this, metadata); // Define color scale.

        this.scales = scales.call(this, metadata); // Define the offset of each stratum as function of the focus coordinates, the stratum
        // sequence, and theta.

        focus.call(this, metadata); // Calculate frequencies and percentages to populate annotation foci and frequency table.

        this.data.freqTable = freqTable.call(this, metadata);
        return metadata;
    }

    function pulseOrbits() {
        var fdg = this;

        if (this.settings.pulseOrbits) {
            this.orbits.each(function (d) {
                d.change = d3.sum(d.values, function (di) {
                    return di.change;
                });

                if (d.change > 0) {
                    d3.select(this)
                        .transition()
                        .duration(fdg.settings.speeds[fdg.settings.speed] / 2)
                        .attr('stroke-width', 0.5 * d.change)
                        .transition()
                        .duration(fdg.settings.speeds[fdg.settings.speed] / 2)
                        .attr('stroke-width', 0.5);
                }
            });
        }
    }

    function progress() {
        // Update progress bar.
        this.containers.progressBar.style('width', ''.concat(this.settings.progress * 100, '%'));
        this.containers.progressDay
            .style('right', ''.concat(100 - this.settings.progress * 100, '%'))
            .text('Day '.concat(this.settings.timepoint)); // Update timer.

        this.containers.timer.text(
            ''.concat(this.settings.timepoint, ' ').concat(this.settings.timeUnit)
        ); // Update progress pie.

        this.containers.progress.attr(
            'title',
            'The animation is '
                .concat(d3.format('.1%')(this.settings.progress), ' complete with ')
                .concat(this.settings.duration - this.settings.timepoint, ' ')
                .concat(this.settings.timeUnit.split(' ')[0], ' to go.')
        );
        this.containers.stopwatch.foreground
            .transition()
            .duration(this.settings.speed)
            .attrTween(
                'd',
                this.util.arcTween(
                    this.settings.progress * Math.PI * 2,
                    this.containers.stopwatch.arc
                )
            )
            .style('fill', d3.interpolateRdYlGn(1 - this.settings.progress));
        this.containers.stopwatch.percentBackground.text(
            this.settings.progress < 0.0095
                ? d3.format('.1%')(this.settings.progress)
                : d3.format('.0%')(this.settings.progress)
        );
        this.containers.stopwatch.percentForeground.text(
            this.settings.progress < 0.0095
                ? d3.format('.1%')(this.settings.progress)
                : d3.format('.0%')(this.settings.progress)
        ); // Update timepoint control.

        this.controls.timepoint.inputs.property('value', this.settings.timepoint);
    }

    function legends() {}

    // Update focus percentages.
    function counts() {
        if (this.settings.eventCount)
            this.focusAnnotations
                .selectAll('tspan.fdg-focus-annotation__event-count')
                .text(function (d) {
                    return d.countProportionFmt;
                });
        if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify)
            this.metadata.event.forEach(function (event) {
                event.fociLabels.selectAll('text').text(function (d) {
                    return d.countProportionFmt;
                });
            });
    }

    // Update frequency table.
    function freqTable$1() {
        this.freqTable.tr.each(function (d) {
            var tr = d3.select(this);
            tr.selectAll('td')
                .data(d.cells)
                .join('td')
                .style('background', function (di, i) {
                    return i === 1
                        ? 'linear-gradient(to right, #bbb 0, #bbb '
                              .concat(d.proportionFmt, ', transparent ')
                              .concat(d.proportionFmt, ')')
                        : null;
                })
                .text(function (d) {
                    return d;
                });
        });
    }

    function text() {
        this.settings.progress = this.settings.timepoint / this.settings.duration;
        progress.call(this);
        legends.call(this);
        counts.call(this);
        freqTable$1.call(this);
    }

    function update$1() {
        // Update the node data.
        data.call(this); // Accentuate the orbits when an event occurs.

        pulseOrbits.call(this); // Update timer, focus labels, and annotations.

        text.call(this);
    }

    function countdown() {
        var _this = this;

        var counter = this.settings.resetDelay / 1000 - 1;
        this.containers.countdown
            .classed('fdg-invisible', false)
            .classed('fdg-hidden', function (d) {
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
        // Transition text from full opacity to zero opacity to create fade-out effect.
        d3.select(this)
            .transition()
            .duration(modalSpeed / 15)
            .delay(modalSpeed - (modalSpeed / 15) * 2)
            .style('opacity', 0);
    }

    function fadeIn(selection, modalSpeed) {
        // Transition text from zero opacity to full opacity to create fade-in effect.
        selection
            .style('opacity', 0)
            .transition()
            .duration(modalSpeed / 15)
            .style('opacity', 1)
            .on('end', function () {
                fadeOut.call(this, modalSpeed);
            });
    }

    function emphasizeComponent(component) {
        var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'outline';
        var value1 =
            arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : 'thick groove rgba(215,25,28,0)';
        var value2 =
            arguments.length > 3 && arguments[3] !== undefined
                ? arguments[3]
                : 'thick groove rgba(215,25,28,.5)';
        var duration = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
        if (duration)
            component
                .style(style, value1)
                .transition()
                .duration(this.settings.modalSpeed / 15)
                .style(style, value2)
                .transition()
                .duration(this.settings.modalSpeed / 15)
                .delay(this.settings.modalSpeed - (this.settings.modalSpeed / 15) * 2)
                .style(style, value1)
                .on('end', function () {
                    return component.style(style, null);
                });
        else {
            component.style(style, value2);
            d3.timeout(function () {
                component.style(style, null);
            }, this.settings.modalSpeed);
        }
    }

    function update$2() {
        this.modalText = this.settings.text[this.settings.modalIndex];
        if (this.settings.modalIndex === this.settings.text.length - 1 && this.modal)
            this.modal.stop(); // Update modal text.

        this.containers.modal.html(this.modalText).call(fadeIn, this.settings.modalSpeed); // Highlight referenced component.

        switch (true) {
            case /time/i.test(this.modalText):
                emphasizeComponent.call(this, this.containers.progress); //emphasizeComponent.call(this, this.focusAnnotations);

                break;

            case /color/i.test(this.modalText):
                emphasizeComponent.call(this, this.containers.legends);
                break;

            case /static/i.test(this.modalText):
                // Style static bubbles differently than components.
                emphasizeComponent.call(
                    this,
                    this.containers.svgBackground.selectAll('.fdg-static__mark'),
                    'stroke',
                    'rgba(215,25,28,0)',
                    'rgba(215,25,28,.5)',
                    false
                );
                break;

            case /controls/i.test(this.modalText):
                emphasizeComponent.call(this, this.containers.controls);
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
            d.value.statePrevious = null;
            d.value.state = getState.call(_this, d.value.group);
            var aestheticValues = getAestheticValues.call(_this, d.value.group, d.value.state);
            d.value.coordinates = getCoordinates.call(
                _this,
                d.value.state,
                aestheticValues.colorValue
            );
            d.value.colorScale = getColorScale.call(_this, aestheticValues.colorValue);
            var aesthetics = getAesthetics.call(_this, aestheticValues, d.value.colorScale);
            Object.assign(d.value, aestheticValues, aesthetics);
        });
        if (this.modal) this.modal.stop();
        runModal.call(this);
    }

    function timeout(countdown) {
        var _this = this;

        var timeout = window.setTimeout(function () {
            resetAnimation.call(_this);

            _this.containers.timer.text(
                ''.concat(_this.settings.timepoint, ' ').concat(_this.settings.timeUnit)
            );

            _this.settings.progress = 0;

            _this.containers.stopwatch.foreground
                .transition()
                .duration(_this.settings.speed)
                .attrTween(
                    'd',
                    _this.util.arcTween(
                        _this.settings.progress * Math.PI * 2,
                        _this.containers.stopwatch.arc
                    )
                )
                .style('fill', d3.interpolateRdYlGn(1 - _this.settings.progress));

            window.clearInterval(countdown);
            window.clearTimeout(timeout);

            _this.containers.countdown
                .classed('fdg-invisible', function (d) {
                    return d === _this.settings.resetDelay / 1000 - 1;
                })
                .classed('fdg-hidden', function (d) {
                    return d !== _this.settings.resetDelay / 1000 - 1;
                });

            _this.interval = startInterval.call(_this);
        }, this.settings.resetDelay);
        return timeout;
    }

    function reset() {
        this.interval.stop(); // Reheat the animation one last time so marks reach to their final destination.

        restartForceSimulation.call(this); // Display a visual countdown to reset.

        var countdown$1 = countdown.call(this); // Set a timeout before resetting the animation.

        var timeout$1 = timeout.call(this, countdown$1);
    }

    var increment = function increment(arg) {
        // Increment the timepoint.
        this.settings.timepoint += !!arg; // Update animation if the current timepoint is less than duration of animation.

        if (this.settings.timepoint <= this.settings.duration) update$1.call(this);
        // Otherwise reset animation.
        else if (this.settings.loop === true) reset.call(this); // Resume the force simulation.

        restartForceSimulation.call(this);
    }; // Default returns an interval that runs increment() every time unit.

    function startInterval() {
        var interval = d3.interval(increment.bind(this), this.settings.speeds[this.settings.speed]);
        return interval;
    }

    var playPause = [
        {
            action: 'play',
            label: 'Play',
            html: '&#9658;',
        },
        {
            action: 'pause',
            label: 'Pause',
            html: '&#10074;&#10074;',
        },
    ];
    function toggle() {
        var _this = this;

        // Update setting.
        this.settings.playPause = playPause.find(function (value) {
            return value.action !== _this.settings.playPause;
        }).action; // toggle playPause setting
        // Update tooltip and display text.

        this.controls.playPause.inputs
            .attr(
                'title',
                ''.concat(
                    playPause.find(function (value) {
                        return value.action !== _this.settings.playPause;
                    }).label,
                    ' animation'
                )
            )
            .html(
                playPause.find(function (value) {
                    return value.action !== _this.settings.playPause;
                }).html
            ); // Pause or play animation.

        if (this.settings.playPause === 'play') this.interval = startInterval.call(this);
        else this.interval.stop();
    }

    function speed() {
        var _this = this;

        var fdg = this;
        var container = this.controls.container
            .append('div')
            .classed('fdg-control fdg-control--speed', true);
        var inputs = container
            .selectAll('div')
            .data(
                Object.keys(this.settings.speeds).map(function (key) {
                    return {
                        label: key,
                        value: _this.settings.speeds[key],
                    };
                })
            )
            .enter()
            .append('div')
            .attr('class', function (d) {
                return 'fdg-button '
                    .concat(d.label, ' ')
                    .concat(d.label === _this.settings.speed ? 'current' : '');
            })
            .attr('title', function (d) {
                return 'Advance the animation every '.concat(
                    _this.settings.speeds[d.label] / 1000,
                    ' second(s).'
                );
            })
            .text(function (d) {
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
            inputs: inputs,
        };
    }

    function playPause$1() {
        var _this = this;
        var container = this.controls.container
            .append('div')
            .classed('fdg-control fdg-control--play-pause', true);
        var inputs = container
            .append('div')
            .classed('fdg-button fdg-input', true)
            .attr(
                'title',
                ''.concat(
                    playPause.find(function (value) {
                        return value.action !== _this.settings.playPause;
                    }).label,
                    ' animation.'
                )
            )
            .html(
                playPause.find(function (value) {
                    return value.action !== _this.settings.playPause;
                }).html
            );
        inputs.on('click', function () {
            toggle.call(_this);
        });
        return {
            container: container,
            inputs: inputs,
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
        var container = this.controls.container
            .append('div')
            .classed('fdg-control fdg-control--step', true);
        var inputs = container
            .append('div')
            .classed('fdg-button fdg-input', true)
            .attr('title', 'Advance animation by one time unit.')
            .text('Step');
        inputs.on('click', function () {
            // Pause simulation.
            if (_this.settings.playPause !== 'pause') toggle.call(_this);
            increment.call(_this, true);
        });
        return {
            container: container,
            inputs: inputs,
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
        var container = this.controls.container
            .append('div')
            .classed('fdg-control fdg-control--timepoint', true);
        var inputs = container
            .append('div')
            .classed('fdg-button fdg-input', true)
            .append('input')
            .attr('type', 'number')
            .attr('title', 'Choose a timepoint.')
            .attr('value', +this.settings.timepoint)
            .attr('min', 1)
            .attr('max', this.settings.duration);
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
            inputs: inputs,
        };
    }

    function reset$1() {
        var _this = this;

        var container = this.controls.container
            .append('div')
            .classed('fdg-control fdg-control--reset', true);
        var inputs = container
            .append('div')
            .classed('fdg-button fdg-input', true)
            .attr('title', 'Reset animation.')
            .html('&#x21ba;');
        inputs.on('click', function () {
            resetAnimation.call(_this);
            if (_this.settings.playPause !== 'play') toggle.call(_this);
        });
        return {
            container: container,
            inputs: inputs,
        };
    }

    function eventList() {
        var _this = this;

        var fdg = this;
        var container = this.controls.container
            .append('div')
            .classed('fdg-control fdg-control--event-list', true);
        var inputs = container
            .selectAll('div')
            .data(this.metadata.event)
            .enter()
            .append('div')
            .attr('class', function (d) {
                return 'fdg-button '.concat(
                    _this.settings.eventChangeCount.includes(d.value) ? 'current' : ''
                );
            })
            .attr('title', function (d) {
                return ''
                    .concat(
                        _this.settings.eventChangeCount.includes(d.value) ? 'Remove' : 'Add',
                        ' '
                    )
                    .concat(d.value, ' ')
                    .concat(
                        _this.settings.eventChangeCount.includes(d.value) ? 'from' : 'to',
                        ' the list of events that control bubble '
                    )
                    .concat(
                        _this.settings.eventChangeCountAesthetic === 'both'
                            ? 'color and size'
                            : _this.settings.eventChangeCountAesthetic,
                        '.'
                    );
            })
            .text(function (d) {
                return d.value;
            });
        inputs.on('click', function (d) {
            var _this2 = this;

            this.classList.toggle('current'); // Update event array.

            if (fdg.settings.eventChangeCount.includes(this.textContent))
                fdg.settings.eventChangeCount.splice(
                    fdg.settings.eventChangeCount.findIndex(function (event) {
                        return event === _this2.textContent;
                    }),
                    1
                );
            else fdg.settings.eventChangeCount.push(this.textContent); // Update tooltip.

            this.title = ''
                .concat(fdg.settings.eventChangeCount.includes(d.value) ? 'Remove' : 'Add', ' ')
                .concat(d.value, ' ')
                .concat(
                    fdg.settings.eventChangeCount.includes(d.value) ? 'from' : 'to',
                    ' the list of events that control bubble '
                )
                .concat(
                    fdg.settings.eventChangeCountAesthetic === 'both'
                        ? 'color and size'
                        : fdg.settings.eventChangeCountAesthetic,
                    '.'
                ); // Update color-size toggle.

            fdg.controls.colorSizeToggle.inputs.attr('title', function (di) {
                return 'Quantify the number of '
                    .concat(fdg.util.csv(fdg.settings.eventChangeCount), ' events by ')
                    .concat(di !== 'both' ? di : 'color and size', '.');
            }); // Update legend label.

            fdg.legends.container
                .classed('fdg-invisible', fdg.settings.eventChangeCount.length === 0)
                .selectAll('span.fdg-measure')
                .text(fdg.util.csv(fdg.settings.eventChangeCount));
            increment.call(fdg, false);
        });
        return {
            container: container,
            inputs: inputs,
        };
    }

    function addControls() {
        this.controls = {
            container: this.containers.controls,
        };
        this.controls.speed = speed.call(this);
        this.controls.playPause = playPause$1.call(this);
        this.controls.step = step.call(this);
        this.controls.timepoint = timepoint.call(this);
        this.controls.reset = reset$1.call(this);

        if (this.settings.colorBy.type === 'frequency') {
            this.controls.eventList = eventList.call(this); //this.controls.colorSizeToggle = colorSizeToggle.call(this);
        }

        this.controls.container
            .selectAll('.fdg-button')
            .on('mousedown', function () {
                this.classList.toggle('clicked');
            })
            .on('mouseup', function () {
                this.classList.toggle('clicked');
            })
            .on('mouseout', function () {
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

        var svg = d3
            .create('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .style('overflow', 'visible'); //.style('display', 'block');

        var tickAdjust = function tickAdjust(g) {
            return g.selectAll('.tick line').attr('y1', marginTop + marginBottom - height);
        };

        var x; // Continuous

        if (color.interpolate) {
            var n = Math.min(color.domain().length, color.range().length);
            x = color
                .copy()
                .rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
            svg.append('image')
                .attr('x', marginLeft)
                .attr('y', marginTop)
                .attr('width', width - marginLeft - marginRight)
                .attr('height', height - marginTop - marginBottom)
                .attr('preserveAspectRatio', 'none')
                .attr(
                    'xlink:href',
                    ramp
                        .call(this, color.copy().domain(d3.quantize(d3.interpolate(0, 1), n)))
                        .toDataURL()
                );
        } // Sequential
        else if (color.interpolator) {
            x = Object.assign(
                color.copy().interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
                {
                    range: function range() {
                        return [marginLeft, width - marginRight];
                    },
                }
            );
            svg.append('image')
                .attr('x', marginLeft)
                .attr('y', marginTop)
                .attr('width', width - marginLeft - marginRight)
                .attr('height', height - marginTop - marginBottom)
                .attr('preserveAspectRatio', 'none')
                .attr('xlink:href', ramp.call(this, color.interpolator()).toDataURL()); // scaleSequentialQuantile doesn’t implement ticks or tickFormat.

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
            var thresholds = color.thresholds
                ? color.thresholds() // scaleQuantize
                : color.quantiles
                ? color.quantiles() // scaleQuantile
                : color.domain(); // scaleThreshold

            var thresholdFormat =
                tickFormat === undefined
                    ? function (d) {
                          return d;
                      }
                    : typeof tickFormat === 'string'
                    ? d3.format(tickFormat)
                    : tickFormat;
            x = d3
                .scaleLinear()
                .domain([-1, color.range().length - 1])
                .rangeRound([marginLeft, width - marginRight]);
            svg.append('g')
                .selectAll('rect')
                .data(color.range())
                .join('rect')
                .attr('x', function (d, i) {
                    return x(i - 1);
                })
                .attr('y', marginTop)
                .attr('width', function (d, i) {
                    return x(i) - x(i - 1);
                })
                .attr('height', height - marginTop - marginBottom)
                .attr('fill', function (d) {
                    return d;
                });
            tickValues = d3.range(thresholds.length);

            tickFormat = function tickFormat(i) {
                return thresholdFormat(thresholds[i], i);
            };
        } // Ordinal
        else {
            x = d3
                .scaleBand()
                .domain(color.domain())
                .rangeRound([marginLeft, width - marginRight]);
            svg.append('g')
                .selectAll('rect')
                .data(color.domain())
                .join('rect')
                .attr('x', x)
                .attr('y', marginTop)
                .attr('width', Math.max(0, x.bandwidth() - 1))
                .attr('height', height - marginTop - marginBottom)
                .attr('fill', color);

            tickAdjust = function tickAdjust() {};
        }

        svg.append('g')
            .attr('transform', 'translate(0,'.concat(height - marginBottom, ')'))
            .call(
                d3
                    .axisBottom(x)
                    .ticks(ticks, typeof tickFormat === 'string' ? tickFormat : undefined)
                    .tickFormat(typeof tickFormat === 'function' ? tickFormat : undefined)
                    .tickSize(tickSize)
                    .tickValues(tickValues)
            )
            .call(tickAdjust)
            .call(function (g) {
                return g.select('.domain').remove();
            })
            .call(function (g) {
                return g
                    .append('text')
                    .classed('fdg-sidebar__label fdg-legend__label', true)
                    .attr('x', marginLeft)
                    .attr('y', marginTop + marginBottom - height - 6)
                    .attr('fill', 'currentColor')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'translate('.concat(width / 2, ',0)'))
                    .attr('font-weight', 'bold')
                    .attr('font-size', '1.25rem')
                    .text(title);
            });
        return svg.node();
    }

    function continuous$1() {
        var container = this.legends.container
            .append('div')
            .classed('fdg-legend fdg-legend--continuous', true);
        container.node().appendChild(
            continuous({
                color: this.scales.color,
                title: this.settings.colorBy.label,
                width: 200,
                height: 50,
                tickValues: [
                    this.scales.color.domain()[0],
                    (this.scales.color.domain()[1] - this.scales.color.domain()[0]) / 2,
                    this.scales.color.domain()[1],
                ],
            })
        );
    }

    function categorical() {
        var _this = this;

        var container = this.legends.container
            .append('div')
            .classed('fdg-legend fdg-legend--categorical', true);
        container
            .append('div')
            .classed('fdg-sidebar__label fdg-legend__label', true)
            .text(this.settings.colorBy.label);
        var legendItems = container
            .append('svg')
            .attr('width', 200)
            .attr('height', 20 * this.scales.color.domain().length)
            .selectAll('g')
            .data(this.scales.color.domain())
            .join('g');
        legendItems
            .append('circle')
            .attr('cx', 20)
            .attr('cy', function (d, i) {
                return i * 20 + 10;
            })
            .attr('r', 7)
            .attr('fill', function (d) {
                return _this.scales.color(d);
            });
        legendItems
            .append('text')
            .attr('font-size', '1rem')
            .attr('x', 35)
            .attr('y', function (d, i) {
                return i * 20 + 12;
            })
            .attr('alignment-baseline', 'middle')
            .text(function (d) {
                return ''.concat(d, ' (n=').concat(
                    _this.metadata.id.filter(function (di) {
                        return di.colorStratum === d;
                    }).length,
                    ')'
                );
            });
    }

    function color$1(svg, legendDimensions) {
        var _this = this;

        var marks = svg
            .selectAll('rect.legend-mark')
            .data(this.scales.color.range())
            .enter()
            .append('rect')
            .classed('legend-mark', true)
            .attr('x', function (d, i) {
                return i * (legendDimensions[0] / _this.settings.colorBy.nColors);
            })
            .attr('y', 0)
            .attr('width', legendDimensions[0] / this.settings.colorBy.nColors)
            .attr('height', legendDimensions[1] / 3)
            .attr('fill', function (d) {
                return d;
            })
            .attr('fill-opacity', 0.5)
            .attr('stroke', function (d) {
                return d;
            })
            .attr('stroke-opacity', 1);
        return marks;
    }

    function size$1(svg, legendDimensions) {
        var _this = this;

        var marks = svg
            .selectAll('circle.legend-mark')
            .data(d3.range(this.settings.colorBy.nColors))
            .join(this.settings.shape === 'circle' ? 'circle' : 'rect')
            .classed('legend-mark', true)
            .attr('fill', function (d) {
                return '#aaa';
            })
            .attr('fill-opacity', 0.5)
            .attr('stroke', function (d) {
                return '#aaa';
            })
            .attr('stroke-opacity', 1);
        if (this.settings.shape === 'circle')
            marks
                .attr('cx', function (d, i) {
                    return (
                        i * (legendDimensions[0] / _this.settings.colorBy.nColors) +
                        legendDimensions[0] / _this.settings.colorBy.nColors / 2
                    );
                })
                .attr('cy', legendDimensions[1] / 4)
                .attr('r', function (d, i) {
                    return i + _this.settings.minRadius;
                });
        else if (this.settings.shape === 'square')
            marks
                .attr('x', function (d, i) {
                    return (
                        i * (legendDimensions[0] / _this.settings.colorBy.nColors) +
                        legendDimensions[0] / _this.settings.colorBy.nColors / 2 -
                        (i + _this.settings.minRadius)
                    );
                })
                .attr('y', function (d, i) {
                    return legendDimensions[1] / 4 - (i + _this.settings.minRadius);
                })
                .attr('width', function (d, i) {
                    return (i + _this.settings.minRadius) * 2;
                })
                .attr('height', function (d, i) {
                    return (i + _this.settings.minRadius) * 2;
                });
        return marks;
    }

    function both(svg, legendDimensions) {
        var _this = this;

        var marks = svg
            .selectAll('circle.legend-mark')
            .data(this.scales.color.range())
            .join(this.settings.shape === 'circle' ? 'circle' : 'rect')
            .classed('legend-mark', true)
            .attr('fill', function (d) {
                return d;
            })
            .attr('fill-opacity', 0.5)
            .attr('stroke', function (d) {
                return d;
            })
            .attr('stroke-opacity', 1);
        if (this.settings.shape === 'circle')
            marks
                .attr('cx', function (d, i) {
                    return (
                        i * (legendDimensions[0] / _this.settings.colorBy.nColors) +
                        legendDimensions[0] / _this.settings.colorBy.nColors / 2
                    );
                })
                .attr('cy', legendDimensions[1] / 4)
                .attr('r', function (d, i) {
                    return i + _this.settings.minRadius;
                });
        else if (this.settings.shape === 'square')
            marks
                .attr('x', function (d, i) {
                    return (
                        i * (legendDimensions[0] / _this.settings.colorBy.nColors) +
                        legendDimensions[0] / _this.settings.colorBy.nColors / 2 -
                        (i + _this.settings.minRadius)
                    );
                })
                .attr('y', function (d, i) {
                    return legendDimensions[1] / 4 - (i + _this.settings.minRadius);
                })
                .attr('width', function (d, i) {
                    return (i + _this.settings.minRadius) * 2;
                })
                .attr('height', function (d, i) {
                    return (i + _this.settings.minRadius) * 2;
                });
        return marks;
    }

    var makeLegendMarks = {
        color: color$1,
        size: size$1,
        both: both,
    };

    function makeLegend(type) {
        var legendDimensions = [200, 50]; // container

        var container = this.legends.container
            .append('div')
            .classed('fdg-legend fdg-legend--'.concat(type), true)
            .classed(
                'fdg-hidden',
                this.settings.eventChangeCountAesthetic !== type ||
                    this.settings.eventChangeCount.length === 0
            ); // label

        var label = container
            .append('div')
            .classed('fdg-sidebar__label fdg-legend__label', true) //.style('width', legendDimensions[0] + 'px')
            .html(
                'Number of <span class = "fdg-measure">'.concat(
                    this.util.csv(this.settings.eventChangeCount),
                    '</span> events'
                )
            ); // svg

        var svg = container
            .append('svg')
            .attr('width', legendDimensions[0])
            .attr('height', legendDimensions[1])
            .append('g'); // marks

        var marks = makeLegendMarks[type].call(this, svg, legendDimensions); // lower end of scale

        var lower = svg
            .append('text')
            .attr('x', legendDimensions[0] / this.settings.colorBy.nColors / 2)
            .attr('y', legendDimensions[1] / 2 + 16)
            .attr('text-anchor', 'middle')
            .text('0'); // upper end of scale

        var upper = svg
            .append('text')
            .attr(
                'x',
                legendDimensions[0] - legendDimensions[0] / this.settings.colorBy.nColors / 2
            )
            .attr('y', legendDimensions[1] / 2 + 16)
            .attr('text-anchor', 'middle')
            .text(''.concat(this.settings.colorBy.nColors - 1, '+'));
        return {
            container: container,
            label: label,
            svg: svg,
            marks: marks,
            lower: lower,
            upper: upper,
        };
    }

    function frequency() {
        this.legends.color = makeLegend.call(this, 'color');
        this.legends.size = makeLegend.call(this, 'size');
        this.legends.both = makeLegend.call(this, 'both');
    }

    function circle(legendItem, i, spacing, radius) {
        legendItem
            .append('circle')
            .attr('cx', spacing)
            .attr('cy', i * spacing + 10)
            .attr('r', radius)
            .attr('fill', 'none')
            .attr('stroke', '#444');
    }

    function square(legendItem, i, spacing, radius) {
        legendItem
            .append('rect')
            .attr('x', spacing - radius)
            .attr('y', i * spacing + radius / 2)
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .attr('fill', 'none')
            .attr('stroke', '#444');
    }

    function triangle(legendItem, i, spacing, radius) {
        var side = radius * 2;
        var dist = side / Math.sqrt(3);
        var x = spacing;
        var y = i * spacing + dist;
        var top = [x, y - dist];
        var left = [x - dist, y + dist];
        var right = [x + dist, y + dist];
        legendItem
            .append('polygon')
            .attr('points', [top, left, right]) //.attr('x', spacing - radius)
            //.attr('y', i * spacing)
            //.attr('width', radius * 2)
            //.attr('height', radius * 2)
            .attr('fill', 'none')
            .attr('stroke', '#444');
    }

    function diamond(legendItem, i, spacing, radius) {
        var x = spacing;
        var y = i * spacing;
        legendItem
            .append('rect')
            .attr('transform', 'rotate(45 '.concat(x, ' ').concat(y, ')'))
            .attr('x', x)
            .attr('y', y)
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .attr('fill', 'none')
            .attr('stroke', '#444');
    }

    function shape$2() {
        var _this = this;

        var main = this;
        var shapes = {
            circle: circle,
            square: square,
            triangle: triangle,
            diamond: diamond,
        };
        var container = this.legends.container
            .append('div')
            .classed('fdg-legend fdg-legend--shape', true);
        container
            .append('div')
            .classed('fdg-sidebar__label fdg-legend__label', true)
            .text(this.settings.shapeBy.label);
        var legendItems = container
            .append('svg')
            .attr('width', 200)
            .attr('height', 20 * this.scales.shape.domain().length)
            .selectAll('g')
            .data(this.scales.shape.domain())
            .join('g');
        var radius = 7;
        var spacing = 20;
        legendItems.each(function (value, i) {
            shapes[main.scales.shape(value)].call(main, d3.select(this), i, spacing, radius);
        });
        legendItems
            .append('text')
            .attr('font-size', '1rem')
            .attr('x', 35)
            .attr('y', function (d, i) {
                return i * 20 + 12;
            })
            .attr('alignment-baseline', 'middle')
            .text(function (d) {
                return ''.concat(d, ' (n=').concat(
                    _this.metadata.id.filter(function (di) {
                        return di.shapeStratum === d;
                    }).length,
                    ')'
                );
            });
    }

    function addLegends() {
        this.legends = {
            container: this.containers.legends,
        };

        switch (this.settings.colorBy.type) {
            case 'frequency':
                frequency.call(this);
                break;

            case 'categorical':
                categorical.call(this);
                break;

            case 'continuous':
                continuous$1.call(this);
                break;

            default:
                return;
        }

        if (this.settings.shapify) shape$2.call(this);
    }

    function addFreqTable() {
        var _this = this;
        var freqTable = {
            container: this.containers.freqTable.classed('fdg-hidden', this.settings.hideFreqTable),
        };
        freqTable.table = freqTable.container
            .append('table')
            .classed('fdg-freq-table__table', true);
        freqTable.thead = freqTable.table.append('thead').classed('fdg-freq-table__thead', true);
        freqTable.th = freqTable.thead
            .selectAll('th')
            .data(['', 'Participants', 'Events'])
            .join('th')
            .attr('class', function (d, i) {
                return 'fdg-freq-table__th--'.concat(
                    i === 0 ? 'label' : i === 1 ? 'participant' : i === 2 ? 'event' : i
                );
            })
            .classed('fdg-freq-table__th', true)
            .text(function (d) {
                return d;
            });
        freqTable.th
            .filter(function (d) {
                return d === 'Participants';
            })
            .html(function (d) {
                return ''
                    .concat(d, ' <span ', "class = 'fdg-info-icon'", ' ')
                    .concat(
                        _this.settings.colorBy.type === 'categorical'
                            ? "title = 'Gray background represents the percentage of individuals in the given group at the given state'"
                            : "title = 'Gray background represents the percentage of individuals at the given state'",
                        '>&#9432;</span>'
                    );
            });
        freqTable.tbody = freqTable.table.append('tbody').classed('fdg-freq-table__tbody', true);
        freqTable.tr = freqTable.tbody
            .selectAll('tr')
            .data(
                this.data.freqTable.filter(function (d) {
                    return !(
                        _this.settings.eventCentralInFreqTable === false &&
                        d.state === _this.settings.eventCentral
                    );
                })
            )
            .join('tr')
            .attr('class', function (d) {
                return d.state !== d.value ? 'fdg-freq-table__tr--subgroup' : null;
            })
            .classed('fdg-freq-table__tr', true)
            .style('font-size', function (d) {
                return d.group !== d.value ? '1rem' : '1.25rem';
            });
        freqTable.tr.each(function (d, i) {
            var tr = d3.select(this);
            var td = tr
                .selectAll('td')
                .data(function (di) {
                    return d.cells;
                })
                .join('td')
                .attr('class', function (d, i) {
                    return 'fdg-freq-table__td--'.concat(
                        i === 0 ? 'label' : i === 1 ? 'participant' : i === 2 ? 'event' : i
                    );
                })
                .classed('fdg-freq-table__td', true)
                .style('background', function (di, i) {
                    return i === 1
                        ? 'linear-gradient(to right, #bbb 0, #bbb '
                              .concat(d.proportionFmt, ', transparent ')
                              .concat(d.proportionFmt, ')')
                        : null;
                }) // add background to participant cell proportional to the percentage of participants at state or focus
                .text(function (di) {
                    return typeof di === 'number' ? d3.format(',d')(di) : di;
                });
        });
        freqTable.td = freqTable.tr.selectAll('td');
        return freqTable;
    }

    function addOrbits() {
        var g = this.containers.svgBackground.append('g').classed('fdg-g fdg-g--orbits', true);
        var shadows = g
            .append('defs')
            .selectAll('filter')
            .data(this.metadata.orbit)
            .join('filter')
            .attr('id', function (d, i) {
                return 'orbit--'.concat(i);
            });
        shadows
            .append('feDropShadow')
            .attr('dx', 0)
            .attr('dy', 0)
            .attr('stdDeviation', 5)
            .attr('flood-color', 'black');
        var orbits = g
            .selectAll('circle.orbit')
            .data(this.metadata.orbit)
            .enter()
            .append('circle')
            .classed('orbit', true)
            .attr('cx', function (d) {
                return d.cx;
            })
            .attr('cy', function (d) {
                return d.cy;
            })
            .attr('r', function (d) {
                return d.r;
            })
            .attr('fill', 'none')
            .attr('stroke', '#aaa')
            .attr('stroke-width', '.5')
            .style('filter', function (d, i) {
                return 'url(#orbit--'.concat(i, ')');
            });
        return orbits;
    }

    function isCenter(d) {
        return Math.round(d.x) === Math.round(this.settings.orbitRadius / 2);
    }

    function isLessThanCenter(d) {
        return d.order === 1 || Math.round(d.x) < Math.round(this.settings.width / 2);
    }

    function getPosition(d) {
        return isCenter.call(this, d) ? 'middle' : isLessThanCenter.call(this, d) ? 'start' : 'end';
    }

    function getRelative(d) {
        return isCenter.call(this, d) ? 0 : isLessThanCenter.call(this, d) ? '2em' : '-2em';
    }

    function isCenter$1(d) {
        return Math.round(d.y) === Math.round(this.settings.height / 2);
    }

    function isLessThanCenter$1(d) {
        return Math.round(d.y) < Math.round(this.settings.height / 2);
    }

    function getPosition$1(d) {
        var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var position = isCenter$1.call(this, d)
            ? 'middle'
            : isLessThanCenter$1.call(this, d)
            ? 'hanging'
            : 'baseline';
        if (reverse)
            position =
                position === 'hanging'
                    ? 'baseline'
                    : position === 'baseline'
                    ? 'hanging'
                    : position;
        return position;
    }

    function getRelative$1(d) {
        return isCenter$1.call(this, d) ? 0 : isLessThanCenter$1.call(this, d) ? '-2em' : '2em';
    }

    function addLabel(text) {
        var _this = this;

        var label = text
            .append('tspan')
            .classed('fdg-focus-annotation__label', true)
            .attr('x', 0)
            .attr('text-anchor', function (d) {
                return getPosition.call(_this, d);
            })
            .text(function (d) {
                return d.value;
            });
        if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify)
            label.attr('alignment-baseline', function (d) {
                return getPosition$1.call(_this, d, true);
            });
        return label;
    }

    function addEventCount(text) {
        var _this = this;

        var eventCount = text
            .append('tspan')
            .classed('fdg-focus-annotation__event-count', true)
            .classed('fdg-hidden', this.settings.eventCount === false)
            .attr('x', 0)
            .attr('dy', '1.3em')
            .attr('text-anchor', function (d) {
                return getPosition.call(_this, d);
            });
        return eventCount;
    }

    function categoricallyReposition(text, label, eventCount) {
        var _this = this;

        if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
            text.style('transform', function (d) {
                return 'translate('.concat(isCenter$1.call(_this, d) ? '-5em,0' : '0,-5em', ')');
            });
            label.attr('text-anchor', 'middle');
            eventCount.attr('text-anchor', 'middle').classed('fdg-hidden', true);
        }
    }

    function annotateFoci() {
        var _this = this;

        var fociLabels = this.containers.focusAnnotations
            .selectAll('g.fdg-focus-annotation')
            .data(this.metadata.event)
            .join('g')
            .classed('fdg-focus-annotation', true)
            .attr('transform', function (d) {
                return 'translate('.concat(d.x, ',').concat(d.y, ')');
            }); // background - white annotation highlight
        // foreground - black annotation text

        ['background', 'foreground'].forEach(function (pos) {
            var text = fociLabels
                .append('text')
                .classed('fdg-focus-annotation__text fdg-focus-annotation__'.concat(pos), true)
                .style('transform', function (d) {
                    return 'translate('
                        .concat(getRelative.call(_this, d), ',')
                        .concat(getRelative$1.call(_this, d), ')');
                });
            var label = addLabel.call(_this, text);
            var eventCount = addEventCount.call(_this, text); // Position annotations differently in categorical layout.

            categoricallyReposition.call(_this, text, label, eventCount);
        });

        if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
            this.metadata.event.forEach(function (event) {
                event.fociLabels = _this.containers.focusAnnotations
                    .append('g')
                    .classed('fdg-focus-annotation fdg-focus-annotation--categorical', true);
                ['background', 'foreground'].forEach(function (pos) {
                    var text = event.fociLabels
                        .selectAll('text.fdg-focus-annotation__'.concat(pos))
                        .data(event.foci)
                        .join('text')
                        .classed(
                            'fdg-focus-annotation__text fdg-focus-annotation__'.concat(pos),
                            true
                        )
                        .attr('x', function (d) {
                            return d.dx;
                        })
                        .attr('dx', function (d) {
                            return event.value === _this.settings.eventCentral ? null : '-1em';
                        })
                        .attr('y', function (d) {
                            return d.dy;
                        })
                        .attr('text-anchor', function (d) {
                            return event.value === _this.settings.eventCentral ? 'middle' : 'end';
                        })
                        .attr('alignment-baseline', function (d) {
                            return getPosition$1.call(_this, d, true);
                        });
                });
            });
        }

        return fociLabels;
    }

    //import addExplanation from './layout/addExplanation';
    function dataDrivenLayout() {
        // controls
        addControls.call(this); // sidebar

        addLegends.call(this);
        this.containers.timer.text(
            ''.concat(this.settings.timepoint, ' ').concat(this.settings.timeUnit)
        );
        this.freqTable = addFreqTable.call(this); // Draw concentric circles.

        this.orbits = addOrbits.call(this); // Annotate foci.

        this.focusAnnotations = annotateFoci.call(this);
    }

    function hasVariables() {
        var has = {};

        var _iterator = _createForOfIteratorHelper(
                Object.keys(this.settings).filter(function (key) {
                    return /_var$/.test(key);
                })
            ),
            _step;

        try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
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
            var _iterator = _createForOfIteratorHelper(
                    Object.keys(_this.settings).filter(function (key) {
                        return /_var$/.test(key);
                    })
                ),
                _step;

            try {
                for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                    var setting = _step.value;
                    var variable = setting.replace(/_var$/, '');
                    d[variable] = [
                        'event_order',
                        'start_timepoint',
                        'end_timepoint',
                        'duration',
                        'sequence',
                    ].includes(variable)
                        ? +d[_this.settings[setting]]
                        : d[_this.settings[setting]];
                }
            } catch (err) {
                _iterator.e(err);
            } finally {
                _iterator.f();
            }
        });
    }

    function addVariables(has) {
        d3.nest()
            .key(function (d) {
                return d.id;
            })
            .rollup(function (group) {
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
                        d.end_timepoint =
                            i < group.length - 1
                                ? group[i + 1].start_timepoint - 1
                                : d.duration
                                ? d.start_timepoint + d.duration - 1
                                : d.start_timepoint;
                    } // Define duration when only timepoints exist.

                    if (!has.duration && has.start_timepoint && has.end_timepoint) {
                        d.duration = d.start_timepoint - d.end_timepoint + 1;
                    }
                }); // Define sequence

                if (!has.sequence) {
                    group
                        .sort(function (a, b) {
                            return a.start_timepoint - b.start_timepoint;
                        })
                        .forEach(function (d, i) {
                            d.seq = i;
                        });
                } else {
                    group.sort(function (a, b) {
                        return a.seq - b.seq;
                    });
                }
            })
            .entries(this.data);
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

        var nestedData = d3
            .nest()
            .key(function (d) {
                return d.id;
            })
            .rollup(function (group) {
                // individual-level values - calculated once
                var duration = d3.sum(group, function (d) {
                    return d.duration;
                });
                var noStateChange = group.length === 1; // state-level values - calculated once per timepoint

                var state = getState.call(_this, group, 0);
                var aestheticValues = getAestheticValues.call(_this, group, state);
                var coordinates = getCoordinates.call(_this, state, aestheticValues.colorValue);
                var colorScale = getColorScale.call(_this, aestheticValues.colorValue);
                var aesthetics = getAesthetics.call(_this, aestheticValues, colorScale);
                return _objectSpread2(
                    _objectSpread2(
                        {
                            group: group,
                            // array: data
                            duration: duration,
                            // number: total duration of individual
                            noStateChange: noStateChange,
                            // boolean: did individual ever change state?
                            stateprevious: null,
                            // object: datum at previous timepoint
                            state: state,
                        },
                        aestheticValues
                    ),
                    {},
                    {
                        // number/string, number, string: colorValue, sizeValue, shapeValue
                        coordinates: coordinates,
                        // object: { x, y }
                        colorScale: colorScale,
                    },
                    aesthetics
                );
            })
            .entries(this.data);
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
        return function () {
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
            leaf = { data: d },
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
        if (!node) return (tree._root = leaf), tree;

        // Find the existing leaf for the new point, or add it.
        while (node.length) {
            if ((right = x >= (xm = (x0 + x1) / 2))) x0 = xm;
            else x1 = xm;
            if ((bottom = y >= (ym = (y0 + y1) / 2))) y0 = ym;
            else y1 = ym;
            if (((parent = node), !(node = node[(i = (bottom << 1) | right)])))
                return (parent[i] = leaf), tree;
        }

        // Is the new point is exactly coincident with the existing point?
        xp = +tree._x.call(null, node.data);
        yp = +tree._y.call(null, node.data);
        if (x === xp && y === yp)
            return (leaf.next = node), parent ? (parent[i] = leaf) : (tree._root = leaf), tree;

        // Otherwise, split the leaf node until the old and new point are separated.
        do {
            parent = parent ? (parent[i] = new Array(4)) : (tree._root = new Array(4));
            if ((right = x >= (xm = (x0 + x1) / 2))) x0 = xm;
            else x1 = xm;
            if ((bottom = y >= (ym = (y0 + y1) / 2))) y0 = ym;
            else y1 = ym;
        } while ((i = (bottom << 1) | right) === (j = ((yp >= ym) << 1) | (xp >= xm)));
        return (parent[j] = node), (parent[i] = leaf), tree;
    }

    function addAll(data) {
        var d,
            i,
            n = data.length,
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
            if (
                isNaN((x = +this._x.call(null, (d = data[i])))) ||
                isNaN((y = +this._y.call(null, d)))
            )
                continue;
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
        if (isNaN((x = +x)) || isNaN((y = +y))) return this; // ignore invalid points

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
                i = ((y < y0) << 1) | (x < x0);
                (parent = new Array(4)), (parent[i] = node), (node = parent), (z *= 2);
                switch (i) {
                    case 0:
                        (x1 = x0 + z), (y1 = y0 + z);
                        break;
                    case 1:
                        (x0 = x1 - z), (y1 = y0 + z);
                        break;
                    case 2:
                        (x1 = x0 + z), (y0 = y1 - z);
                        break;
                    case 3:
                        (x0 = x1 - z), (y0 = y1 - z);
                        break;
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
        this.visit(function (node) {
            if (!node.length)
                do data.push(node.data);
                while ((node = node.next));
        });
        return data;
    }

    function tree_extent(_) {
        return arguments.length
            ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
            : isNaN(this._x0)
            ? undefined
            : [
                  [this._x0, this._y0],
                  [this._x1, this._y1],
              ];
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
            (x0 = x - radius), (y0 = y - radius);
            (x3 = x + radius), (y3 = y + radius);
            radius *= radius;
        }

        while ((q = quads.pop())) {
            // Stop searching if this quadrant can’t contain a closer node.
            if (
                !(node = q.node) ||
                (x1 = q.x0) > x3 ||
                (y1 = q.y0) > y3 ||
                (x2 = q.x1) < x0 ||
                (y2 = q.y1) < y0
            )
                continue;

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
                if ((i = ((y >= ym) << 1) | (x >= xm))) {
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
                    var d = Math.sqrt((radius = d2));
                    (x0 = x - d), (y0 = y - d);
                    (x3 = x + d), (y3 = y + d);
                    data = node.data;
                }
            }
        }

        return data;
    }

    function tree_remove(d) {
        if (isNaN((x = +this._x.call(null, d))) || isNaN((y = +this._y.call(null, d)))) return this; // ignore invalid points

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
        if (node.length)
            while (true) {
                if ((right = x >= (xm = (x0 + x1) / 2))) x0 = xm;
                else x1 = xm;
                if ((bottom = y >= (ym = (y0 + y1) / 2))) y0 = ym;
                else y1 = ym;
                if (!((parent = node), (node = node[(i = (bottom << 1) | right)]))) return this;
                if (!node.length) break;
                if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3])
                    (retainer = parent), (j = i);
            }

        // Find the point to remove.
        while (node.data !== d) if (!((previous = node), (node = node.next))) return this;
        if ((next = node.next)) delete node.next;

        // If there are multiple coincident points, remove just the point.
        if (previous) return next ? (previous.next = next) : delete previous.next, this;

        // If this is the root point, remove it.
        if (!parent) return (this._root = next), this;

        // Remove this leaf.
        next ? (parent[i] = next) : delete parent[i];

        // If the parent now contains exactly one leaf, collapse superfluous parents.
        if (
            (node = parent[0] || parent[1] || parent[2] || parent[3]) &&
            node === (parent[3] || parent[2] || parent[1] || parent[0]) &&
            !node.length
        ) {
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
        this.visit(function (node) {
            if (!node.length)
                do ++size;
                while ((node = node.next));
        });
        return size;
    }

    function tree_visit(callback) {
        var quads = [],
            q,
            node = this._root,
            child,
            x0,
            y0,
            x1,
            y1;
        if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
        while ((q = quads.pop())) {
            if (
                !callback((node = q.node), (x0 = q.x0), (y0 = q.y0), (x1 = q.x1), (y1 = q.y1)) &&
                node.length
            ) {
                var xm = (x0 + x1) / 2,
                    ym = (y0 + y1) / 2;
                if ((child = node[3])) quads.push(new Quad(child, xm, ym, x1, y1));
                if ((child = node[2])) quads.push(new Quad(child, x0, ym, xm, y1));
                if ((child = node[1])) quads.push(new Quad(child, xm, y0, x1, ym));
                if ((child = node[0])) quads.push(new Quad(child, x0, y0, xm, ym));
            }
        }
        return this;
    }

    function tree_visitAfter(callback) {
        var quads = [],
            next = [],
            q;
        if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
        while ((q = quads.pop())) {
            var node = q.node;
            if (node.length) {
                var child,
                    x0 = q.x0,
                    y0 = q.y0,
                    x1 = q.x1,
                    y1 = q.y1,
                    xm = (x0 + x1) / 2,
                    ym = (y0 + y1) / 2;
                if ((child = node[0])) quads.push(new Quad(child, x0, y0, xm, ym));
                if ((child = node[1])) quads.push(new Quad(child, xm, y0, x1, ym));
                if ((child = node[2])) quads.push(new Quad(child, x0, ym, xm, y1));
                if ((child = node[3])) quads.push(new Quad(child, xm, ym, x1, y1));
            }
            next.push(q);
        }
        while ((q = next.pop())) {
            callback(q.node, q.x0, q.y0, q.x1, q.y1);
        }
        return this;
    }

    function defaultX(d) {
        return d[0];
    }

    function tree_x(_) {
        return arguments.length ? ((this._x = _), this) : this._x;
    }

    function defaultY(d) {
        return d[1];
    }

    function tree_y(_) {
        return arguments.length ? ((this._y = _), this) : this._y;
    }

    function quadtree(nodes, x, y) {
        var tree = new Quadtree(
            x == null ? defaultX : x,
            y == null ? defaultY : y,
            NaN,
            NaN,
            NaN,
            NaN
        );
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
        var copy = { data: leaf.data },
            next = copy;
        while ((leaf = leaf.next)) next = next.next = { data: leaf.data };
        return copy;
    }

    var treeProto = (quadtree.prototype = Quadtree.prototype);

    treeProto.copy = function () {
        var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
            node = this._root,
            nodes,
            child;

        if (!node) return copy;

        if (!node.length) return (copy._root = leaf_copy(node)), copy;

        nodes = [{ source: node, target: (copy._root = new Array(4)) }];
        while ((node = nodes.pop())) {
            for (var i = 0; i < 4; ++i) {
                if ((child = node.source[i])) {
                    if (child.length)
                        nodes.push({ source: child, target: (node.target[i] = new Array(4)) });
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
            var i,
                n = nodes.length;
            if (!tree || updateBH(iter, nodes)) {
                tree = quadtree(nodes, x, y).visitAfter(accumulate);
                nodes.update.push(iter);
            }
            for (alpha = _, i = 0; i < n; ++i) (node = nodes[i]), tree.visit(apply);
            ++iter;
        }

        function initialize() {
            if (!nodes) return;
            iter = 0;
            nodes.update = [];
            updateBH = updateClosure();
            tree = null;
            var i,
                n = nodes.length,
                node;
            strengths = new Array(n);
            for (i = 0; i < n; ++i)
                (node = nodes[i]), (strengths[node.index] = +strength(node, i, nodes));
        }

        function accumulate(quad) {
            var strength = 0,
                q,
                c,
                weight = 0,
                x,
                y,
                i;

            // For internal nodes, accumulate forces from child quadrants.
            if (quad.length) {
                for (x = y = i = 0; i < 4; ++i) {
                    if ((q = quad[i]) && (c = Math.abs(q.value))) {
                        (strength += q.value), (weight += c), (x += c * q.x), (y += c * q.y);
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
                while ((q = q.next));
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
            if ((w * w) / theta2 < l) {
                if (l < distanceMax2) {
                    if (x === 0) (x = jiggle()), (l += x * x);
                    if (y === 0) (y = jiggle()), (l += y * y);
                    if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
                    node.vx += (x * quad.value * alpha) / l;
                    node.vy += (y * quad.value * alpha) / l;
                }
                return true;
            }

            // Otherwise, process points directly.
            else if (quad.length || l >= distanceMax2) return;

            // Limit forces for very close nodes; randomize direction if coincident.
            if (quad.data !== node || quad.next) {
                if (x === 0) (x = jiggle()), (l += x * x);
                if (y === 0) (y = jiggle()), (l += y * y);
                if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
            }

            do
                if (quad.data !== node) {
                    // Use the coordinates of the node and not the quad region.
                    x = quad.data.x - node.x;
                    y = quad.data.y - node.y;
                    l = x * x + y * y;

                    // Limit forces for very close nodes; randomize direction if coincident.
                    if (x === 0) (x = jiggle()), (l += x * x);
                    if (y === 0) (y = jiggle()), (l += y * y);
                    if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);

                    w = (strengths[quad.data.index] * alpha) / l;

                    node.vx += x * w;
                    node.vy += y * w;
                }
            while ((quad = quad.next));
        }

        force.initialize = function (_) {
            nodes = _;
            initialize();
        };

        force.strength = function (_) {
            return arguments.length
                ? ((strength = typeof _ === 'function' ? _ : constant(+_)), initialize(), force)
                : strength;
        };

        force.distanceMin = function (_) {
            return arguments.length ? ((distanceMin2 = _ * _), force) : Math.sqrt(distanceMin2);
        };

        force.distanceMax = function (_) {
            return arguments.length ? ((distanceMax2 = _ * _), force) : Math.sqrt(distanceMax2);
        };

        force.theta = function (_) {
            return arguments.length ? ((theta2 = _ * _), force) : Math.sqrt(theta2);
        };

        force.update = function (_) {
            return arguments.length
                ? ((updateClosure = _), (updateBH = updateClosure()), force)
                : updateClosure;
        };

        return force;
    }

    function constant$1(x) {
        return function () {
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
            updateSize = function (nodes) {
                return Math.pow(nodes.length, 0.75);
            },
            sampleSize = function (nodes) {
                return Math.pow(nodes.length, 0.25);
            },
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
                randDist =
                    (node.x - randNode.x) * (node.x - randNode.x) +
                    (node.y - randNode.y) * (node.y - randNode.y),
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
            for (i = n - 1; i >= cnt; --i) {
                randIdx = Math.floor(rand() * i);
                temp = indices[randIdx];
                indices[randIdx] = indices[i];
                indices[i] = temp;
            }

            return indices.slice(cnt);
        }

        function approxRepulse(node) {
            var i, randIndices, currNode, w, x, y, l;

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
                if (x === 0) (x = (rand() - 0.5) * 1e-6), (l += x * x);
                if (y === 0) (y = (rand() - 0.5) * 1e-6), (l += y * y);
                if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);

                w = (strengths[node.index] * alpha * cMult) / l;
                node.vx += x * w;
                node.vy += y * w;
            }
        }

        function constantRepulse(node) {
            var i, nearest, currNode, w, x, y, l;

            // Update the list of nearest nodes.
            if (numNeighbors) addRandomNode(node);

            nearest = node.nearest;

            if (numNeighbors)
                for (i = nearest.length - 1; i >= 0; --i) {
                    currNode = nodes[nearest[i]];

                    if (currNode === node) continue;

                    x = currNode.x - node.x;
                    y = currNode.y - node.y;
                    l = x * x + y * y;

                    if (l >= distanceMax2) continue;

                    // Limit forces for very close nodes; randomize direction if coincident.
                    if (x === 0) (x = (rand() - 0.5) * 1e-6), (l += x * x);
                    if (y === 0) (y = (rand() - 0.5) * 1e-6), (l += y * y);
                    if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);

                    w = (strengths[node.index] * alpha * cMult) / l;
                    node.vx += x * w;
                    node.vy += y * w;
                }
        }

        function force(_) {
            var i = 0,
                j = prevIndex,
                n = nodes.length,
                upperIndex = prevIndex + numUpdate;
            for (alpha = _; i < n || j < upperIndex; ++i, ++j) {
                if (j < upperIndex) approxRepulse(nodes[j % n]);
                if (numNeighbors && i < n) constantRepulse(nodes[i]);
            }
            prevIndex = upperIndex % n;
        }

        function initialize() {
            if (!nodes) return;
            var i,
                n = nodes.length,
                node;
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

        force.initialize = function (_) {
            nodes = _;
            initialize();
        };

        force.strength = function (_) {
            return arguments.length
                ? ((strength = typeof _ === 'function' ? _ : constant$1(+_)), initialize(), force)
                : strength;
        };

        force.distanceMin = function (_) {
            return arguments.length ? ((distanceMin2 = _ * _), force) : Math.sqrt(distanceMin2);
        };

        force.distanceMax = function (_) {
            return arguments.length ? ((distanceMax2 = _ * _), force) : Math.sqrt(distanceMax2);
        };

        force.neighborSize = function (_) {
            return arguments.length
                ? ((neighborSize = typeof _ === 'function' ? _ : constant$1(+_)),
                  initialize(),
                  force)
                : neighborSize;
        };

        force.updateSize = function (_) {
            return arguments.length
                ? ((updateSize = typeof _ === 'function' ? _ : constant$1(+_)), initialize(), force)
                : updateSize;
        };

        force.sampleSize = function (_) {
            return arguments.length
                ? ((sampleSize = typeof _ === 'function' ? _ : constant$1(+_)), initialize(), force)
                : sampleSize;
        };

        force.chargeMultiplier = function (_) {
            return arguments.length
                ? ((chargeMultiplier = typeof _ === 'function' ? _ : constant$1(+_)),
                  initialize(),
                  force)
                : chargeMultiplier;
        };

        force.source = function (_) {
            return arguments.length ? ((rand = _), force) : rand;
        };

        return force;
    }

    function circle$1(d) {
        this.containers.canvas.context.moveTo(d.x + d.size, d.y);
        this.containers.canvas.context.arc(d.x, d.y, d.value.size, 0, 2 * Math.PI);

        if (this.settings.fill) {
            this.containers.canvas.context.fillStyle = d.value.fill;
            this.containers.canvas.context.fill();
        }

        this.containers.canvas.context.strokeStyle = d.value.stroke;
        this.containers.canvas.context.stroke();
    }

    function square$1(d) {
        this.containers.canvas.context.rect(
            d.x - d.value.size,
            d.y - d.value.size,
            d.value.size * 2,
            d.value.size * 2
        );

        if (this.settings.fill) {
            this.containers.canvas.context.fillStyle = d.value.fill;
            this.containers.canvas.context.fill();
        }

        this.containers.canvas.context.strokeStyle = d.value.stroke;
        this.containers.canvas.context.stroke();
    }

    // TODO: use some kind of cos/sin shit to make a perfect equilateral triangle
    function triangle$1(d) {
        var ctx = this.containers.canvas.context;
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
            this.containers.canvas.context.fillStyle = d.value.fill;
            this.containers.canvas.context.fill();
        }

        this.containers.canvas.context.strokeStyle = d.value.stroke;
        this.containers.canvas.context.stroke();
    }

    function diamond$1(d) {
        var ctx = this.containers.canvas.context;
        var halfWidth = d.value.size * Math.sqrt(2);
        ctx.moveTo(d.x, d.y - halfWidth);
        ctx.lineTo(d.x + halfWidth, d.y);
        ctx.lineTo(d.x, d.y + halfWidth);
        ctx.lineTo(d.x - halfWidth, d.y);
        ctx.lineTo(d.x, d.y - halfWidth);

        if (this.settings.fill) {
            this.containers.canvas.context.fillStyle = d.value.fill;
            this.containers.canvas.context.fill();
        }

        this.containers.canvas.context.strokeStyle = d.value.stroke;
        this.containers.canvas.context.stroke();
    }

    function tick() {
        var _this = this;

        this.containers.canvas.context.clearRect(0, 0, this.settings.width, this.settings.height);
        this.containers.canvas.context.save();
        this.data.nested
            .sort(function (a, b) {
                return a.value.stateChanges - b.value.stateChanges;
            }) // draw bubbles with more state changes last
            .forEach(function (d, i) {
                _this.containers.canvas.context.beginPath();

                switch (d.value.shape) {
                    case 'circle':
                        circle$1.call(_this, d);
                        break;

                    case 'square':
                        square$1.call(_this, d);
                        break;

                    case 'triangle':
                        triangle$1.call(_this, d);
                        break;

                    case 'diamond':
                        diamond$1.call(_this, d);
                        break;

                    default:
                        circle$1.call(_this, d);
                }
            });
        this.containers.canvas.context.restore();
    }

    function addForceSimulation() {
        var _this = this;

        this.forceSimulation = d3
            .forceSimulation()
            .nodes(
                this.data.nested.filter(function (d) {
                    return !(_this.settings.drawStaticSeparately && d.value.noStateChange);
                })
            )
            .alphaDecay(0.01)
            .velocityDecay(0.9)
            .force(
                'center',
                d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2)
            ) // cleared after first interval
            .force(
                'x',
                d3
                    .forceX()
                    .x(function (d) {
                        return d.value.coordinates.x;
                    })
                    .strength(0.3)
            )
            .force(
                'y',
                d3
                    .forceY()
                    .y(function (d) {
                        return d.value.coordinates.y;
                    })
                    .strength(0.3)
            )
            .force(
                'charge',
                this.settings.manyBody === 'forceManyBodyReuse'
                    ? forceManyBodyReuse().strength(this.settings.chargeStrength)
                    : this.settings.manyBody === 'forceManyBodySampled'
                    ? forceManyBodySampled().strength(
                          (this.settings.chargeStrength * this.metadata.id.length) / 1000
                      )
                    : d3.forceManyBody().strength(this.settings.chargeStrength)
            )
            .force(
                'collide',
                d3.forceCollide().radius(function (d) {
                    return d.value.size + _this.settings.collisionPadding;
                })
            )
            .on('tick', tick.bind(this)); // When using D3’s force layout with a disjoint graph, you typically want the positioning
        // forces (d3.forceX and d3.forceY) instead of the centering force (d3.forceCenter). The
        // positioning forces, unlike the centering force, prevent detached subgraphs from escaping
        // the viewport.
        //
        // https://observablehq.com/@d3/disjoint-force-directed-graph?collection=@d3/d3-force
    }

    function init() {
        // Cycle through text that displays over animation.
        runModal.call(this); // Add a static force layout in the background for individuals that never change state.

        addStaticForceSimulation.call(this); // Add a dynamic force layout in the middleground.

        addForceSimulation.call(this); // Start the timer.

        if (this.settings.playPause === 'play') this.interval = startInterval.call(this);
    }

    function forceDirectedGraph(data) {
        var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
        var settings$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var fdg = {
            data: data,
            element: element,
            settings: util.mergeDeep(settings, settings$1),
            util: util,
        };
        settings.update.call(fdg); // Update settings object.

        fdg.containers = layout.call(fdg); // add elements to DOM

        fdg.metadata = defineMetadata.call(fdg); // calculate characteristics of variables in data

        dataDrivenLayout.call(fdg); // update the DOM

        dataManipulation.call(fdg); // mutate and structure data

        init.call(fdg); // run the simulation

        return fdg;
    }

    return forceDirectedGraph;
});
