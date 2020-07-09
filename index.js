(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global = global || self), (global.forceDirectedGraph = factory()));
})(this, function () {
    'use strict';

    function color(eventTypeIndex) {
        var eventColors = {
            '0': '#e0d400',
            '1': '#1c8af9',
            '2': '#51BC05',
            '3': '#FF7F00',
            '4': '#DB32A4',
            '5': '#00CDF8',
            '6': '#E63B60',
            '7': '#8E5649',
            '8': '#68c99e',
            '9': '#a477c8',
            '10': '#5C76EC',
            '11': '#E773C3',
            '12': '#799fd2',
            '13': '#038a6c',
            '14': '#cc87fa',
            '15': '#ee8e76',
            '16': '#bbbbbb',
        };
        return eventColors[eventTypeIndex];
    }

    function colorScale(n) {
        var colors = [
            '#a50026', //'#d73027',
            '#f46d43', //'#fdae61',
            '#fee08b', //'#ffffbf',
            '#d9ef8b', //'#a6d96a',
            '#66bd63', //'#1a9850',
            '#006837',
        ].reverse();
        var colorScale = d3.scale.linear().domain(d3.range(colors.length)).range(colors);
        return colorScale(Math.min(n, colors.length));
    }

    var settings = {
        speed: 'slow',
        speeds: {
            slow: 1000,
            medium: 200,
            fast: 50,
        },
        centerEventType: 'Home',
        centerCoordinates: {
            x: 380,
            y: 365,
        },
        timepoint: 0,
        timeFrame: null,
        width: 780,
        height: 800,
        padding: 1,
        maxRadius: 3,
        color: color,
        colorScale: colorScale,
        eventTypes: null,
        // data-driven by default
        annotations: [
            {
                start_minute: 1,
                stop_minute: 75,
                note:
                    'Heart disease is the leading cause of death for men, women, and people of most racial and ethnic groups in the United States.',
            },
            {
                start_minute: 90,
                stop_minute: 165,
                note:
                    'One person dies every 37 seconds in the United States from cardiovascular disease.',
            },
            {
                start_minute: 180,
                stop_minute: 255,
                note:
                    'About 647,000 Americans die from heart disease each year—that’s 1 in every 4 deaths.',
            },
            {
                start_minute: 270,
                stop_minute: 345,
                note:
                    'Heart disease costs the United States about $219 billion each year from 2014 to 2015.',
            },
            {
                start_minute: 360,
                stop_minute: 435,
                note:
                    'This includes the cost of health care services, medicines, and lost productivity due to death.',
            },
            {
                start_minute: 450,
                stop_minute: 525,
                note:
                    'Coronary heart disease is the most common type of heart disease, killing 365,914 people in 2017.',
            },
            {
                start_minute: 540,
                stop_minute: 615,
                note: 'About 18.2 million adults age 20 and older have CAD (about 6.7%).',
            },
            {
                start_minute: 630,
                stop_minute: 705,
                note: 'About 2 in 10 deaths from CAD happen in adults less than 65 years old.',
            },
            {
                start_minute: 720,
                stop_minute: 795,
                note: 'In the United States, someone has a heart attack every 40 seconds.',
            },
            {
                start_minute: 810,
                stop_minute: 885,
                note: 'Every year, about 805,000 Americans have a heart attack.',
            },
            {
                start_minute: 900,
                stop_minute: 975,
                note: '75% experience their first heart attack',
            },
            {
                start_minute: 990,
                stop_minute: 1065,
                note: '25% have already had a heart attack.',
            },
            {
                start_minute: 1080,
                stop_minute: 1155,
                note:
                    'About 1 in 5 heart attacks is silent—the damage is done, but the person is not aware of it.',
            },
        ],
    };

    function addSpeedControl() {
        var _this = this;

        var fdg = this;
        var container = this.controls.append('div').classed('fdg-controls__speed', true);
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
                return 'togglebutton '
                    .concat(d.label, ' ')
                    .concat(d.label === _this.settings.speed ? 'current' : '');
            })
            .text(function (d) {
                return d.label;
            });
        inputs.on('click', function (d) {
            inputs.classed('current', function (di) {
                return di.label === d.label;
            });
            fdg.settings.speed = d.label;
        });
        return {
            container: container,
            inputs: inputs,
        };
    }

    function layout() {
        this.container = d3
            .select(this.element)
            .append('div')
            .classed('force-directed-graph', true)
            .datum(this);
        this.controls = this.container.append('div').classed('fdg-controls', true);
        addSpeedControl.call(this);
        this.timer = this.container.append('div').classed('fdg-timer', true);
        this.annotations = this.container.append('div').classed('fdg-annotations', true);
        this.canvas = this.container.append('div').classed('fdg-canvas', true);
        this.svg = this.canvas
            .append('svg')
            .classed('fdg-svg', true)
            .attr('width', this.settings.width)
            .attr('height', this.settings.height);
    }

    function defineEventTypes() {
        var eventTypes = Array.from(
            new Set(
                this.data.map(function (d) {
                    return d.event_order + ':|:' + d.event;
                })
            )
        )
            .map(function (eventType) {
                var split = eventType.split(':|:');
                return {
                    order: parseInt(split[0]),
                    label: split[1],
                    count: 0,
                };
            })
            .sort(function (a, b) {
                return a.order - b.order ? a.order - b.order : a.label < b.label ? -1 : 1;
            }); // Define coordinates of foci.
        // TODO: make the coordinates a little less hard-coded, particularly the + 380 and + 365 bits

        var theta = (2 * Math.PI) / (eventTypes.length - 1);
        var centerX = this.settings.centerCoordinates.x;
        var centerY = this.settings.centerCoordinates.y;
        eventTypes.forEach(function (eventType, i) {
            eventType.x = i === 0 ? centerX : (i * 100 + 50) * Math.cos(i * theta) + centerX;
            eventType.y = i === 0 ? centerY : (i * 100 + 50) * Math.sin(i * theta) + centerY;
        });
        console.table(eventTypes);
        return eventTypes;
    }

    function nestData() {
        var _this = this;

        var nestedData = d3
            .nest()
            .key(function (d) {
                return d.id;
            })
            .rollup(function (d) {
                // Initial event for the given individual.
                var currentEvent = d[0]; // Define an event object for the individual.

                var eventTypes = _this.eventTypes.map(function (eventType) {
                    return {
                        label: eventType.label,
                        order: eventType.order,
                        count: 0,
                        duration: 0,
                        totalDuration: d3.sum(
                            d.filter(function (di) {
                                return di.event === eventType.label;
                            }),
                            function (di) {
                                return di.duration;
                            }
                        ),
                    };
                });

                eventTypes.find(function (eventType) {
                    return eventType.label === currentEvent.event;
                }).count += 1; // Update the event object of the population.

                var eventType = _this.eventTypes.find(function (eventType) {
                    return eventType.label === currentEvent.event;
                });

                eventType.count += 1;
                var stateChanges = d3.sum(
                    eventTypes.filter(function (eventType) {
                        return eventType.label !== _this.settings.centerEventType;
                    }),
                    function (eventType) {
                        return eventType.count;
                    }
                );
                return {
                    currentEvent: currentEvent,
                    eventTypes: eventTypes,
                    x: eventType.x + Math.random(),
                    y: eventType.y + Math.random(),
                    r: 2 + stateChanges,
                    color: _this.settings.colorScale(stateChanges),
                    moves: 0,
                    next_move_time: currentEvent.duration,
                    sched: d,
                };
            })
            .entries(this.data)
            .map(function (d) {
                return Object.assign(d, d.values);
            });
        return nestedData;
    }

    function dataManipulation() {
        this.data.forEach(function (d) {
            d.duration = parseFloat(d.duration);
        }); // TODO: sort ID alphanumerically - don't assume it's going to be numeric

        this.data.sort(function (a, b) {
            var id_diff = a.id - b.id;
            var seq_diff = a.seq - b.seq;
            return id_diff || seq_diff;
        });
        this.eventTypes = defineEventTypes.call(this);
        this.data.nested = nestData.call(this);
    }

    function addOrbits() {
        console.log(this); // Draw concentric circles.

        var orbits = this.svg
            .selectAll('circle.orbit')
            .data(
                this.eventTypes.slice(1).map(function (d, i) {
                    return {
                        cx: 380,
                        cy: 365,
                        r: (i + 1) * 100 + 50,
                    };
                })
            )
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
            .attr('stroke', 'black')
            .attr('stroke-width', '1'); // Annotate concentric circles.
        //this.svg
        //    .selectAll('text.orbit')
        //    .data(
        //        this.settings.eventTypes.slice(1).map((d, i) => {
        //            return { cx: 380, cy: 365, r: (i + 1) * 100 + 50 };
        //        })
        //    )
        //    .enter()
        //    .append('text')
        //    .classed('orbit', true)
        //    .attr('x', d => d.cx)
        //    .attr('y', d => d.cy - d.r)
        //    .text('asdf')
    }

    function collide(alpha) {
        var fdg = this; // Resolve collisions between nodes.

        var quadtree = d3.geom.quadtree(this.data.nested);
        return function (d) {
            var r = d.r + fdg.settings.maxRadius + fdg.settings.padding;
            var nx1 = d.x - r;
            var nx2 = d.x + r;
            var ny1 = d.y - r;
            var ny2 = d.y + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && quad.point !== d) {
                    var x = d.x - quad.point.x;
                    var y = d.y - quad.point.y;
                    var l = Math.sqrt(x * x + y * y);

                    var _r =
                        d.r +
                        quad.point.r +
                        (d.currentEvent.event !== quad.point.currentEvent.event) *
                            fdg.settings.padding;

                    if (l < _r) {
                        l = ((l - _r) / l) * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }

                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }

    function tick(e) {
        var _this = this;

        var k = 0.04 * e.alpha; // Push nodes toward their designated focus.

        this.data.nested.forEach(function (d, i) {
            var currentEvent = _this.eventTypes.find(function (eventType) {
                return eventType.label === d.currentEvent.event;
            });

            d.x += (currentEvent.x - d.x) * k * 0.5;
            d.y += (currentEvent.y - d.y) * k * 0.5; //d.color = this.settings.colorScale(
            //    d3.sum(d.eventTypes.filter(eventType => eventType.label !== this.settings.centerEventType), eventType => eventType.count)
            //);
        });
        this.circles
            .each(collide.call(this, 0.5))
            .style('fill', function (d) {
                return d.color;
            })
            .style('stroke', function (d) {
                return d.color;
            })
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })
            .attr('r', function (d) {
                return d.r;
            });
    }

    function addForceLayout() {
        var force = d3.layout
            .force()
            .nodes(this.data.nested) // .links([])
            .size([this.settings.width, this.settings.height])
            .gravity(0)
            .charge(0)
            .friction(0.9)
            .on('tick', tick.bind(this))
            .start();
        return force;
    }

    function addCircles() {
        var circles = this.svg
            .selectAll('circle')
            .data(this.data.nested)
            .enter()
            .append('circle')
            .attr('r', function (d) {
                return d.r;
            })
            .style('fill', function (d) {
                return d.color;
            })
            .style('fill-opacity', 0.5)
            .style('stroke', function (d) {
                return d.color;
            })
            .style('stroke-opacity', 1); //.call(force.drag);

        return circles;
    }

    function addFociLabels() {
        var _this = this;

        var text = this.svg
            .selectAll('text.actlabel')
            .data(this.eventTypes)
            .enter()
            .append('text')
            .attr('class', 'actlabel')
            .attr('x', function (d) {
                return d.x;
            })
            .attr('y', function (d) {
                return d.y;
            });
        var label = text
            .append('tspan')
            .attr('x', function (d) {
                return d.x;
            })
            .attr('text-anchor', 'middle')
            .text(function (d) {
                return d.label;
            });
        var pct = text
            .append('tspan')
            .classed('actpct', true)
            .attr('x', function (d) {
                return d.x;
            })
            .attr('text-anchor', 'middle')
            .attr('dy', '1.3em')
            .text(function (d) {
                return d3.format('%')(d.count / _this.data.nested.length);
            });
        return text;
    }

    // Output readable percent based on count.
    // TODO: remove hard-coded denominator
    function readablePercent(n) {
        var pct = (100 * n) / 1000;

        if (pct < 1 && pct > 0) {
            pct = '<1%';
        } else {
            pct = Math.round(pct) + '%';
        }

        return pct;
    }

    // Minutes to time of day. Data is minutes from 4am.
    function minutesToTime(m) {
        var minutes = m % 1440; //var minutes = (m + 4 * 60) % 1440;

        return ''.concat(minutes, ' day').concat(m === 1 ? '' : 's', ' since heart failure'); //return hh + ":" + mm + ampm
    }

    function addTimer() {
        var _this = this;
        this.data.nested.forEach(function (d) {
            var currEvent = d.currentEvent.event;
            var curr_moves = d.moves; // Time to go to next activity

            if (d.next_move_time === _this.settings.timepoint) {
                if (d.moves === d.sched.length - 1) {
                    curr_moves = 0;
                } else {
                    curr_moves += 1;
                } // Update individual to next event.

                d.currentEvent = d.sched[curr_moves];
                var nextEvent = d.currentEvent.event;
                var eventIndividual = d.eventTypes.find(function (eventType) {
                    return eventType.label === nextEvent;
                });
                eventIndividual.count += 1; // Update population count at previous and next events.

                _this.eventTypes.find(function (eventType) {
                    return eventType.label === currEvent;
                }).count -= 1;

                var eventPopulation = _this.eventTypes.find(function (eventType) {
                    return eventType.label === nextEvent;
                });

                eventPopulation.count += 1; // Add to new activity count

                var stateChanges = d3.sum(
                    d.eventTypes.filter(function (eventType) {
                        return eventType.label !== _this.settings.centerEventType;
                    }),
                    function (eventType) {
                        return eventType.count;
                    }
                );
                d.moves = curr_moves;
                d.x = eventPopulation.x;
                d.y = eventPopulation.y;
                d.r = 2 + stateChanges;
                d.color = _this.settings.colorScale(stateChanges);
                d.next_move_time += d.sched[d.moves].duration;
            }
        });
        this.force.resume();
        this.settings.timepoint += 1; // Update percentages

        this.fociLabels.selectAll('tspan.actpct').text(function (d) {
            return readablePercent(d.count);
        }); // Update time

        var true_minute = this.settings.timepoint % 1440;
        this.timer.text(minutesToTime(true_minute)); // Update notes

        if (true_minute === this.settings.annotations[this.notes_index].start_minute) {
            this.annotations
                .style('top', '0px')
                .transition()
                .duration(600)
                .style('top', '20px')
                .style('color', '#000000')
                .text(this.settings.annotations[this.notes_index].note);
        } // Make note disappear at the end.
        else if (true_minute === this.settings.annotations[this.notes_index].stop_minute) {
            this.annotations
                .transition()
                .duration(1000)
                .style('top', '300px')
                .style('color', '#ffffff');
            this.notes_index += 1;

            if (this.notes_index === this.settings.annotations.length) {
                this.notes_index = 0;
            }
        }

        setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
    }

    function init() {
        console.log(this.data.nested);
        console.log(this.data.nested[0]);
        this.force = addForceLayout.call(this);
        this.circles = addCircles.call(this);
        this.fociLabels = addFociLabels.call(this);
        this.notes_index = 0;
        setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
    }

    function forceDirectedGraph(data) {
        var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
        var settings$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var fdg = {
            data: data,
            element: element,
            settings: Object.assign(settings, settings$1),
        };
        layout.call(fdg);
        dataManipulation.call(fdg);
        addOrbits.call(fdg);
        init.call(fdg);
        return fdg;
    }

    return forceDirectedGraph;
});
