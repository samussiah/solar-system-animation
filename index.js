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
      reset: null,
      // defined in ../defineMetadata/dataDrivenSettings
      timeFrame: null,
      // event settings
      events: null,
      // defined in ../defineMetadata
      eventCentral: null,
      // defined in ../defineMetadata/dataDrivenSettings
      eventCount: true,
      // display count (percentage) beneath focus labels?
      eventChangeCount: null,
      // defined in ../defineMetadata/dataDrivenSettings
      eventChangeCountAesthetic: 'color',
      // animation settings
      speed: 'slow',
      speeds: {
        slow: 1000,
        medium: 200,
        fast: 50
      },
      playPause: 'play',
      // dimensions
      width: 800,
      height: 800,
      padding: 1,
      nOrbits: null,
      // defined in ../defineMetadata/dataDrivenSettings/orbits
      nFoci: null,
      // defined in ../defineMetadata/dataDrivenSettings/event
      // color and size settings
      colors: colors,
      colorScale: colorScale,
      color: color,
      minRadius: null,
      // defined in ../defineMetadata/dataDrivenSettings
      maxRadius: null,
      // defined in ../defineMetadata/dataDrivenSettings
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
          prevCount: 0
        };
      }).entries(this.data); // Calculate coordinates of event focus.

      var centerX = this.settings.width / 2;
      var centerY = this.settings.height / 2;
      var theta = 2 * Math.PI / (nest.length - 1);
      nest.forEach(function (event, i) {
        Object.assign(event, event.value);
        event.value = event.key;
        delete event.key;
        event.x = event.order === 0 ? centerX : (event.order * 100 + 50) * Math.cos(i * theta) + centerX;
        event.y = event.order === 0 ? centerY : (event.order * 100 + 50) * Math.sin(i * theta) + centerY;
      }); // Ensure events plot in order.

      nest.sort(function (a, b) {
        return a.order - b.order;
      });
      return nest;
    }

    function orbits(event) {
      var _this = this;

      var nest = d3.nest().key(function (d) {
        return d.order;
      }).entries(event.filter(function (event) {
        return event.value !== _this.settings.eventCentral;
      })).map(function (d, i) {
        d.cx = _this.settings.width / 2;
        d.cy = _this.settings.height / 2;
        d.r = (i + 1) * 100 + 50;
        return d;
      });
      return nest;
    }

    function defineMetadata() {
      // Define sets.
      var metadata = {}; // Add additional metadata to ID set.

      metadata.id = id.call(this); // Settings dependent on the ID set.

      this.settings.minRadius = this.settings.minRadius || 3; //Math.min(3000 / metadata.id.length, 3);

      this.settings.maxRadius = this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
      this.settings.reset = this.settings.reset || d3.max(metadata.id, function (id) {
        return id.duration;
      }); // Add additional metadata to event set.

      metadata.event = event.call(this); // Update settings that depend on event set.

      this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].value;
      this.settings.nFoci = this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral; // number of event types minus one

      this.settings.eventChangeCount = this.settings.eventChangeCount || metadata.event.slice(1).map(function (event) {
        return event.value;
      }); // Define orbits.

      metadata.orbit = orbits.call(this, metadata.event);
      return metadata;
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
        inputs.classed('current', function (di) {
          return di.label === d.label;
        });
        fdg.settings.speed = d.label;
      });
      return {
        container: container,
        inputs: inputs
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
        var curr_moves = d.value.moves; // Time to go to next activity

        if (d.value.nextStateChange === _this.settings.timepoint && _this.settings.timepoint < d.value.duration) {
          curr_moves += 1; // Update individual to next event.

          d.value.state = d.value.sched[curr_moves];
          var nextEvent = d.value.state.event;
          var eventIndividual = d.value.events.find(function (event) {
            return event.value === nextEvent;
          });
          eventIndividual.count += 1; // Update population count at previous and next events.

          _this.metadata.event.find(function (event) {
            return event.value === currEvent;
          }).count -= 1;

          var eventPopulation = _this.metadata.event.find(function (event) {
            return event.value === nextEvent;
          });

          eventPopulation.count += 1;
          d.value.moves = curr_moves;
          d.value.nextStateChange += d.value.sched[d.value.moves].duration;
        } // Add to new activity count


        var stateChanges = d3.sum(d.value.events.filter(function (event) {
          return _this.settings.eventChangeCount.includes(event.value);
        }), function (event) {
          return event.count;
        });
        d.value.r = _this.settings.eventChangeCountAesthetic !== 'color' ? Math.min(_this.settings.minRadius + stateChanges, _this.settings.maxRadius) : _this.settings.minRadius;
        d.value.color = _this.settings.eventChangeCountAesthetic !== 'size' ? _this.settings.color(stateChanges) : '#aaa';
      }); // Record change in number of IDs at each focus at current timepoint.

      this.metadata.event.forEach(function (event) {
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

    function updateText() {
      var _this = this;

      // Update time
      this.timer.text("".concat(this.settings.timepoint, " ").concat(this.settings.timeUnit)); // Update percentages

      if (this.settings.eventCount) this.focusAnnotations.selectAll('tspan.fdg-focus-annotation__event-count').text(function (d) {
        return "".concat(d.count, " (").concat(d3.format('.1%')(d.count / _this.data.nested.length), ")");
      }); // Update notes

      if (this.settings.timepoint === this.settings.notes[this.settings.notesIndex].startTimepoint) {
        this.notes.style('top', '0px').transition().duration(600).style('top', '20px').style('color', '#000000').text(this.settings.notes[this.settings.notesIndex].text);
      } // Make note disappear at the end.
      else if (this.settings.timepoint === this.settings.notes[this.settings.notesIndex].stopTimepoint) {
          this.notes.transition().duration(1000).style('top', '300px').style('color', '#ffffff');
          this.settings.notesIndex += 1;

          if (this.settings.notesIndex === this.settings.notes.length) {
            this.settings.notesIndex = 0;
          }
        }
    }

    function resetAnimation() {
      var _this = this;

      this.settings.timepoint = 0; // Update the event object of the population.

      this.metadata.event.forEach(function (event) {
        event.count = 0;
      });
      this.data.nested.forEach(function (d) {
        // Initial event for the given individual.
        d.value.state = d.value.sched[0]; // Define an event object for the individual.

        d.value.events.forEach(function (event) {
          event.count = 0;
          event.duration = 0;
        });
        d.value.events.find(function (event) {
          return event.value === d.value.state.event;
        }).count += 1;

        var event = _this.metadata.event.find(function (event) {
          return event.value === d.value.state.event;
        });

        event.count += 1;
        var stateChanges = d3.sum(d.value.events.filter(function (event) {
          return _this.settings.eventChangeCount.includes(event.value);
        }), function (event) {
          return event.count;
        });
        d.value.x = event.x + Math.random();
        d.value.y = event.y + Math.random();
        d.value.r = _this.settings.eventChangeCountAesthetic !== 'color' ? Math.min(_this.settings.minRadius + stateChanges, _this.settings.maxRadius) : _this.settings.minRadius;
        d.value.color = _this.settings.eventChangeCountAesthetic !== 'size' ? _this.settings.color(stateChanges) : '#aaa';
        d.value.moves = 0;
        d.value.next_move_time = d.value.state.duration;
      });
    }

    function startInterval() {
      var _this = this;

      var interval = d3.interval(function () {
        // Increment the timepoint.
        _this.settings.timepoint++;

        if (_this.settings.timepoint <= _this.settings.reset) {
          // Update the node data.
          updateData.call(_this); // Accentuate the orbits when an event occurs.

          pulseOrbits.call(_this); // Update timer, focus labels, and annotations.

          updateText.call(_this);
        } else {
          resetAnimation.call(_this);
        } // Resume the force simulation.


        _this.forceSimulation.nodes(_this.data.nested);

        _this.forceSimulation.alpha(1).restart(); //this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);

      }, this.settings.speeds[this.settings.speed]);
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

      if (this.settings.playPause === 'play') {
        if (this.pause_timeout !== undefined) clearTimeout(this.pause_timeout);
        this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
      } else if (this.settings.playPause === 'pause') {
        clearTimeout(this.timeout);
        updateData.call(this);

        var resume_for_a_while = function resume_for_a_while() {
          this.force.alpha(1);
          this.pause_timeout = setTimeout(resume_for_a_while.bind(this), this.settings.speeds[this.settings.speed]);
        };

        this.pause_timeout = setTimeout(resume_for_a_while.bind(this), this.settings.speeds[this.settings.speed]);
      }
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
        if (_this.settings.playPause !== 'pause') toggle.call(_this); // Increment the timepoint.

        _this.settings.timepoint++;

        if (_this.settings.timepoint <= _this.settings.reset) {
          // Update the node data.
          updateData.call(_this); // Accentuate the orbits when an event occurs.

          pulseOrbits.call(_this); // Update timer, focus labels, and annotations.

          updateText.call(_this);
        } else {
          reset.call(_this);
        } // Update radius and fill attributes of circles.


        _this.circles.attr('r', function (d) {
          return d.r;
        }).style('fill', function (d) {
          return d.color;
        }).style('stroke', function (d) {
          return d.color;
        }); // Continue running the simulation, at the current timepoint only.


        var resume_for_a_while = function resume_for_a_while() {
          this.force.alpha(1);
          this.pause_timeout = setTimeout(resume_for_a_while.bind(this), this.settings.speeds[this.settings.speed]);
        };

        _this.pause_timeout = setTimeout(resume_for_a_while.bind(_this), _this.settings.speeds[_this.settings.speed]);
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function reset$1() {
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

        fdg.legends.container.classed('fdg-hidden', fdg.settings.eventChangeCount.length === 0).selectAll('span.fdg-measure').text(fdg.util.csv(fdg.settings.eventChangeCount)); // Recalculate radius and fill/stroke of points.

        fdg.data.nested.forEach(function (d) {
          // Add to new activity count
          var stateChanges = d3.sum(d.events.filter(function (event) {
            return fdg.settings.eventChangeCount.includes(event.value);
          }), function (event) {
            return event.count;
          });
          d.r = fdg.settings.eventChangeCountAesthetic !== 'color' ? Math.min(fdg.settings.minRadius + stateChanges, fdg.settings.maxRadius) : fdg.settings.minRadius;
          d.color = fdg.settings.eventChangeCountAesthetic !== 'size' ? fdg.settings.color(stateChanges) : '#aaa';
        });
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
        }); // Recalculate radius and fill/stroke of points.

        fdg.data.nested.forEach(function (d) {
          // Add to new activity count
          var stateChanges = d3.sum(d.events.filter(function (event) {
            return fdg.settings.eventChangeCount.includes(event.value);
          }), function (event) {
            return event.count;
          });
          d.r = fdg.settings.eventChangeCountAesthetic !== 'color' ? Math.min(fdg.settings.minRadius + stateChanges, fdg.settings.maxRadius) : fdg.settings.minRadius;
          d.color = fdg.settings.eventChangeCountAesthetic !== 'size' ? fdg.settings.color(stateChanges) : '#aaa';
        });
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function addControls() {
      this.controls = {
        container: this.container.append('div').classed('fdg-controls', true)
      };
      this.controls.speed = speed.call(this);
      this.controls.playPause = playPause$1.call(this);
      this.controls.step = step.call(this);
      this.controls.reset = reset$1.call(this);
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
        container: this.container.append('div').classed('fdg-legends', true)
      };
      this.legends.color = makeLegend.call(this, 'color');
      this.legends.size = makeLegend.call(this, 'size');
      this.legends.both = makeLegend.call(this, 'both');
    }

    function addOrbits() {
      var orbits = this.svg.selectAll('circle.orbit').data(this.metadata.orbit).enter().append('circle').classed('orbit', true).attr('cx', function (d) {
        return d.cx;
      }).attr('cy', function (d) {
        return d.cy;
      }).attr('r', function (d) {
        return d.r;
      }).attr('fill', 'none').attr('stroke', '#aaa').attr('stroke-width', '.5');
      return orbits;
    }

    function annotateFoci() {
      var _this = this;
      var fociLabels = this.svg.selectAll('g.fdg-focus-annotation').data(this.metadata.event).join('g').classed('fdg-focus-annotation', true); // defs - give the text a background
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
        return Math.round(d.x) === Math.round(_this.settings.width / 2);
      };

      var isLessThanCenterX = function isLessThanCenterX(d) {
        return Math.round(d.x) < Math.round(_this.settings.width / 2);
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

    function layout() {
      this.container = d3.select(this.element).append('div').classed('force-directed-graph', true).datum(this); // controls

      addControls.call(this); // side panel

      this.timer = this.container.append('div').classed('fdg-timer', true).text("".concat(this.settings.timepoint, " ").concat(this.settings.timeUnit));
      addLegends.call(this);
      this.notes = this.container.append('div').classed('fdg-notes', true); // main panel

      this.container = this.container.append('div').classed('fdg-container', true); // canvas underlay

      this.canvas = this.container.append('canvas').classed('fdg-canvas', true).attr('width', this.settings.width).attr('height', this.settings.height);
      this.context = this.canvas.node().getContext('2d'); // SVG overlay

      this.svg = this.container.append('svg').classed('fdg-svg', true).attr('width', this.settings.width + 200).attr('height', this.settings.height + 200); // Draw concentric circles.

      this.orbits = addOrbits.call(this); // Annotate foci.

      this.focusAnnotations = annotateFoci.call(this);
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

    function nestData() {
      var _this = this;

      var R = this.settings.width / this.metadata.event.length / 2;
      var nestedData = d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (group) {
        // Establish start and end timepoints for each state.
        group.forEach(function (d, i) {
          d.timepoint = i === 0 ? d.duration : d.duration + group[i - 1].timepoint;

          if (i === 0) {
            d.start_timepoint = 1;
            d.end_timepoint = d.duration;
          } else {
            d.start_timepoint = group[i - 1].end_timepoint + 1;
            d.end_timepoint = d.start_timepoint + d.duration;
          }
        }); // Initial state for the given individual.

        var state = group[0]; // Define an event object for the individual.

        var events = _this.metadata.event.map(function (event) {
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

        events.find(function (event) {
          return event.value === state.event;
        }).count += 1; // Update the event object of the population.

        var event = _this.metadata.event.find(function (event) {
          return event.value === state.event;
        });

        event.count += 1;
        var stateChanges = d3.sum(events.filter(function (event) {
          return _this.settings.eventChangeCount.includes(event.label);
        }), function (event) {
          return event.count;
        });
        var theta = Math.random() * 2 * Math.PI;
        var r = Math.sqrt(~~(Math.random() * R * R));
        return {
          state: state,
          events: events,
          stateChanges: stateChanges,
          duration: d3.sum(group, function (d) {
            return d.duration;
          }),
          sx: event.x + r * Math.cos(theta),
          //Math.random()*this.settings.width/this.metadata.event.length * (Math.random() < .5 ? -1 : 1),
          sy: event.y + r * Math.sin(theta),
          //Math.random()*this.settings.height/this.metadata.event.length * (Math.random() < .5 ? -1 : 1),
          tx: event.x,
          ty: event.y,
          r: _this.settings.eventChangeCountAesthetic !== 'color' ? Math.min(_this.settings.minRadius + stateChanges, _this.settings.maxRadius) : _this.settings.minRadius,
          color: _this.settings.eventChangeCountAesthetic !== 'size' ? _this.settings.color(stateChanges) : '#aaa',
          moves: 0,
          nextStateChange: state.duration,
          sched: group
        };
      }).entries(this.data);
      return nestedData;
    }

    function dataManipulation() {
      mutateData.call(this);
      this.data.nested = nestData.call(this);
    }

    function tick() {
      var _this = this;

      this.context.clearRect(0, 0, this.settings.width, this.settings.height);
      this.context.save(); //this.context.translate(this.settings.width/2,this.settings.height/2);

      this.data.nested.sort(function (a, b) {
        return a.value.stateChanges - b.value.stateChanges;
      }) // draw bubbles with more state changes last
      .forEach(function (d, i) {
        _this.context.beginPath(); //this.context.moveTo(d.x + d.r, d.y);


        _this.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);

        _this.context.fillStyle = d.value.color;

        _this.context.fill();
      }); //this.context.fillStyle = '#ddd';
      //this.context.fill();
      //this.context.strokeStyle = '#333';
      //this.context.stroke();

      this.context.restore();
    }

    function addForceSimulation() {
      var _this = this;

      var forceSimulation = d3.forceSimulation().nodes(this.data.nested).alphaDecay(.005) //.alphaTarget(1)
      .velocityDecay(0.9).force('center', d3.forceCenter(this.settings.width / 2, this.settings.height / 2)).force('x', d3.forceX().x(function (d) {
        return _this.metadata.event.find(function (event) {
          return event.value === d.value.state.event;
        }).x;
      }).strength(0.3)) //Math.pow(this.data.nested.length, -.6)))
      .force('y', d3.forceY().y(function (d) {
        return _this.metadata.event.find(function (event) {
          return event.value === d.value.state.event;
        }).y;
      }).strength(0.3)) //Math.pow(this.data.nested.length, -.6)))
      .force('charge', d3.forceManyBodyReuse().strength(-2)) //.force('manyBody', d3.forceManyBody().strength(-1))
      //.force('collide', d3.forceCollide().radius(d => d.value.r).strength(-.5))
      .on('tick', tick.bind(this));
      return forceSimulation;
    }

    function init() {
      this.forceSimulation = addForceSimulation.call(this);
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
      fdg.metadata = defineMetadata.call(fdg); // calculate characteristics of variables in data

      layout.call(fdg); // update the DOM

      dataManipulation.call(fdg); // mutate and structure data

      init.call(fdg); // run the simulation

      return fdg;
    }

    return forceDirectedGraph;

})));
