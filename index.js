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

    var util = {
        arcTween: arcTween,
        csv: csv,
    };

    function update() {
        var _this = this;

        // Update explanation text with appropriate shape.
        this.settings.explanation = this.settings.explanation.map(function (text) {
            return text.replace(/bubble/g, _this.settings.shape);
        }); // Define array of modal text.

        this.settings.text = []
            .concat(
                this.settings.explanation.filter(function (el) {
                    return !(_this.settings.hideControls && el.includes('controls'));
                })
            )
            .concat(this.settings.information)
            .filter(function (text) {
                return typeof text === 'string';
            });
    }

    function colors() {
        var colors = [
            '#a50026', //'#d73027',
            '#f46d43',
            '#fdae61', //'#fee08b',
            //'#ffffbf',
            //'#d9ef8b',
            '#a6d96a',
            '#66bd63', //'#1a9850',
            '#006837',
        ].reverse();
        return colors;
    }

    function colorScale() {
        var colors$1 = colors();
        var colorScale = d3
            .scaleLinear()
            .domain(d3.range(colors$1.length))
            .range(colors$1)
            .clamp(true);
        return colorScale;
    }

    function color(value) {
        return colorScale()(Math.min(value, colorScale().domain().length));
    }

    var settings = {
        update: update,
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
            fast: 100,
        },
        playPause: 'play',
        pulseOrbits: false,
        loop: true,
        // dimensions
        width: null,
        // defined in ./defineMetadata/coordinates
        height: null,
        // defined in ./defineMetadata/coordinates
        padding: 1,
        nOrbits: null,
        // defined in ./defineMetadata/dataDrivenSettings/orbits
        orbitRadius: 150,
        nFoci: null,
        // defined in ./defineMetadata/dataDrivenSettings/event
        translate: false,
        hideControls: false,
        // force simulation settings
        chargeStrength: null,
        // defined in ./defineMetadata
        staticLayout: 'circular',
        manyBody: 'forceManyBodyReuse',
        // ['forceManyBody', 'forceManyBodyReuse', 'forceManyBodySampled']
        // bubble color settings
        colorBy: {
            type: 'frequency',
            // ['frequency', 'continuous', 'categorical']
            variable: null,
            label: null,
        },
        colors: colors,
        colorScale: colorScale,
        color: color,
        fill: null,
        // defined in ./defineMetadata/dataDrivenSettings
        // bubble size settings
        sizeBy: {
            type: 'frequency',
            // ['frequency', 'continuous']
            variable: null,
            label: null,
        },
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
        explanation: [
            'Each bubble in this animation represents an individual.',
            'As <span class = "fdg-emphasized">time progresses</span> and individuals experience events, their bubble gravitates toward the focus or "planet" representing that event.',
            'The <span class = "fdg-emphasized">number of events</span> an individual has experienced determines the color and/or size of their bubble.',
            '<span class = "fdg-emphasized">Static bubbles</span> represent individuals who never experience an event.',
            'Use the <span class = "fdg-emphasized">controls</span> on the right to interact with and alter the animation.',
            'Continue watching to learn how these individuals progress over the course of [duration] days.',
        ],
        // array of strings
        information: null, // array of strings
    };

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
        this.settings.height = animation.node().clientHeight; // background SVG

        var svgBackground = addElement('svg--background', animation, 'svg')
            .attr('width', this.settings.width)
            .attr('height', this.settings.height); // canvas

        var canvas = addElement('canvas', animation, 'canvas')
            .attr('width', this.settings.width)
            .attr('height', this.settings.height);
        canvas.context = canvas.node().getContext('2d'); // SVG

        var svgForeground = addElement('svg--foreground', animation, 'svg')
            .attr('width', this.settings.width)
            .attr('height', this.settings.height); // modal

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
        'Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1kaXNwYXRjaC52Mi5taW4uanMnKTsKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1xdWFkdHJlZS52Mi5taW4uanMnKTsKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy10aW1lci52Mi5taW4uanMnKTsKICAgIHNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1mb3JjZS52Mi5taW4uanMnKTsgLy9zZWxmLmltcG9ydFNjcmlwdHMoJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZDMtZm9yY2UtcmV1c2VAMS4wLjEvYnVpbGQvZDMtZm9yY2UtcmV1c2UubWluLmpzJyk7CgogICAgc2VsZi5pbXBvcnRTY3JpcHRzKCdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2QzLWZvcmNlLXNhbXBsZWRAMS4wLjAvYnVpbGQvZDMtZm9yY2Utc2FtcGxlZC5taW4uanMnKTsKCiAgICBvbm1lc3NhZ2UgPSBmdW5jdGlvbiBvbm1lc3NhZ2UoZXZlbnQpIHsKICAgICAgdmFyIF9ldmVudCRkYXRhID0gZXZlbnQuZGF0YSwKICAgICAgICAgIG5vZGVzID0gX2V2ZW50JGRhdGEubm9kZXMsCiAgICAgICAgICBsYXlvdXQgPSBfZXZlbnQkZGF0YS5sYXlvdXQsCiAgICAgICAgICBzdHJlbmd0aCA9IF9ldmVudCRkYXRhLnN0cmVuZ3RoLAogICAgICAgICAgb3JiaXRSYWRpdXMgPSBfZXZlbnQkZGF0YS5vcmJpdFJhZGl1cywKICAgICAgICAgIHggPSBfZXZlbnQkZGF0YS54LAogICAgICAgICAgeSA9IF9ldmVudCRkYXRhLnksCiAgICAgICAgICByYWRpdXMgPSBfZXZlbnQkZGF0YS5yYWRpdXMsCiAgICAgICAgICBjb2xvciA9IF9ldmVudCRkYXRhLmNvbG9yOwogICAgICB2YXIgc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbigpLm5vZGVzKG5vZGVzKTsKICAgICAgaWYgKGxheW91dCA9PT0gJ2NpcmN1bGFyJykgc2ltdWxhdGlvbi5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhyYWRpdXMgKyAwLjUpKSAvLyBjb2xsaXNpb24gZGV0ZWN0aW9uCiAgICAgIC8vLmZvcmNlKCdjaGFyZ2UnLCBkMy5mb3JjZU1hbnlCb2R5KCkuc3RyZW5ndGgoc3RyZW5ndGgpKSAvLyBjaGFyZ2UKICAgICAgLy8uZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHlSZXVzZSgpLnN0cmVuZ3RoKHN0cmVuZ3RoKSkgLy8gY2hhcmdlCiAgICAgIC5mb3JjZSgnY2hhcmdlJywgZDMuZm9yY2VNYW55Qm9keVNhbXBsZWQoKS5zdHJlbmd0aChzdHJlbmd0aCkpIC8vIGNoYXJnZQogICAgICAuZm9yY2UoJ3gnLCBkMy5mb3JjZVgoeCkuc3RyZW5ndGgoMC4zKSkuZm9yY2UoJ3knLCBkMy5mb3JjZVkoeSkuc3RyZW5ndGgoMC4zKSk7ZWxzZSBpZiAobGF5b3V0ID09PSAncmFkaWFsJykgc2ltdWxhdGlvbi5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhyYWRpdXMgKyAwLjUpKSAvLyBjb2xsaXNpb24gZGV0ZWN0aW9uCiAgICAgIC5mb3JjZSgncicsIGQzLmZvcmNlUmFkaWFsKG9yYml0UmFkaXVzIC8gMikpOyAvLyBwb3NpdGlvbmluZwogICAgICAvLyBzdG9wIHNpbXVsYXRpb24KCiAgICAgIHNpbXVsYXRpb24uc3RvcCgpOyAvLyBpbmNyZW1lbnQgc2ltdWxhdGlvbiBtYW51YWxseQoKICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBNYXRoLmNlaWwoTWF0aC5sb2coc2ltdWxhdGlvbi5hbHBoYU1pbigpKSAvIE1hdGgubG9nKDEgLSBzaW11bGF0aW9uLmFscGhhRGVjYXkoKSkpOyBpIDwgbjsgKytpKSB7CiAgICAgICAgc2ltdWxhdGlvbi50aWNrKCk7CiAgICAgIH0gLy8gcmV0dXJuIHVwZGF0ZWQgbm9kZXMgYXJyYXkgdG8gYmUgZHJhd24gYW5kIHJlbmRlcmVkCgoKICAgICAgcG9zdE1lc3NhZ2UoewogICAgICAgIG5vZGVzOiBub2RlcywKICAgICAgICByYWRpdXM6IHJhZGl1cywKICAgICAgICBjb2xvcjogY29sb3IKICAgICAgfSk7CiAgICB9OwoKfSgpKTsKCg==',
        'data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yY2VTaW11bGF0aW9uV29ya2VyLmpzIiwic291cmNlcyI6WyJzcmMvaW5pdC9hZGRTdGF0aWNGb3JjZVNpbXVsYXRpb24vZm9yY2VTaW11bGF0aW9uV29ya2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1kaXNwYXRjaC52Mi5taW4uanMnKTtcclxuc2VsZi5pbXBvcnRTY3JpcHRzKCdodHRwczovL2QzanMub3JnL2QzLXF1YWR0cmVlLnYyLm1pbi5qcycpO1xyXG5zZWxmLmltcG9ydFNjcmlwdHMoJ2h0dHBzOi8vZDNqcy5vcmcvZDMtdGltZXIudjIubWluLmpzJyk7XHJcbnNlbGYuaW1wb3J0U2NyaXB0cygnaHR0cHM6Ly9kM2pzLm9yZy9kMy1mb3JjZS52Mi5taW4uanMnKTtcclxuLy9zZWxmLmltcG9ydFNjcmlwdHMoJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZDMtZm9yY2UtcmV1c2VAMS4wLjEvYnVpbGQvZDMtZm9yY2UtcmV1c2UubWluLmpzJyk7XHJcbnNlbGYuaW1wb3J0U2NyaXB0cyhcclxuICAgICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2QzLWZvcmNlLXNhbXBsZWRAMS4wLjAvYnVpbGQvZDMtZm9yY2Utc2FtcGxlZC5taW4uanMnXHJcbik7XHJcblxyXG5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgICBub2RlcywgLy8gZGF0YVxyXG4gICAgICAgIGxheW91dCxcclxuICAgICAgICBzdHJlbmd0aCxcclxuICAgICAgICBvcmJpdFJhZGl1cywgLy8gZm9yY2Ugc2ltdWxhdGlvbiBzZXR0aW5nc1xyXG4gICAgICAgIHgsXHJcbiAgICAgICAgeSwgLy8gY29vcmRpbmF0ZXNcclxuICAgICAgICByYWRpdXMsXHJcbiAgICAgICAgY29sb3IsIC8vIGFlc3RoZXRpY3NcclxuICAgIH0gPSBldmVudC5kYXRhO1xyXG5cclxuICAgIGNvbnN0IHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oKS5ub2Rlcyhub2Rlcyk7XHJcblxyXG4gICAgaWYgKGxheW91dCA9PT0gJ2NpcmN1bGFyJylcclxuICAgICAgICBzaW11bGF0aW9uXHJcbiAgICAgICAgICAgIC5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhyYWRpdXMgKyAwLjUpKSAvLyBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgIC8vLmZvcmNlKCdjaGFyZ2UnLCBkMy5mb3JjZU1hbnlCb2R5KCkuc3RyZW5ndGgoc3RyZW5ndGgpKSAvLyBjaGFyZ2VcclxuICAgICAgICAgICAgLy8uZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHlSZXVzZSgpLnN0cmVuZ3RoKHN0cmVuZ3RoKSkgLy8gY2hhcmdlXHJcbiAgICAgICAgICAgIC5mb3JjZSgnY2hhcmdlJywgZDMuZm9yY2VNYW55Qm9keVNhbXBsZWQoKS5zdHJlbmd0aChzdHJlbmd0aCkpIC8vIGNoYXJnZVxyXG4gICAgICAgICAgICAuZm9yY2UoJ3gnLCBkMy5mb3JjZVgoeCkuc3RyZW5ndGgoMC4zKSlcclxuICAgICAgICAgICAgLmZvcmNlKCd5JywgZDMuZm9yY2VZKHkpLnN0cmVuZ3RoKDAuMykpO1xyXG4gICAgZWxzZSBpZiAobGF5b3V0ID09PSAncmFkaWFsJylcclxuICAgICAgICBzaW11bGF0aW9uXHJcbiAgICAgICAgICAgIC5mb3JjZSgnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhyYWRpdXMgKyAwLjUpKSAvLyBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgIC5mb3JjZSgncicsIGQzLmZvcmNlUmFkaWFsKG9yYml0UmFkaXVzIC8gMikpOyAvLyBwb3NpdGlvbmluZ1xyXG5cclxuICAgIC8vIHN0b3Agc2ltdWxhdGlvblxyXG4gICAgc2ltdWxhdGlvbi5zdG9wKCk7XHJcblxyXG4gICAgLy8gaW5jcmVtZW50IHNpbXVsYXRpb24gbWFudWFsbHlcclxuICAgIGZvciAoXHJcbiAgICAgICAgdmFyIGkgPSAwLFxyXG4gICAgICAgICAgICBuID0gTWF0aC5jZWlsKE1hdGgubG9nKHNpbXVsYXRpb24uYWxwaGFNaW4oKSkgLyBNYXRoLmxvZygxIC0gc2ltdWxhdGlvbi5hbHBoYURlY2F5KCkpKTtcclxuICAgICAgICBpIDwgbjtcclxuICAgICAgICArK2lcclxuICAgICkge1xyXG4gICAgICAgIHNpbXVsYXRpb24udGljaygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybiB1cGRhdGVkIG5vZGVzIGFycmF5IHRvIGJlIGRyYXduIGFuZCByZW5kZXJlZFxyXG4gICAgcG9zdE1lc3NhZ2UoeyBub2RlcywgcmFkaXVzLCBjb2xvciB9KTtcclxufTtcclxuIl0sIm5hbWVzIjpbInNlbGYiLCJpbXBvcnRTY3JpcHRzIiwib25tZXNzYWdlIiwiZXZlbnQiLCJkYXRhIiwibm9kZXMiLCJsYXlvdXQiLCJzdHJlbmd0aCIsIm9yYml0UmFkaXVzIiwieCIsInkiLCJyYWRpdXMiLCJjb2xvciIsInNpbXVsYXRpb24iLCJkMyIsImZvcmNlU2ltdWxhdGlvbiIsImZvcmNlIiwiZm9yY2VDb2xsaWRlIiwiZm9yY2VNYW55Qm9keVNhbXBsZWQiLCJmb3JjZVgiLCJmb3JjZVkiLCJmb3JjZVJhZGlhbCIsInN0b3AiLCJpIiwibiIsIk1hdGgiLCJjZWlsIiwibG9nIiwiYWxwaGFNaW4iLCJhbHBoYURlY2F5IiwidGljayIsInBvc3RNZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7SUFBQUEsSUFBSSxDQUFDQyxhQUFMLENBQW1CLHdDQUFuQjtJQUNBRCxJQUFJLENBQUNDLGFBQUwsQ0FBbUIsd0NBQW5CO0lBQ0FELElBQUksQ0FBQ0MsYUFBTCxDQUFtQixxQ0FBbkI7SUFDQUQsSUFBSSxDQUFDQyxhQUFMLENBQW1CLHFDQUFuQjs7SUFFQUQsSUFBSSxDQUFDQyxhQUFMLENBQ0ksbUZBREo7O0lBSUFDLFNBQVMsR0FBRyxtQkFBVUMsS0FBVixFQUFpQjtJQUFBLG9CQVVyQkEsS0FBSyxDQUFDQyxJQVZlO0lBQUEsTUFFckJDLEtBRnFCLGVBRXJCQSxLQUZxQjtJQUFBLE1BR3JCQyxNQUhxQixlQUdyQkEsTUFIcUI7SUFBQSxNQUlyQkMsUUFKcUIsZUFJckJBLFFBSnFCO0lBQUEsTUFLckJDLFdBTHFCLGVBS3JCQSxXQUxxQjtJQUFBLE1BTXJCQyxDQU5xQixlQU1yQkEsQ0FOcUI7SUFBQSxNQU9yQkMsQ0FQcUIsZUFPckJBLENBUHFCO0lBQUEsTUFRckJDLE1BUnFCLGVBUXJCQSxNQVJxQjtJQUFBLE1BU3JCQyxLQVRxQixlQVNyQkEsS0FUcUI7SUFZekIsTUFBTUMsVUFBVSxHQUFHQyxFQUFFLENBQUNDLGVBQUgsR0FBcUJWLEtBQXJCLENBQTJCQSxLQUEzQixDQUFuQjtJQUVBLE1BQUlDLE1BQU0sS0FBSyxVQUFmLEVBQ0lPLFVBQVUsQ0FDTEcsS0FETCxDQUNXLFNBRFgsRUFDc0JGLEVBQUUsQ0FBQ0csWUFBSCxHQUFrQk4sTUFBbEIsQ0FBeUJBLE1BQU0sR0FBRyxHQUFsQyxDQUR0QjtJQUVJO0lBQ0E7SUFISixHQUlLSyxLQUpMLENBSVcsUUFKWCxFQUlxQkYsRUFBRSxDQUFDSSxvQkFBSCxHQUEwQlgsUUFBMUIsQ0FBbUNBLFFBQW5DLENBSnJCO0lBQUEsR0FLS1MsS0FMTCxDQUtXLEdBTFgsRUFLZ0JGLEVBQUUsQ0FBQ0ssTUFBSCxDQUFVVixDQUFWLEVBQWFGLFFBQWIsQ0FBc0IsR0FBdEIsQ0FMaEIsRUFNS1MsS0FOTCxDQU1XLEdBTlgsRUFNZ0JGLEVBQUUsQ0FBQ00sTUFBSCxDQUFVVixDQUFWLEVBQWFILFFBQWIsQ0FBc0IsR0FBdEIsQ0FOaEIsRUFESixLQVFLLElBQUlELE1BQU0sS0FBSyxRQUFmLEVBQ0RPLFVBQVUsQ0FDTEcsS0FETCxDQUNXLFNBRFgsRUFDc0JGLEVBQUUsQ0FBQ0csWUFBSCxHQUFrQk4sTUFBbEIsQ0FBeUJBLE1BQU0sR0FBRyxHQUFsQyxDQUR0QjtJQUFBLEdBRUtLLEtBRkwsQ0FFVyxHQUZYLEVBRWdCRixFQUFFLENBQUNPLFdBQUgsQ0FBZWIsV0FBVyxHQUFHLENBQTdCLENBRmhCLEVBdkJxQjtJQTJCekI7O0lBQ0FLLEVBQUFBLFVBQVUsQ0FBQ1MsSUFBWCxHQTVCeUI7O0lBK0J6QixPQUNJLElBQUlDLENBQUMsR0FBRyxDQUFSLEVBQ0lDLENBQUMsR0FBR0MsSUFBSSxDQUFDQyxJQUFMLENBQVVELElBQUksQ0FBQ0UsR0FBTCxDQUFTZCxVQUFVLENBQUNlLFFBQVgsRUFBVCxJQUFrQ0gsSUFBSSxDQUFDRSxHQUFMLENBQVMsSUFBSWQsVUFBVSxDQUFDZ0IsVUFBWCxFQUFiLENBQTVDLENBRlosRUFHSU4sQ0FBQyxHQUFHQyxDQUhSLEVBSUksRUFBRUQsQ0FKTixFQUtFO0lBQ0VWLElBQUFBLFVBQVUsQ0FBQ2lCLElBQVg7SUFDSCxHQXRDd0I7OztJQXlDekJDLEVBQUFBLFdBQVcsQ0FBQztJQUFFMUIsSUFBQUEsS0FBSyxFQUFMQSxLQUFGO0lBQVNNLElBQUFBLE1BQU0sRUFBTkEsTUFBVDtJQUFpQkMsSUFBQUEsS0FBSyxFQUFMQTtJQUFqQixHQUFELENBQVg7SUFDSCxDQTFDRDs7Ozs7OyJ9',
        false
    );
    /* eslint-enable */

    function simulate(data, x, y, color) {
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
            color: color,
        });
        return worker;
    }

    function draw(worker, color) {
        var main = this;

        worker.onmessage = function (event) {
            var className = 'fdg-static--'.concat(event.data.color.replace(/[^0-9_a-z]/gi, '-'));
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
                .attr('fill', event.data.color)
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
                        category: d.value.category,
                    };
                }); // Simulate and render force layout separately for individuals within each category.

            if (this.settings.colorBy.type === 'categorical') {
                this.metadata.event[0].foci.forEach(function (focus) {
                    var data = noStateChange.filter(function (d) {
                        return d.category === focus.key;
                    }); // Pass data, coordinates, and color to web worker.

                    var worker = simulate.call(
                        _this,
                        data,
                        focus.x,
                        focus.y,
                        _this.colorScale(focus.key)
                    ); // Pass web worker to draw function.

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
                    this.colorScale(0)
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

    function defineRadius(stateChanges) {
        var r =
            this.settings.eventChangeCountAesthetic !== 'color'
                ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
                : this.settings.minRadius;
        return r;
    }

    function defineColor(value) {
        var color =
            this.settings.colorBy.type !== 'frequency' ||
            this.settings.eventChangeCountAesthetic !== 'size'
                ? d3.rgb(this.colorScale(value)).toString()
                : 'rgb(170,170,170)';
        var fill = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
        var stroke = color.replace('rgb', 'rgba').replace(')', ', 1)');
        return {
            color: color,
            fill: fill,
            stroke: stroke,
        };
    }

    function defineDatum(group, state, statePrevious) {
        // Count state changes.
        var nStateChanges = countStateChanges.call(this, group, statePrevious); // Count state changes.

        var aesthetic =
            this.settings.colorBy.type === 'frequency'
                ? nStateChanges
                : state[this.settings.colorBy.variable]; // Define radius.

        var r = defineRadius.call(this, nStateChanges); // Define color.

        var color = defineColor.call(this, aesthetic);
        return _objectSpread2(
            {
                nStateChanges: nStateChanges,
                // number of state changes the indivdual has experienced a thus far
                aesthetic: aesthetic,
                // value that controls color
                r: r,
            },
            color
        );
    }
    /*
        // Define radius input.
        const rInput = this.settings.

        // Define radius.
        const r = defineRadius.call(this, rInput);

        // Define color input.
        const colorInput =
            this.settings.colorBy.type === 'frequency'
                ? nStateChanges
                : state[this.settings.colorBy.variable];

        // Define color.
        const color = defineColor.call(this, colorInput);
    */

    function data() {
        var _this = this;

        // Count the number of individuals at each focus at previous timepoint.
        this.metadata.event.forEach(function (event) {
            event.prevCount = event.count;
        });
        this.data.nested.forEach(function (d) {
            // Update individual to next event.
            d.value.statePrevious = d.value.state;

            var event = _this.metadata.event.find(function (event) {
                return event.value === d.value.state.event;
            });

            d.value.coordinates = {
                x: event.x,
                y: event.y,
            }; // Calculate Euclidean distance between point and destination.

            d.value.distance = Math.sqrt(Math.pow(event.x - d.x, 2) + Math.pow(event.y - d.y, 2)); // calculate the Euclidean distance between a bubble and its destination and only until
            // that distance is below a certain threshold is the bubble allowed to progress to the next
            // destination.
            // Ensure point reaches a minimum distance from destination
            // before moving to next destination.

            if (d.value.distance < _this.settings.orbitRadius / 4)
                d.value.state = getState.call(_this, d.value.group);
            var datum = defineDatum.call(
                _this,
                d.value.group,
                d.value.state,
                d.value.statePrevious
            );
            Object.assign(d.value, datum);
        }); //console.table(d3.nest().key(d => d.value.state.event).rollup(group => d3.median(group, d => d.y)).entries(this.data.nested));
        //console.table(d3.nest().key(d => d.value.coordinates.x).rollup(group => group.length).entries(this.data.nested));
        // Record change in number of IDs at each focus at current timepoint.

        this.metadata.event.forEach(function (event) {
            event.data = _this.data.nested.filter(function (d, i) {
                return d.value.state.event === event.value;
            });
            event.count = event.data.length;
            event.cumulative = _this.data.filter(function (d) {
                return d.event === event.value && d.start_timepoint <= _this.settings.timepoint;
            }).length;
            event.change = event.count - event.prevCount;
        });
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
            }); // force simulations
        //this.metadata.event.forEach((event) => {
        //    // Update coordinates of categorical foci.
        //    if (this.settings.colorBy.type === 'categorical')
        //        event.foci.forEach((focus, i) => {
        //            focus.x = event.x + 50 * Math.cos(i * this.settings.colorBy.theta);
        //            focus.y = event.y + 50 * Math.sin(i * this.settings.colorBy.theta);
        //            const forceSimulation = event.forceSimulation.find(
        //                (forceSimulation) => forceSimulation.category === focus.key
        //            );
        //            forceSimulation.force('x', d3.forceX(focus.x).strength(0.3));
        //            forceSimulation.force('y', d3.forceY(focus.y).strength(0.3));
        //        });
        //    else
        //        event.forceSimulation.forEach((forceSimulation) => {
        //            forceSimulation
        //                .force('x', d3.forceX(event.x).strength(0.3))
        //                .force('y', d3.forceY(event.y).strength(0.3));
        //        });
        //});
        // Update the node data.

        data.call(this);
        this.forceSimulation
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
            ); // static force simulation

        addStaticForceSimulation.call(this); // focus annotations

        this.focusAnnotations.attr('transform', function (d) {
            return 'translate('.concat(d.x, ',').concat(d.y, ')');
        });
    }

    function layout() {
        var main = addElement('main', d3.select(this.element)); // controls on top

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
                    category:
                        _this.settings.colorBy.type === 'categorical'
                            ? group[0][_this.settings.colorBy.variable]
                            : null,
                };
            })
            .entries(this.data);
        nest.forEach(function (d, i) {
            Object.assign(d, d.value);
            d.value = d.key;
            d.duration = d.value;
            delete d.key;
        });
        return nest;
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

    function orbit(event) {
        var _this = this;

        var nest = d3
            .nest()
            .key(function (d) {
                return d.order;
            })
            .entries(
                event.filter(function (event) {
                    return event.value !== _this.settings.eventCentral;
                })
            );
        return nest;
    }

    function defineMetadata() {
        var _this = this;

        // Define sets.
        var metadata = {}; // Add additional metadata to ID set.

        metadata.id = id.call(this); // Settings dependent on the ID set.

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
            3000 /
                metadata.id.filter(function (d) {
                    return !(_this.settings.drawStaticSeparately && d['static']);
                }).length;
        this.settings.staticRadius = this.settings.staticRadius || 3000 / metadata.id.length;
        this.settings.maxRadius =
            this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
        this.settings.chargeStrength = -(
            2000 /
            metadata.id.filter(function (d) {
                return !(_this.settings.drawStaticSeparately && d['static']);
            }).length
        );
        this.settings.staticChargeStrength = -(2000 / metadata.id.length);
        this.settings.fill = this.settings.fill || metadata.id.length <= 2500; // Add additional metadata to event set.

        metadata.event = event.call(this); // Update settings that depend on event set.

        this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].value;
        this.settings.nFoci =
            this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral; // number of event types minus one

        this.settings.eventChangeCount =
            this.settings.eventChangeCount ||
            metadata.event.slice(1).map(function (event) {
                return event.value;
            }); // Define orbits.

        metadata.orbit = orbit.call(this, metadata.event); // Determine the dimensions of the canvas, the position of the foci, and the size of the orbits.

        coordinates.call(this, metadata); // Define color scale.

        var colors = this.settings.colors();
        var domain;

        if (this.settings.colorBy.type === 'frequency') {
            domain = d3.range(colors.length);
            this.colorScale = d3.scaleLinear().domain(domain).range(colors).clamp(true);
        } else if (this.settings.colorBy.type === 'continuous') {
            domain = d3.extent(this.data, function (d) {
                return d[_this.settings.colorBy.variable];
            });
            this.colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain(domain);
            var interpolator = this.colorScale.interpolator(); // read the color scale's interpolator

            var mirror = function mirror(t) {
                return interpolator(1 - t);
            }; // returns the mirror image of the interpolator

            if (this.settings.colorBy.mirror) this.colorScale.interpolator(mirror); // updates the scale's interpolator
        } else if (this.settings.colorBy.type === 'categorical') {
            domain = _toConsumableArray(
                new Set(
                    this.data.map(function (d) {
                        return d[_this.settings.colorBy.variable];
                    })
                ).values()
            ).sort();
            this.colorScale = d3.scaleOrdinal().domain(domain).range(d3.schemeTableau10); // Define the offset of each cateogry as function of the focus coordinates, the category
            // sequence, and theta.

            this.settings.colorBy.theta = (2 * Math.PI) / domain.length;
            metadata.event.forEach(function (event) {
                event.foci = domain.map(function (category, i) {
                    var focus = {
                        key: category,
                        x: event.x + 50 * Math.cos(i * _this.settings.colorBy.theta),
                        y: event.y + 50 * Math.sin(i * _this.settings.colorBy.theta),
                    };
                    return focus;
                });
            });
        }

        this.domain = domain;
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

    function text() {
        var _this = this;

        this.settings.progress = this.settings.timepoint / this.settings.duration; // Update timepoint control.

        this.controls.timepoint.inputs.property('value', this.settings.timepoint); // Update timer.

        this.containers.timer.text(
            ''.concat(this.settings.timepoint, ' ').concat(this.settings.timeUnit)
        ); // Update progress bar.

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
        ); // Update focus percentages

        if (this.settings.eventCount)
            this.focusAnnotations
                .selectAll('tspan.fdg-focus-annotation__event-count')
                .text(function (d) {
                    return ''
                        .concat(d.count, ' (')
                        .concat(d3.format('.1%')(d.count / _this.data.nested.length), ')');
                }); // Update frequency table.

        this.freqTable.tr
            .selectAll('td')
            .data(function (event) {
                return [event.value, event.cumulative];
            })
            .join('td')
            .text(function (d) {
                return typeof d === 'number' ? d3.format(',d')(d) : d;
            });
    }

    function update$1() {
        // Update the node data.
        data.call(this); // Accentuate the orbits when an event occurs.

        pulseOrbits.call(this); // Update timer, focus labels, and annotations.

        text.call(this);
    }

    function restartForceSimulation() {
        // Remove centering force after first interval.
        if (this.settings.timepoint === 1) this.forceSimulation.force('center', null); // Reheat the simulation (alpha(1)) and update the coordinates of the x- and y- forces.

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
    }

    function update$2() {
        this.modalText = this.settings.text[this.settings.modalIndex];
        if (this.settings.modalIndex === this.settings.text.length - 1) this.modal.stop(); // Update modal text.

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
                    this.containers.svgBackground.selectAll('circle.fdg-static__circle'),
                    'stroke',
                    'rgba(215,25,28,0)',
                    'rgba(215,25,28,.5)'
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
            // Initial event for the given individual.
            d.value.statePrevious = null;
            d.value.state = getState.call(_this, d.value.group, 0);
            var datum = defineDatum.call(
                _this,
                d.value.group,
                d.value.state,
                d.value.statePrevious
            );
            Object.assign(d.value, datum);
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

    function colorSizeToggle() {
        var _this = this;

        var fdg = this;
        var container = this.controls.container
            .append('div')
            .classed('fdg-control fdg-control--color-size', true);
        var inputs = container
            .selectAll('div')
            .data(['color', 'size', 'both'])
            .enter()
            .append('div')
            .attr('class', function (d) {
                return 'fdg-button '
                    .concat(d, ' ')
                    .concat(d === _this.settings.eventChangeCountAesthetic ? 'current' : '');
            })
            .attr('title', function (d) {
                return 'Quantify the number of '
                    .concat(fdg.util.csv(_this.settings.eventChangeCount), ' events by ')
                    .concat(d !== 'both' ? d : 'color and size');
            })
            .text(function (d) {
                return d;
            });
        inputs.on('click', function (d) {
            inputs.classed('current', function (di) {
                return di === d;
            });
            fdg.settings.eventChangeCountAesthetic = d; // Update tooltips of event list toggles.

            fdg.controls.eventList.inputs.attr('title', function (d) {
                return ''
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
                    );
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
            this.controls.eventList = eventList.call(this);
            this.controls.colorSizeToggle = colorSizeToggle.call(this);
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

    function color$1(svg, legendDimensions) {
        var _this = this;

        var marks = svg
            .selectAll('rect.legend-mark')
            .data(this.settings.colors())
            .enter()
            .append('rect')
            .classed('legend-mark', true)
            .attr('x', function (d, i) {
                return i * (legendDimensions[0] / _this.settings.colors().length);
            })
            .attr('y', 0)
            .attr('width', legendDimensions[0] / this.settings.colors().length)
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

    function both(svg, legendDimensions) {
        var _this = this;

        var marks = svg
            .selectAll('circle.legend-mark')
            .data(this.settings.colors())
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
                        i * (legendDimensions[0] / _this.settings.colors().length) +
                        legendDimensions[0] / _this.settings.colors().length / 2
                    );
                })
                .attr('cy', legendDimensions[1] / 4)
                .attr('r', function (d, i) {
                    return i + _this.settings.minRadius;
                });
        else
            marks
                .attr('x', function (d, i) {
                    return (
                        i * (legendDimensions[0] / _this.settings.colors().length) +
                        legendDimensions[0] / _this.settings.colors().length / 2 -
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

    function both$1(svg, legendDimensions) {
        var _this = this;

        var marks = svg
            .selectAll('circle.legend-mark')
            .data(this.settings.colors())
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
                        i * (legendDimensions[0] / _this.settings.colors().length) +
                        legendDimensions[0] / _this.settings.colors().length / 2
                    );
                })
                .attr('cy', legendDimensions[1] / 4)
                .attr('r', function (d, i) {
                    return i + _this.settings.minRadius;
                });
        else
            marks
                .attr('x', function (d, i) {
                    return (
                        i * (legendDimensions[0] / _this.settings.colors().length) +
                        legendDimensions[0] / _this.settings.colors().length / 2 -
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
        size: both,
        both: both$1,
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
            .attr('x', legendDimensions[0] / this.settings.colors().length / 2)
            .attr('y', legendDimensions[1] / 2 + 16)
            .attr('text-anchor', 'middle')
            .text('0'); // upper end of scale

        var upper = svg
            .append('text')
            .attr(
                'x',
                legendDimensions[0] - legendDimensions[0] / this.settings.colors().length / 2
            )
            .attr('y', legendDimensions[1] / 2 + 16)
            .attr('text-anchor', 'middle')
            .text(''.concat(this.settings.colors().length - 1, '+'));
        return {
            container: container,
            label: label,
            svg: svg,
            marks: marks,
            lower: lower,
            upper: upper,
        };
    }

    function addLegends() {
        var _this = this;

        this.legends = {
            container: this.containers.legends,
        };

        if (this.settings.colorBy.type === 'continuous') {
            var container = this.legends.container
                .append('div')
                .classed('fdg-legend fdg-legend--continuous', true);
            container.node().appendChild(
                continuous({
                    color: this.colorScale,
                    title: this.settings.colorBy.label,
                    width: 200,
                    height: 50,
                    tickValues: [
                        this.colorScale.domain()[0],
                        (this.colorScale.domain()[1] - this.colorScale.domain()[0]) / 2,
                        this.colorScale.domain()[1],
                    ],
                })
            );
        } else if (this.settings.colorBy.type === 'categorical') {
            var _container = this.legends.container
                .append('div')
                .classed('fdg-legend fdg-legend--categorical', true);

            _container
                .append('div')
                .classed('fdg-sidebar__label fdg-legend__label', true)
                .text(this.settings.colorBy.label);

            var legendItems = _container
                .append('svg')
                .attr('width', 200)
                .attr('height', 20 * this.colorScale.domain().length)
                .selectAll('g')
                .data(this.colorScale.domain())
                .join('g');

            legendItems
                .append('circle')
                .attr('cx', 20)
                .attr('cy', function (d, i) {
                    return i * 20 + 10;
                })
                .attr('r', 7)
                .attr('fill', function (d) {
                    return _this.colorScale(d);
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
                            return di.category === d;
                        }).length,
                        ')'
                    );
                });
        } else if (this.settings.colorBy.type === 'frequency') {
            this.legends.color = makeLegend.call(this, 'color');
            this.legends.size = makeLegend.call(this, 'size');
            this.legends.both = makeLegend.call(this, 'both');
        }
    }

    function addFreqTable() {
        var freqTable = {
            container: this.containers.freqTable,
        };
        freqTable.table = freqTable.container.append('table');
        freqTable.thead = freqTable.table.append('thead');
        freqTable.th = freqTable.thead
            .append('th')
            .classed('fdg-sidebar__label', true)
            .attr('colspan', 2)
            .text('Cumulative Number of Events');
        freqTable.tbody = freqTable.table.append('tbody');
        freqTable.tr = freqTable.tbody
            .selectAll('tr')
            .data(this.metadata.event.slice(1))
            .join('tr');
        freqTable.td = freqTable.tr
            .selectAll('td')
            .data(function (event) {
                return [event.value, event.cumulative];
            })
            .join('td')
            .text(function (d) {
                return typeof d === 'number' ? d3.format(',d')(d) : d;
            });
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

    function annotateFoci() {
        var _this = this;

        var g = this.containers.svgForeground
            .append('g')
            .classed('fdg-g fdg-g--focus-annotations', true);
        var fociLabels = g
            .selectAll('g.fdg-focus-annotation')
            .data(this.metadata.event)
            .join('g')
            .classed('fdg-focus-annotation', true)
            .attr('transform', function (d) {
                return 'translate('.concat(d.x, ',').concat(d.y, ')');
            }); // Position annotation relative to focus along the x-axis.

        var isCenterX = function isCenterX(d) {
            return Math.round(d.x) === Math.round(_this.settings.orbitRadius / 2);
        };

        var isLessThanCenterX = function isLessThanCenterX(d) {
            return d.order === 1 || Math.round(d.x) < Math.round(_this.settings.width / 2);
        };

        var getTextAnchor = function getTextAnchor(d) {
            return isCenterX(d) ? 'middle' : isLessThanCenterX(d) ? 'start' : 'end';
        };

        var getDx = function getDx(d) {
            return isCenterX(d) ? 0 : isLessThanCenterX(d) ? '2em' : '-2em';
        }; // Position annotation relative to focus along the y-axis.

        var isCenterY = function isCenterY(d) {
            return Math.round(d.y) === Math.round(_this.settings.height / 2);
        };

        var isLessThanCenterY = function isLessThanCenterY(d) {
            return Math.round(d.y) < Math.round(_this.settings.height / 2);
        };

        var getDy = function getDy(d) {
            return isCenterY(d) ? 0 : isLessThanCenterY(d) ? '-2em' : '2em';
        }; // background - white annotation highlight
        // foreground - black annotation text

        ['background', 'foreground'].forEach(function (pos) {
            var text = fociLabels
                .append('text')
                .classed('fdg-focus-annotation__text fdg-focus-annotation__'.concat(pos), true);
            text.style('transform', function (d) {
                return 'translate('.concat(getDx(d), ',').concat(getDy(d), ')');
            });
            var label = text
                .append('tspan')
                .classed('fdg-focus-annotation__label', true)
                .attr('x', 0)
                .attr('text-anchor', function (d) {
                    return getTextAnchor(d);
                })
                .text(function (d) {
                    return d.value;
                });
            var eventCount = text
                .append('tspan')
                .classed('fdg-focus-annotation__event-count', true)
                .classed('fdg-hidden', _this.settings.eventCount === false)
                .attr('x', 0)
                .attr('dy', '1.3em')
                .attr('text-anchor', function (d) {
                    return getTextAnchor(d);
                }); // Position annotations differently in categorical layout.

            if (_this.settings.colorBy.type === 'categorical') {
                text.style('transform', function (d) {
                    return 'translate(0,'.concat(
                        isCenterY(d) ? '0' : isLessThanCenterY(d) ? '5em' : '-5em',
                        ')'
                    );
                });
                label.attr('text-anchor', 'middle');
                eventCount.attr('text-anchor', 'middle');
            }
        });
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
                var duration = d3.sum(group, function (d) {
                    return d.duration;
                });
                var category =
                    _this.settings.colorBy.type === 'categorical'
                        ? group[0][_this.settings.colorBy.variable]
                        : null; // Initial state for the given individual.

                var statePrevious = null;
                var state = getState.call(_this, group, 0);
                var noStateChange =
                    group.length === 1 && state.event === _this.settings.eventCentral;

                var event = _this.metadata.event.find(function (event) {
                    return event.value === state.event;
                });

                var coordinates = {
                    x: event.x,
                    y: event.y,
                }; // Count number of state changes, define aesthetic, define radius, and define color.

                var datum = defineDatum.call(_this, group, state, statePrevious);
                return _objectSpread2(
                    {
                        group: group,
                        // array of data representing all records for an individual
                        duration: duration,
                        // full duration of individual in data
                        category: category,
                        statePrevious: statePrevious,
                        state: state,
                        // object representing a single record of an individual
                        noStateChange: noStateChange,
                        // boolean - did individual have any events? used to present those individuals in a static force layout
                        coordinates: coordinates,
                    },
                    datum
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

    function forceManyBodySampled() {
        var nodes,
            alpha,
            strength = constant(-30),
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
                ? ((strength = typeof _ === 'function' ? _ : constant(+_)), initialize(), force)
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
                ? ((neighborSize = typeof _ === 'function' ? _ : constant(+_)), initialize(), force)
                : neighborSize;
        };

        force.updateSize = function (_) {
            return arguments.length
                ? ((updateSize = typeof _ === 'function' ? _ : constant(+_)), initialize(), force)
                : updateSize;
        };

        force.sampleSize = function (_) {
            return arguments.length
                ? ((sampleSize = typeof _ === 'function' ? _ : constant(+_)), initialize(), force)
                : sampleSize;
        };

        force.chargeMultiplier = function (_) {
            return arguments.length
                ? ((chargeMultiplier = typeof _ === 'function' ? _ : constant(+_)),
                  initialize(),
                  force)
                : chargeMultiplier;
        };

        force.source = function (_) {
            return arguments.length ? ((rand = _), force) : rand;
        };

        return force;
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
                _this.containers.canvas.context.beginPath(); // circle

                if (_this.settings.shape === 'circle') {
                    _this.containers.canvas.context.moveTo(d.x + d.r, d.y);

                    _this.containers.canvas.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);

                    if (_this.settings.fill) {
                        _this.containers.canvas.context.fillStyle = d.value.fill;

                        _this.containers.canvas.context.fill();
                    }

                    _this.containers.canvas.context.strokeStyle = d.value.stroke;

                    _this.containers.canvas.context.stroke();
                } // square
                else {
                    //this.containers.canvas.context.moveTo(d.x + d.r, d.y);
                    _this.containers.canvas.context.rect(
                        d.x - d.value.r,
                        d.y - d.value.r,
                        d.value.r * 2,
                        d.value.r * 2
                    );

                    if (_this.settings.fill) {
                        _this.containers.canvas.context.fillStyle = d.value.fill;

                        _this.containers.canvas.context.fill();
                    }

                    _this.containers.canvas.context.strokeStyle = d.value.stroke;

                    _this.containers.canvas.context.stroke();
                }
            });
        this.containers.canvas.context.restore();
    }

    function addForceSimulation() {
        // When using D3’s force layout with a disjoint graph, you typically want the positioning
        // forces (d3.forceX and d3.forceY) instead of the centering force (d3.forceCenter). The
        // positioning forces, unlike the centering force, prevent detached subgraphs from escaping
        // the viewport.
        //
        // https://observablehq.com/@d3/disjoint-force-directed-graph?collection=@d3/d3-force
        this.forceSimulation = d3
            .forceSimulation()
            .nodes(
                this.data.nested.filter(function (d) {
                    return !d.value.noStateChange;
                })
            )
            .alphaDecay(0.01)
            .velocityDecay(0.9)
            .force(
                'center',
                d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2)
            )
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
            ) //.force('charge', d3.forceManyBody().strength(this.settings.chargeStrength))
            //.force('charge', forceManyBodyReuse().strength(this.settings.chargeStrength))
            .force('charge', forceManyBodySampled().strength(this.settings.chargeStrength * 5))
            .force(
                'collide',
                d3.forceCollide().radius(function (d) {
                    return d.value.r + 0.5;
                }) //d3.forceCollide().radius(this.settings.minRadius + 1)
            )
            .on('tick', tick.bind(this));
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
            settings: Object.assign(settings, settings$1),
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
