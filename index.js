(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global = global || self), (global.forceDirectedGraph = factory()));
})(this, function () {
    'use strict';

    function csv(array) {
        var and = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var csv = array.join(', ');
        if (and) csv = csv.replace(/, ([^,]*)$/, ' and $1');
        return csv;
    }

    var util = {
        csv: csv,
    };

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
        individualCounts: null,
        individualCountEvents: null,
        excludeFirst: true,
        excludeLast: true,
        // animation settings
        speed: 'slow',
        speeds: {
            slow: 1000,
            medium: 200,
            fast: 50,
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
        nFoci: null,
        // defined in ./defineMetadata/dataDrivenSettings/event
        translate: false,
        hideControls: false,
        // color and size settings
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
        explanation: [
            'Each bubble in this animation represents an individual.',
            'As individuals experience events and change states, their bubble gravitates toward the focus representing that event.',
            'The number of state changes dictates the color and/or size of the bubbles.',
            'Use the controls above to interact with and alter the animation.',
        ],
        // array of strings
        information: null, // array of strings
    };

    function addElement(name, parent) {
        var tagName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'div';
        var element = parent.append(tagName).classed('fdg-'.concat(name), true);
        return element;
    }

    function layout() {
        var fdg = this;
        var main = addElement('main', d3.select(this.element)); // controls on top

        var controls = addElement('controls', main).classed(
            'fdg-hidden',
            this.settings.hideControls
        ); // sidebar to the left

        var sidebar = addElement('sidebar', main);
        var timing = addElement('timing', sidebar).style('position', 'relative');
        var timer = addElement('timer', timing);
        var slider = addElement('slider', timing, 'input')
            .attr('type', 'range')
            .attr('min', 0)
            .attr('value', 0)
            .property('disabled', true)
            .attr(
                'title',
                'The animation is '
                    .concat(
                        d3.format('.1%')(this.settings.timepoint / this.settings.duration),
                        ' complete with '
                    )
                    .concat(this.settings.duration, ' ')
                    .concat(this.settings.timeUnit.split(' ')[0], ' to go.')
            ); // TODO: make slider into a control - need to figure out a new way to count up the state changes up to the selected timepoint

        slider.on('change', function () {
            console.log(this.value);
            fdg.settings.timepoint = +this.value;
        });
        var countdown = addElement('countdown', timing)
            .style('height', '22px')
            .style('width', '100%')
            .style('text-align', 'center')
            .selectAll('div')
            .data(d3.range(-1, this.settings.resetDelay / 1000))
            .join('div')
            .style('width', '100%')
            .style('display', 'inline-block')
            .text(function (d) {
                return 'Looping in '.concat(d + 1, ' second').concat(d === 0 ? '' : 's');
            })
            .classed('fdg-hidden', true);
        var legends = addElement('legends', sidebar);
        var freqTable = addElement('freq-table', sidebar);
        var info = addElement('info', sidebar); // animation to the right

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

        var modal = addElement('modal', animation); //.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec erat orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus ut pretium augue, vitae aliquam arcu. Etiam consequat, lectus sit amet volutpat auctor, dui libero consectetur magna, eu ultricies elit ex non dui. Maecenas quis lacus non enim gravida ultrices. Phasellus vitae orci eget libero tempor scelerisque. Nunc auctor ut mi in fringilla. Praesent blandit id est ut aliquet.');

        return {
            main: main,
            controls: controls,
            sidebar: sidebar,
            timing: timing,
            timer: timer,
            slider: slider,
            countdown: countdown,
            legends: legends,
            freqTable: freqTable,
            info: info,
            animation: animation,
            svgBackground: svgBackground,
            canvas: canvas,
            svgForeground: svgForeground,
            modal: modal,
        };
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

    function id() {
        var nest = d3
            .nest()
            .key(function (d) {
                return d.id;
            })
            .rollup(function (group) {
                return d3.sum(group, function (d) {
                    return +d.duration;
                });
            })
            .entries(this.data);
        nest.forEach(function (d) {
            d.duration = d.value;
            d.value = d.key;
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
                    : 0;
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
        }); // Ensure events plot in order.

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
            ); //export default function orbits(event) {
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
        var theta =
            (2 * Math.PI) /
            (this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral - 1);

        var thetaFactor = function thetaFactor(i) {
            return i === 0
                ? 0
                : i === 1
                ? -1.75
                : i === 2
                ? 0.75
                : i === 3
                ? -0.25
                : i === 4
                ? 0.25
                : 0;
        };

        metadata.event.forEach(function (event, i) {
            event.radius = event.order * _this.settings.orbitRadius; //event.theta = thetaFactor(i) * theta

            event.theta =
                event.position !== 0
                    ? (2 * Math.PI * event.position) / 360
                    : thetaFactor(i) * theta;
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
        this.settings.minRadius = this.settings.minRadius || 3000 / metadata.id.length;
        this.settings.maxRadius =
            this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
        this.settings.fill = this.settings.fill || metadata.id.length <= 2500; // Add additional metadata to event set.

        metadata.event = event.call(this); // Update settings that depend on event set.

        this.settings.width = this.settings.width || metadata.event.length;
        this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].value;
        this.settings.eventFinal =
            Array.isArray(this.settings.eventFinal) && this.settings.eventFinal.length
                ? this.settings.eventFinal
                : [this.settings.eventFinal || metadata.event[metadata.event.length - 1].value];
        this.settings.nFoci =
            this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral; // number of event types minus one

        this.settings.eventChangeCount =
            this.settings.eventChangeCount ||
            metadata.event.slice(1).map(function (event) {
                return event.value;
            });
        this.settings.eventSequence = metadata.event
            .filter(function (event, i) {
                return _this.settings.excludeLast ? i !== metadata.event.length - 1 : false;
            })
            .filter(function (event, i) {
                return _this.settings.excludeFirst ? i !== 0 : false;
            })
            .map(function (event) {
                return event.value;
            });
        this.settings.R = this.settings.width / metadata.event.length / 2; // Define orbits.

        metadata.orbit = orbit.call(this, metadata.event); // Determine the dimensions of the canvas, the position of the foci, and the size of the orbits.

        coordinates.call(this, metadata); // Define color scale.

        var colors = this.settings.colors();

        if (this.settings.colorBy.type === 'frequency') {
            this.colorScale = d3
                .scaleLinear()
                .domain(d3.range(colors.length))
                .range(colors)
                .clamp(true);
        } else if (this.settings.colorBy.type === 'continuous') {
            this.colorScale = d3
                .scaleSequential()
                .domain(
                    d3
                        .extent(this.data, function (d) {
                            return d[_this.settings.colorBy.variable];
                        })
                        .reverse()
                )
                .interpolator(d3.interpolateRdYlGn)
                .clamp(true);
        } else if (this.settings.colorBy.type === 'categorical') {
            this.colorScale = d3
                .scaleOrdinal()
                .domain(
                    _toConsumableArray(
                        new Set(
                            this.data.map(function (d) {
                                return d[_this.settings.colorBy.variable];
                            })
                        ).values()
                    )
                )
                .range(d3.schemeTableau10);
        } //console.log(this.data);
        //console.log(this.colorScale.domain());
        //console.log(this.colorScale.range());
        //console.log(
        //    JSON.stringify(
        //        d3.range(3).map(d => d3.color(this.colorScale(d/100)).formatHex()),
        //        null,
        //        4
        //    )
        //);

        return metadata;
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
            .filter(function (d) {
                return _this.settings.eventChangeCount.includes(d.event);
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

    function defineColor(stateChanges) {
        var color =
            this.settings.eventChangeCountAesthetic !== 'size'
                ? this.settings.color(stateChanges)
                : 'rgb(170,170,170)';
        var fill = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
        var stroke = color.replace('rgb', 'rgba').replace(')', ', 1)');
        return {
            color: color,
            fill: fill,
            stroke: stroke,
        };
    }

    function data() {
        var _this = this;

        // Count the number of individuals at each focus at previous timepoint.
        this.metadata.event.forEach(function (event) {
            event.prevCount = event.count;
        });
        this.data.nested.forEach(function (d) {
            // Update individual to next event.
            d.value.state = getState.call(_this, d.value.group); // Count state changes.

            d.value.nStateChanges = countStateChanges.call(_this, d.value.group); // Define radius.

            d.value.r = defineRadius.call(_this, d.value.nStateChanges); // Define color.

            Object.assign(d.value, defineColor.call(_this, d.value.nStateChanges));
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

    function text() {
        var _this = this;

        // Update timepoint control.
        this.controls.timepoint.inputs.property('value', this.settings.timepoint); // Update timer.

        this.containers.timer.text(
            ''.concat(this.settings.timepoint, ' ').concat(this.settings.timeUnit)
        ); // Update slider.

        this.containers.slider.attr('value', this.settings.timepoint).attr(
            'title',
            'The animation is '
                .concat(
                    d3.format('.1%')(this.settings.timepoint / this.settings.duration),
                    ' complete with '
                )
                .concat(this.settings.duration - this.settings.timepoint, ' ')
                .concat(this.settings.timeUnit.split(' ')[0], ' to go.')
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
                return d;
            }); // Update notes
        //if (Array.isArray(this.settings.notes)) {
        //    if (
        //        this.settings.timepoint === this.settings.notes[this.settings.notesIndex].startTimepoint
        //    ) {
        //        this.containers.info
        //            .style('opacity', 0)
        //            .transition()
        //            .duration(600)
        //            .style('opacity', 1)
        //            .text(this.settings.notes[this.settings.notesIndex].text);
        //    }
        //    // Make note disappear at the end.
        //    else if (
        //        this.settings.timepoint === this.settings.notes[this.settings.notesIndex].stopTimepoint
        //    ) {
        //        this.containers.info.transition().duration(1000).style('opacity', 0);
        //        this.settings.notesIndex += 1;
        //        if (this.settings.notesIndex === this.settings.notes.length) {
        //            this.settings.notesIndex = 0;
        //        }
        //    }
        //}
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
        this.containers.countdown.classed('fdg-hidden', function (d) {
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
        d3.select(this)
            .transition()
            .duration(modalSpeed / 15)
            .delay(modalSpeed - (modalSpeed / 15) * 2)
            .style('opacity', 0);
    }

    function fadeIn(selection, modalSpeed) {
        selection
            .style('opacity', 0)
            .transition()
            .duration(modalSpeed / 15)
            .style('opacity', 1)
            .on('end', function () {
                fadeOut.call(this, modalSpeed);
            });
    }

    function runModal() {
        var _this = this;

        var index = 0; // index of item in text array

        this.containers.modal
            .text(this.settings.text[index])
            .call(fadeIn, this.settings.modalSpeed);
        this.modal = d3.interval(function () {
            index++;
            if (index === _this.settings.text.length - 1) index = 0;

            _this.containers.modal
                .text(_this.settings.text[index])
                .call(fadeIn, _this.settings.modalSpeed); //if (index === text.length - 1) {
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
        this.settings.notesIndex = 0;
        this.controls.timepoint.inputs.attr('value', 0); // Update the event object of the population.

        this.metadata.event.forEach(function (event) {
            event.prevCount = 0;
            event.count = 0;
            event.cumulative = 0;
        });
        this.data.nested.forEach(function (d) {
            // Initial event for the given individual.
            d.value.state = getState.call(_this, d.value.group, 0); // Count state changes.

            d.value.nStateChanges = countStateChanges.call(_this, d.value.group); // Define radius.

            d.value.r = defineRadius.call(_this, d.value.nStateChanges); // Define color.

            Object.assign(d.value, defineColor.call(_this, d.value.nStateChanges));
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

            _this.containers.slider.attr('value', _this.settings.timepoint);

            window.clearInterval(countdown);
            window.clearTimeout(timeout);

            _this.containers.countdown.classed('fdg-hidden', true);

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
            event.forceSimulation.nodes(event.data);
            event.forceSimulation.alpha(1).restart();
        });
    }

    var increment = function increment(arg) {
        // Increment the timepoint.
        this.settings.timepoint += !!arg; // update animation if timepoint is less than duration of animation

        if (this.settings.timepoint <= this.settings.duration) update.call(this);
        // otherwise reset animation
        else reset.call(this); // Resume the force simulation.

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
            .classed('fdg-control fdg-control--step', true);
        var inputs = container
            .append('input')
            .classed('fdg-button fdg-input', true)
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
                .classed('fdg-hidden', fdg.settings.eventChangeCount.length === 0)
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
        this.controls.eventList = eventList.call(this);
        this.controls.colorSizeToggle = colorSizeToggle.call(this);
        this.controls.container
            .selectAll('.fdg-button')
            .on('mousedown', function () {
                this.classList.toggle('clicked');
            })
            .on('mouseup', function () {
                this.classList.toggle('clicked');
            });
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
            .attr('height', legendDimensions[1] / 2)
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

    function size(svg, legendDimensions) {
        var _this = this;

        var marks = svg
            .selectAll('circle.legend-mark')
            .data(this.settings.colors())
            .enter()
            .append('circle')
            .classed('legend-mark', true)
            .attr('cx', function (d, i) {
                return (
                    i * (legendDimensions[0] / _this.settings.colors().length) +
                    legendDimensions[0] / _this.settings.colors().length / 2
                );
            })
            .attr('cy', legendDimensions[1] / 4)
            .attr('r', function (d, i) {
                return i + _this.settings.minRadius;
            })
            .attr('fill', '#aaa')
            .attr('fill-opacity', 0.5)
            .attr('stroke', '#aaa')
            .attr('stroke-opacity', 1);
        return marks;
    }

    function both(svg, legendDimensions) {
        var _this = this;

        var marks = svg
            .selectAll('circle.legend-mark')
            .data(this.settings.colors())
            .enter()
            .append('circle')
            .classed('legend-mark', true)
            .attr('cx', function (d, i) {
                return (
                    i * (legendDimensions[0] / _this.settings.colors().length) +
                    legendDimensions[0] / _this.settings.colors().length / 2
                );
            })
            .attr('cy', legendDimensions[1] / 4)
            .attr('r', function (d, i) {
                return i + _this.settings.minRadius;
            })
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

    var makeLegendMarks = {
        color: color$1,
        size: size,
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
            .classed('fdg-legend__label', true) //.style('width', legendDimensions[0] + 'px')
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

    //import size from './addLegends/size';
    //import both from './addLegends/both';

    function addLegends() {
        this.legends = {
            container: this.containers.legends,
        };
        this.legends.color = makeLegend.call(this, 'color');
        this.legends.size = makeLegend.call(this, 'size');
        this.legends.both = makeLegend.call(this, 'both');
    }

    function addFreqTable() {
        var freqTable = {
            container: this.containers.freqTable,
        };
        freqTable.table = freqTable.container.append('table');
        freqTable.thead = freqTable.table.append('thead');
        freqTable.th = freqTable.thead
            .append('th')
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
                return d;
            });
        return freqTable;
    }

    function addOrbits() {
        // TODO: replace instances of svg with svgForeground
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
        if (this.settings.translate)
            orbits.attr(
                'transform',
                'translate(-'
                    .concat(this.settings.width / 2 - 100, ',-')
                    .concat(this.settings.height / 2 - 100, ')')
            );
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
            .classed('fdg-focus-annotation', true);
        if (this.settings.translate)
            fociLabels.attr(
                'transform',
                'translate(-'
                    .concat(this.settings.width / 2 - 100, ',-')
                    .concat(this.settings.height / 2 - 100, ')')
            ); // defs - give the text a background
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

        var textBackground = fociLabels
            .append('text')
            .classed('fdg-focus-annotation__text', true)
            .attr('x', function (d) {
                return getX(d);
            })
            .attr('y', function (d) {
                return getY(d);
            }); //.attr('filter', d => `url(#fdg-focus-annotation__${d.value.toLowerCase().replace(/ /g, '-')})`);

        textBackground
            .append('tspan')
            .classed('fdg-focus-annotation__label', true)
            .attr('x', function (d) {
                return getX(d);
            })
            .attr('text-anchor', function (d) {
                return getTextAnchor(d);
            }) //.attr('alignment-baseline', d => getAlignmentBaseline(d))
            .style('font-weight', 'bold')
            .style('font-size', '20px')
            .attr('stroke', 'white')
            .attr('stroke-width', '4px')
            .text(function (d) {
                return d.value;
            });
        textBackground
            .append('tspan')
            .classed('fdg-focus-annotation__event-count', true)
            .classed('fdg-hidden', this.settings.eventCount === false)
            .attr('x', function (d) {
                return getX(d);
            })
            .attr('text-anchor', function (d) {
                return getTextAnchor(d);
            }) //.attr('alignment-baseline', d => getAlignmentBaseline(d))
            .attr('dy', '1.3em')
            .style('font-weight', 'bold')
            .attr('stroke', 'white')
            .attr('stroke-width', '4px'); //.text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);

        var textForeground = fociLabels
            .append('text')
            .classed('fdg-focus-annotation__text', true)
            .attr('x', function (d) {
                return getX(d);
            })
            .attr('y', function (d) {
                return getY(d);
            }); //.attr('filter', d => `url(#fdg-focus-annotation__${d.value.toLowerCase().replace(/ /g, '-')})`);

        textForeground
            .append('tspan')
            .classed('fdg-focus-annotation__label', true)
            .attr('x', function (d) {
                return getX(d);
            })
            .attr('text-anchor', function (d) {
                return getTextAnchor(d);
            }) //.attr('alignment-baseline', d => getAlignmentBaseline(d))
            .style('font-weight', 'bold')
            .style('font-size', '20px')
            .attr('fill', 'black')
            .text(function (d) {
                return d.value;
            });
        textForeground
            .append('tspan')
            .classed('fdg-focus-annotation__event-count', true)
            .classed('fdg-hidden', this.settings.eventCount === false)
            .attr('x', function (d) {
                return getX(d);
            })
            .attr('text-anchor', function (d) {
                return getTextAnchor(d);
            }) //.attr('alignment-baseline', d => getAlignmentBaseline(d))
            .attr('dy', '1.3em')
            .style('font-weight', 'bold')
            .attr('fill', 'black'); //.text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);

        return fociLabels;
    }

    //import addExplanation from './layout/addExplanation';
    function dataDrivenLayout() {
        // controls
        addControls.call(this); // sidebar

        this.containers.timer.text(
            ''.concat(this.settings.timepoint, ' ').concat(this.settings.timeUnit)
        );
        addLegends.call(this);
        this.freqTable = addFreqTable.call(this); // Draw concentric circles.

        this.orbits = addOrbits.call(this); // Annotate foci.

        this.focusAnnotations = annotateFoci.call(this);
        this.containers.slider.attr('max', this.settings.duration);
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
                }); // Initial state for the given individual.

                var state = getState.call(_this, group, 0);
                var noStateChange =
                    group.length === 1 && state.event === _this.settings.eventCentral; // Count state changes.

                var nStateChanges = countStateChanges.call(_this, group); // Define radius.

                var r = defineRadius.call(_this, nStateChanges); // Define color.

                var color = defineColor.call(_this, nStateChanges);
                return _objectSpread2(
                    {
                        group: group,
                        // array of data representing all records for an individual
                        duration: d3.sum(group, function (d) {
                            return d.duration;
                        }),
                        // full duration of individual in data
                        state: state,
                        // object representing a single record of an individual
                        noStateChange: noStateChange,
                        // boolean - did individual have any events? used to present those individuals in a static force layout
                        nStateChanges: nStateChanges,
                        // number of state changes the indivdual has experienceda thus far
                        r: r,
                    },
                    color
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

    function tick(event) {
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

    function addForceSimulation(event) {
        // When using D3’s force layout with a disjoint graph, you typically want the positioning
        // forces (d3.forceX and d3.forceY) instead of the centering force (d3.forceCenter). The
        // positioning forces, unlike the centering force, prevent detached subgraphs from escaping
        // the viewport.
        //
        // https://observablehq.com/@d3/disjoint-force-directed-graph?collection=@d3/d3-force
        var forceSimulation = d3
            .forceSimulation()
            .nodes(event.data)
            .alphaDecay(0.01) //.alphaMin(.75)
            //.alphaTarget(.8)
            .velocityDecay(0.9)
            .force(
                'center',
                d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2)
            )
            .force('x', d3.forceX(event.x).strength(0.3))
            .force('y', d3.forceY(event.y).strength(0.3))
            .force('charge', d3.forceManyBodyReuse().strength(-(2000 / this.metadata.id.length))) //.force('charge', d3.forceManyBodySampled().strength(-(2000 / this.metadata.id.length)))
            .on('tick', tick.bind(this, event)); //if (event.value !== this.settings.eventCentral)

        forceSimulation.force(
            'collide', //d3.forceCollide().radius((d) => d.value.r + 0.5)
            d3.forceCollide().radius(this.settings.minRadius + 0.5)
        ); //forceSimulation.force('collide', d3.forceCollide().radius(this.settings.minRadius + 0.5));

        return forceSimulation;
    }

    function circular(data) {
        var simulation = d3
            .forceSimulation()
            .nodes(data)
            .force(
                'center',
                d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2)
            )
            .force('x', d3.forceX(this.settings.orbitRadius / 2).strength(0.3))
            .force('y', d3.forceY(this.settings.height / 2).strength(0.3))
            .force('charge', d3.forceManyBodyReuse().strength(-(2000 / data.length)))
            .force('collide', d3.forceCollide().radius(this.settings.minRadius + 0.5))
            .stop();

        for (var i = 0; i < 300; i++) {
            simulation.tick();
        }

        var g = this.containers.svgBackground.insert('g', ':first-child'); //.attr('transform', `translate(${this.settings.orbitRadius/2},${this.settings.height/2})`);

        g.append('text')
            .attr('x', 0)
            .attr('y', -this.settings.orbitRadius / 2)
            .attr('dy', -36)
            .attr('text-anchor', 'middle')
            .text('No state changes');
        g.append('text')
            .attr('x', 0)
            .attr('y', -this.settings.orbitRadius / 2)
            .attr('dy', -16)
            .attr('text-anchor', 'middle')
            .text(
                ''
                    .concat(data.length, ' (')
                    .concat(d3.format('.1%')(data.length / this.data.nested.length), ')')
            );
        var nodes = g
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })
            .attr('r', this.settings.minRadius)
            .attr('fill', this.settings.color(0));
    }

    function addStaticForceSimulation() {
        var noStateChange = this.data.nested
            .filter(function (d) {
                return d.value.noStateChange;
            })
            .map(function (d) {
                return {
                    key: d.key,
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
            util: util,
        };
        fdg.settings.text = []
            .concat(fdg.settings.explanation)
            .concat(fdg.settings.information)
            .filter(function (text) {
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
});
