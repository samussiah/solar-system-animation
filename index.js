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

    function color(n) {
      return colorScale()(Math.min(n, colorScale().domain().length));
    }

    var settings = {
      // time settings
      timepoint: 0,
      timeUnit: 'days since randomization',
      duration: null,
      // defined in ./defineMetadata/dataDrivenSettings
      resetDelay: 5000,
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
      excludeFirst: true,
      excludeLast: true,
      // animation settings
      speed: 'slow',
      speeds: {
        slow: 1000,
        medium: 200,
        fast: 50
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
      // color and size settings
      colors: colors,
      colorScale: colorScale,
      color: color,
      fill: null,
      // defined in ./defineMetadata/dataDrivenSettings
      minRadius: null,
      // defined in ./defineMetadata/dataDrivenSettings
      maxRadius: null,
      // defined in ./defineMetadata/dataDrivenSettings
      // miscellaneous
      notes: [{
        startTimepoint: 1,
        stopTimepoint: 75,
        text: 'Heart disease is the leading cause of death for men, women, and people of most racial and ethnic groups in the United States.'
      }, {
        startTimepoint: 90,
        stopTimepoint: 165,
        text: 'One person dies every 37 seconds in the United States from cardiovascular disease.'
      }, {
        startTimepoint: 180,
        stopTimepoint: 255,
        text: 'About 647,000 Americans die from heart disease each year—that’s 1 in every 4 deaths.'
      }, {
        startTimepoint: 270,
        stopTimepoint: 345,
        text: 'Heart disease costs the United States about $219 billion each year from 2014 to 2015.'
      }, {
        startTimepoint: 360,
        stopTimepoint: 435,
        text: 'This includes the cost of health care services, medicines, and lost productivity due to death.'
      }, {
        startTimepoint: 450,
        stopTimepoint: 525,
        text: 'Coronary heart disease is the most common type of heart disease, killing 365,914 people in 2017.'
      }, {
        startTimepoint: 540,
        stopTimepoint: 615,
        text: 'About 18.2 million adults age 20 and older have CAD (about 6.7%).'
      }, {
        startTimepoint: 630,
        stopTimepoint: 705,
        text: 'About 2 in 10 deaths from CAD happen in adults less than 65 years old.'
      }, {
        startTimepoint: 720,
        stopTimepoint: 795,
        text: 'In the United States, someone has a heart attack every 40 seconds.'
      }, {
        startTimepoint: 810,
        stopTimepoint: 885,
        text: 'Every year, about 805,000 Americans have a heart attack.'
      }, {
        startTimepoint: 900,
        stopTimepoint: 975,
        text: '75% experience their first heart attack'
      }, {
        startTimepoint: 990,
        stopTimepoint: 1065,
        text: '25% have already had a heart attack.'
      }, {
        startTimepoint: 1080,
        stopTimepoint: 1155,
        text: 'About 1 in 5 heart attacks is silent—the damage is done, but the person is not aware of it.'
      }]
    };
    settings.notesIndex = settings.notes.some(function (note) {
      return note.startTimepoint === settings.timepoint;
    }) ? settings.notes.findIndex(function (annotation) {
      return annotation.startTimepoint <= settings.timepoint && settings.timepoint <= annotations.stopTimepoint;
    }) : 0;

    function addElement(name, parent) {
      var tagName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'div';
      var element = parent.append(tagName).classed("fdg-".concat(name), true);
      return element;
    }

    function layout() {
      var main = addElement('main', d3.select(this.element)); // controls on top

      var controls = addElement('controls', main); // sidebar to the left

      var sidebar = addElement('sidebar', main);
      var timing = addElement('timing', sidebar);
      var timer = addElement('timer', timing);
      var duration = addElement('duration', timing).style('height', '8px').style('background', this.settings.colors()[0]);
      var countdown = addElement('countdown', timing).style('height', '22px').style('width', '100%').style('text-align', 'center').selectAll('div').data(d3.range(-1, this.settings.resetDelay / 1000)).join('div').style('width', '100%').style('display', 'inline-block').text(function (d) {
        return "Looping in ".concat(d + 1, " seconds");
      }).classed('fdg-hidden', true);
      var legends = addElement('legends', sidebar);
      var freqTable = addElement('freq-table', sidebar);
      var info = addElement('info', sidebar); // animation to the right

      var animation = addElement('animation', main);
      this.settings.width = animation.node().clientWidth;
      this.settings.height = this.settings.width / 21 * 9;
      var canvas = addElement('canvas', animation, 'canvas').attr('width', this.settings.width).attr('height', this.settings.height);
      canvas.context = canvas.node().getContext('2d');
      var svg = addElement('svg', animation, 'svg').attr('width', this.settings.width).attr('height', this.settings.height);
      sidebar.style('height', "".concat(this.settings.height, "px"));
      return {
        main: main,
        controls: controls,
        sidebar: sidebar,
        timing: timing,
        timer: timer,
        duration: duration,
        countdown: countdown,
        legends: legends,
        freqTable: freqTable,
        info: info,
        animation: animation,
        canvas: canvas,
        svg: svg
      };
    }

    function id() {
      var nest = d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (group) {
        return d3.sum(group, function (d) {
          return +d.duration;
        });
      }).entries(this.data);
      nest.forEach(function (d) {
        d.duration = d.value;
        d.value = d.key;
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
        return {
          order: order,
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
        return i === 0 ? 0 : i === 1 ? -1.75 : i === 2 ? .75 : i === 3 ? -.25 : i === 4 ? .25 : 0;
      };

      metadata.event.forEach(function (event, i) {
        event.x = event.order === 0 ? centerX : event.order * _this.settings.orbitRadius * Math.cos(thetaFactor(i) * theta) + //Math.cos((this.settings.nFoci - i) * theta) +
        centerX;
        event.y = event.order === 0 ? centerY : event.order * _this.settings.orbitRadius * Math.sin(thetaFactor(i) * theta) + //Math.sin((this.settings.nFoci - i) * theta) +
        centerY;
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
      this.settings.minRadius = this.settings.minRadius || 3000 / metadata.id.length;
      this.settings.maxRadius = this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
      this.settings.fill = this.settings.fill || metadata.id.length <= 2500; // Add additional metadata to event set.

      metadata.event = event.call(this); // Update settings that depend on event set.

      this.settings.width = this.settings.width || metadata.event.length;
      this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].value;
      this.settings.eventFinal = this.settings.eventFinal || metadata.event[metadata.event.length - 1].value;
      this.settings.nFoci = this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral; // number of event types minus one

      this.settings.eventChangeCount = this.settings.eventChangeCount || metadata.event.slice(1).map(function (event) {
        return event.value;
      });
      this.settings.eventSequence = metadata.event.filter(function (event, i) {
        return _this.settings.excludeLast ? i !== metadata.event.length - 1 : false;
      }).filter(function (event, i) {
        return _this.settings.excludeFirst ? i !== 0 : false;
      }).map(function (event) {
        return event.value;
      });
      this.settings.R = this.settings.width / metadata.event.length / 2; // Define orbits.

      metadata.orbit = orbit.call(this, metadata.event); // Determine the dimensions of the canvas, the position of the foci, and the size of the orbits.

      coordinates.call(this, metadata);
      return metadata;
    }

    function getState(group, index) {
      return group[index];
    }

    function updateIndividual(events, state, previousState) {
      var event = events.find(function (event) {
        return event.value === state;
      });
      event.count += state === this.settings.eventFinal || previousState === this.settings.eventCentral;
      return event;
    }

    function updateEventCount(events, state) {
      var increment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var event = events.find(function (event) {
        return event.value === state;
      });
      event.count = increment ? event.count + 1 : event.count - 1;
      return event;
    }

    function updateCumulative(events, state, previousState) {
      var event = events.find(function (event) {
        return event.value === state;
      });
      event.cumulative += state === this.settings.eventFinal || previousState === this.settings.eventCentral;
      return event;
    }

    function defineRadius(stateChanges) {
      var r = this.settings.eventChangeCountAesthetic !== 'color' ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius) : this.settings.minRadius;
      return r;
    }

    function defineColor(stateChanges) {
      var color = this.settings.eventChangeCountAesthetic !== 'size' ? this.settings.color(stateChanges) : 'rgb(170,170,170)';
      var fill = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
      var stroke = color.replace('rgb', 'rgba').replace(')', ', 1)');
      return {
        color: color,
        fill: fill,
        stroke: stroke
      };
    }

    function updateData() {
      var _this = this;

      // Record number of IDs at each focus at previous timepoint.
      this.metadata.event.forEach(function (event) {
        event.prevCount = event.count;
      });
      this.data.nested.forEach(function (d) {
        var currEvent = d.value.state.event;
        d.value.currEvent = currEvent;
        d.movesSinceChange++; //if (d.movesSinceChange === 3) {
        //    d.fx = d.x;
        //    d.fy = d.y;
        //}
        // Move individual to next state when timepoint reaches cumulative duration of current state.

        if (d.value.nextStateChange === _this.settings.timepoint && _this.settings.timepoint < d.value.duration) {
          d.value.prevEvent = currEvent;
          d.movesSinceChange = 0; //delete d.fx;
          //delete d.fy;
          // Increment number of moves

          d.value.moves += 1; // Update individual to next event.

          d.value.state = getState.call(_this, d.value.group, d.value.moves); // Update individual event count at current event.

          updateIndividual.call(_this, d.value.events, d.value.state.event, d.value.prevEvent); // Update population count at previous and current events.

          updateEventCount.call(_this, _this.metadata.event, d.value.state.event);
          updateCumulative.call(_this, _this.metadata.event, d.value.state.event, d.value.prevEvent);
          updateEventCount.call(_this, _this.metadata.event, currEvent, false); // Update timepoint of next state change.

          d.value.nextStateChange += d.value.group[d.value.moves].duration;
        } // Add to new activity count


        d.value.stateChanges = d3.sum(d.value.events.filter(function (event) {
          return _this.settings.eventChangeCount.includes(event.value);
        }), function (event) {
          return event.count;
        }); // Define radius.

        d.value.r = defineRadius.call(_this, d.value.stateChanges); // Define color.

        Object.assign(d.value, defineColor.call(_this, d.value.stateChanges));
      }); // Record change in number of IDs at each focus at current timepoint.

      this.metadata.event.forEach(function (event) {
        event.change = event.count - event.prevCount;
        event.data = _this.data.nested.filter(function (d) {
          return d.value.state.event === event.value;
        });
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

    function updateText() {
      var _this = this;

      // Update time
      this.containers.timer.text("".concat(this.settings.timepoint, " ").concat(this.settings.timeUnit)); // Update percentages

      if (this.settings.eventCount) this.focusAnnotations.selectAll('tspan.fdg-focus-annotation__event-count').text(function (d) {
        return "".concat(d.count, " (").concat(d3.format('.1%')(d.count / _this.data.nested.length), ")");
      }); // Update notes

      if (this.settings.timepoint === this.settings.notes[this.settings.notesIndex].startTimepoint) {
        this.containers.info.style('opacity', 0).transition().duration(600).style('opacity', 1).text(this.settings.notes[this.settings.notesIndex].text);
      } // Make note disappear at the end.
      else if (this.settings.timepoint === this.settings.notes[this.settings.notesIndex].stopTimepoint) {
          this.containers.info.transition().duration(1000).style('opacity', 0);
          this.settings.notesIndex += 1;

          if (this.settings.notesIndex === this.settings.notes.length) {
            this.settings.notesIndex = 0;
          }
        }
    }

    // TODO: Pass the previous event to the function to add a condition to determine when to increment or not.
    //
    // The focus count should always update but the individual state changes and the cumulative event
    // count should only increase if previous event is not the central event, don't increment the
    // individual.
    function updateEventCount$1(events, state) {
      var previousState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var increment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var event = events.find(function (event) {
        return event.value === state;
      }); // Increment only if previous state is the central event or if the current state is the final state.
      // Decrement regardless, when an individual leaves a focus.

      event.count = increment ? event.count + (previousState === null || state === this.settings.eventFinal || previousState === this.settings.eventCentral) : event.count - 1; // Increment cumulative only if previous state is the central event or if the current state is the final state.

      if (increment) {
        event.cumulative += this.settings.eventSequence.includes(previousState) === false;
      }

      return event;
    }

    function calculateInitialPointCoordinates(populationEvent) {
      // Define a random angle and a random radius with which to initialize point coordinates.
      var r = Math.sqrt(~~(Math.random() * this.settings.R * this.settings.R));
      var theta = Math.random() * 2 * Math.PI; // Calculate source and destination coordinates.

      var pointCoordinates = {
        sx: populationEvent.x + r * Math.cos(theta),
        sy: populationEvent.y + r * Math.sin(theta),
        tx: populationEvent.x,
        ty: populationEvent.y
      };
      return pointCoordinates;
    }

    function resetAnimation() {
      var _this = this;

      this.settings.timepoint = 0; // Update the event object of the population.

      this.metadata.event.forEach(function (event) {
        event.count = 0;
        event.cumulative = 0;
      });
      this.data.nested.forEach(function (d) {
        // Initial event for the given individual.
        d.value.state = getState.call(_this, d.value.group, 0); // Reset individual event object.

        d.value.events.forEach(function (event) {
          event.count = 0;
          event.duration = 0;
        }); // Update individual event count at initial event.

        updateEventCount$1.call(_this, d.value.events, d.value.state.event); // Reset state index and timepoint of next state change.

        d.value.moves = 0;
        d.value.nextStateChange = d.value.state.duration; // Update population count at previous and current events.

        var populationEvent = updateEventCount$1.call(_this, _this.metadata.event, d.value.state.event);
        var stateChanges = d3.sum(d.value.events.filter(function (event) {
          return _this.settings.eventChangeCount.includes(event.value);
        }), function (event) {
          return event.count;
        }); // Calculate initial point coordinates.

        Object.assign(d.value, calculateInitialPointCoordinates.call(_this, populationEvent)); // Define radius.

        d.value.r = defineRadius.call(_this, stateChanges); // Define color.

        Object.assign(d.value, defineColor.call(_this, stateChanges));
      });
    }

    var increment = function increment(arg) {
      var _this = this;

      // Increment the timepoint.
      this.settings.timepoint += !!arg;
      this.containers.duration.style('width', "".concat(Math.min(this.settings.timepoint / this.settings.duration * 100, 100), "%"));

      if (this.settings.timepoint <= this.settings.duration) {
        // Update the node data.
        updateData.call(this); // Accentuate the orbits when an event occurs.

        pulseOrbits.call(this); // Update timer, focus labels, and annotations.

        updateText.call(this);
      } else {
        this.interval.stop(); // Display a visual countdown to reset.

        var counter = this.settings.resetDelay / 1000 - 1;
        this.containers.countdown.classed('fdg-hidden', function (d) {
          return d !== counter;
        });
        var interval = window.setInterval(function () {
          counter--;

          _this.containers.countdown.classed('fdg-hidden', function (d) {
            return d !== counter;
          });
        }, 1000); // Set a timeout before resetting the animation.

        var timeout = window.setTimeout(function () {
          resetAnimation.call(_this);
          window.clearInterval(interval);
          window.clearTimeout(timeout);

          _this.containers.countdown.classed('fdg-hidden', true);

          _this.interval = startInterval.call(_this);
        }, this.settings.resetDelay);
      } // Update frequency table.


      this.freqTable.tr.selectAll('td').data(function (event) {
        return [event.value, event.cumulative];
      }).join('td').text(function (d) {
        return d;
      }); // Resume the force simulation.

      this.metadata.event.forEach(function (event) {
        // Center points initially then remove centering force.
        if (_this.settings.timepoint === 1) event.forceSimulation.force('center', null);
        event.forceSimulation.nodes(event.data);
        event.forceSimulation.alpha(1).restart();
      });
    };
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
        return "togglebutton ".concat(d.label, " ").concat(d.label === _this.settings.speed ? 'current' : '');
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
      var inputs = container.append('div').classed("togglebutton fdg-input", true).attr('title', "".concat(playPause.find(function (value) {
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
      var inputs = container.append('div').classed("togglebutton fdg-input", true).attr('title', "Advance animation by one time unit.").text('Step');
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

    function reset() {
      var _this = this;

      var container = this.controls.container.append('div').classed('fdg-control fdg-control--reset', true);
      var inputs = container.append('div').classed("togglebutton fdg-input", true).attr('title', "Reset animation.").html('&#x21ba;');
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
        return "togglebutton ".concat(_this.settings.eventChangeCount.includes(d.value) ? 'current' : '');
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

        fdg.legends.container.classed('fdg-hidden', fdg.settings.eventChangeCount.length === 0).selectAll('span.fdg-measure').text(fdg.util.csv(fdg.settings.eventChangeCount));
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
        return "togglebutton ".concat(d, " ").concat(d === _this.settings.eventChangeCountAesthetic ? 'current' : '');
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
      this.controls.reset = reset.call(this);
      this.controls.eventList = eventList.call(this);
      this.controls.colorSizeToggle = colorSizeToggle.call(this);
      this.controls.container.selectAll('.togglebutton').on('mousedown', function () {
        this.classList.toggle('clicked');
      }).on('mouseup', function () {
        this.classList.toggle('clicked');
      });
    }

    function color$1(svg, legendDimensions) {
      var _this = this;

      var marks = svg.selectAll('rect.legend-mark').data(this.settings.colors()).enter().append('rect').classed('legend-mark', true).attr('x', function (d, i) {
        return i * (legendDimensions[0] / _this.settings.colors().length);
      }).attr('y', 0).attr('width', legendDimensions[0] / this.settings.colors().length).attr('height', legendDimensions[1] / 2).attr('fill', function (d) {
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

      var label = container.append('div').classed('fdg-legend__label', true).style('width', legendDimensions[0] + 'px').html("Number of <span class = \"fdg-measure\">".concat(this.util.csv(this.settings.eventChangeCount), "</span> events")); // svg

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

    //import size from './addLegends/size';
    //import both from './addLegends/both';

    function addLegends() {
      this.legends = {
        container: this.containers.legends
      };
      this.legends.color = makeLegend.call(this, 'color');
      this.legends.size = makeLegend.call(this, 'size');
      this.legends.both = makeLegend.call(this, 'both');
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
        return d;
      });
      return freqTable;
    }

    function addOrbits() {
      var orbits = this.containers.svg.selectAll('circle.orbit').data(this.metadata.orbit).enter().append('circle').classed('orbit', true).attr('cx', function (d) {
        return d.cx;
      }).attr('cy', function (d) {
        return d.cy;
      }).attr('r', function (d) {
        return d.r;
      }).attr('fill', 'none').attr('stroke', '#aaa').attr('stroke-width', '.5');
      if (this.settings.translate) orbits.attr('transform', "translate(-".concat(this.settings.width / 2 - 100, ",-").concat(this.settings.height / 2 - 100, ")"));
      return orbits;
    }

    function annotateFoci() {
      var _this = this;
      var fociLabels = this.containers.svg.selectAll('g.fdg-focus-annotation').data(this.metadata.event).join('g').classed('fdg-focus-annotation', true);
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
      this.containers.duration.attr('title', "Duration of animation: ".concat(this.settings.duration, " ").concat(this.settings.timeUnit));
    }

    function mutateData() {
      var numericId = this.data.every(function (d) {
        return /^-?\d+\.?\d*$/.test(d.id) || /^-?\d*\.?\d+$/.test(d.id);
      });
      this.data.sort(function (a, b) {
        var id_diff = numericId ? +a.id - +b.id : a.id < b.id ? -1 : b.id < a.id ? 1 : 0;
        var seq_diff = a.seq - b.seq;
        return id_diff || seq_diff;
      }).forEach(function (d) {
        d.seq = parseInt(d.seq);
        d.duration = parseFloat(d.duration);
      });
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

    function defineTimepoints(group) {
      group.forEach(function (d, i) {
        d.timepoint = i === 0 ? d.duration : d.duration + group[i - 1].timepoint;

        if (i === 0) {
          d.start_timepoint = 1;
          d.end_timepoint = d.duration;
        } else {
          d.start_timepoint = group[i - 1].end_timepoint + 1;
          d.end_timepoint = d.start_timepoint + d.duration;
        }
      });
    }

    function defineIndividualEvents(group) {
      var events = this.metadata.event.map(function (event) {
        return {
          value: event.value,
          order: event.order,
          count: 0,
          duration: 0,
          totalDuration: d3.sum(group.filter(function (d) {
            return d.event === event.value;
          }), function (d) {
            return d.duration;
          })
        };
      });
      return events;
    }

    function countStateChanges(events) {
      var _this = this;

      var stateChanges = d3.sum(events.filter(function (event) {
        return _this.settings.eventChangeCount.includes(event.label);
      }), function (event) {
        return event.count;
      });
      return stateChanges;
    }

    function nestData() {
      var _this = this;

      var nestedData = d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (group) {
        // Establish start and end timepoints for each state (mutates data array).
        defineTimepoints(group); // Initial state for the given individual.

        var state = getState.call(_this, group, 0); // Define an event object for the individual.

        var individualEvents = defineIndividualEvents.call(_this, group);
        var individualEvent = updateEventCount$1.call(_this, individualEvents, state.event); // Update the event object of the population.

        var populationEvent = updateEventCount$1.call(_this, _this.metadata.event, state.event); // Calculate initial point coordinates.

        var initialPointCoordinates = calculateInitialPointCoordinates.call(_this, populationEvent); // Count state changes

        var stateChanges = countStateChanges.call(_this, individualEvents); // Define radius.

        var r = defineRadius.call(_this, stateChanges); // Define color.

        var color = defineColor.call(_this, stateChanges);

        var datum = _objectSpread2(_objectSpread2({
          state: state,
          x: populationEvent.x,
          y: populationEvent.y,
          events: individualEvents,
          duration: d3.sum(group, function (d) {
            return d.duration;
          }),
          moves: 0,
          nextStateChange: state.duration,
          movesSinceChange: 0,
          group: group,
          // point attributes
          stateChanges: stateChanges
        }, initialPointCoordinates), {}, {
          r: r
        }, color);

        return datum;
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

    function tick() {
      var _this = this;

      this.containers.canvas.context.clearRect(0, 0, this.settings.width, this.settings.height);
      this.containers.canvas.context.save(); //this.context.translate(this.settings.width/2,this.settings.height/2);

      if (this.settings.translate) this.containers.canvas.context.translate(-(this.settings.width / 2 - 100), -(this.settings.height / 2 - 100));
      this.data.nested.sort(function (a, b) {
        return a.value.stateChanges - b.value.stateChanges;
      }) // draw bubbles with more state changes last
      .forEach(function (d, i) {
        _this.containers.canvas.context.beginPath(); //this.context.moveTo(d.x + d.r, d.y);


        _this.containers.canvas.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);

        if (_this.settings.fill) {
          _this.containers.canvas.context.fillStyle = d.value.fill;

          _this.containers.canvas.context.fill();
        }

        _this.containers.canvas.context.strokeStyle = d.value.stroke;

        _this.containers.canvas.context.stroke();
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
      var forceSimulation = d3.forceSimulation().nodes(event.data) //.alphaMin(.1)
      .alphaDecay(0.005).velocityDecay(0.9).force('center', d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2)).force('x', d3.forceX(event.x).strength(0.3)).force('y', d3.forceY(event.y).strength(0.3)).force('charge', d3.forceManyBodyReuse().strength(-(2000 / this.metadata.id.length))).on('tick', tick.bind(this)); //if (event.value !== this.settings.eventCentral)

      forceSimulation.force('collide', d3.forceCollide().radius(function (d) {
        return d.value.r + .5;
      })); //forceSimulation.force('collide', d3.forceCollide().radius(this.settings.minRadius + 0.5));

      return forceSimulation;
    }

    function init() {
      var _this = this;

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
      fdg.containers = layout.call(fdg); // add elements to DOM

      fdg.metadata = defineMetadata.call(fdg); // calculate characteristics of variables in data

      dataDrivenLayout.call(fdg); // update the DOM

      dataManipulation.call(fdg); // mutate and structure data

      init.call(fdg); // run the simulation

      return fdg;
    }

    return forceDirectedGraph;

})));
