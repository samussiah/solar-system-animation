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
      var colorScale = d3.scale.linear().domain(d3.range(colors$1.length)).range(colors$1).clamp(true);
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
      width: 1000,
      height: 800,
      centerCoordinates: {
        x: 380,
        y: 365
      },
      padding: 1,
      // color and size settings
      colors: colors,
      colorScale: colorScale,
      color: color,
      minRadius: null,
      // defined in ../defineMetadata/dataDrivenSettings
      maxRadius: null,
      // defined in ../defineMetadata/dataDrivenSettings
      // miscellaneous
      annotations: [{
        start_minute: 1,
        stop_minute: 75,
        note: 'Heart disease is the leading cause of death for men, women, and people of most racial and ethnic groups in the United States.'
      }, {
        start_minute: 90,
        stop_minute: 165,
        note: 'One person dies every 37 seconds in the United States from cardiovascular disease.'
      }, {
        start_minute: 180,
        stop_minute: 255,
        note: 'About 647,000 Americans die from heart disease each year—that’s 1 in every 4 deaths.'
      }, {
        start_minute: 270,
        stop_minute: 345,
        note: 'Heart disease costs the United States about $219 billion each year from 2014 to 2015.'
      }, {
        start_minute: 360,
        stop_minute: 435,
        note: 'This includes the cost of health care services, medicines, and lost productivity due to death.'
      }, {
        start_minute: 450,
        stop_minute: 525,
        note: 'Coronary heart disease is the most common type of heart disease, killing 365,914 people in 2017.'
      }, {
        start_minute: 540,
        stop_minute: 615,
        note: 'About 18.2 million adults age 20 and older have CAD (about 6.7%).'
      }, {
        start_minute: 630,
        stop_minute: 705,
        note: 'About 2 in 10 deaths from CAD happen in adults less than 65 years old.'
      }, {
        start_minute: 720,
        stop_minute: 795,
        note: 'In the United States, someone has a heart attack every 40 seconds.'
      }, {
        start_minute: 810,
        stop_minute: 885,
        note: 'Every year, about 805,000 Americans have a heart attack.'
      }, {
        start_minute: 900,
        stop_minute: 975,
        note: '75% experience their first heart attack'
      }, {
        start_minute: 990,
        stop_minute: 1065,
        note: '25% have already had a heart attack.'
      }, {
        start_minute: 1080,
        stop_minute: 1155,
        note: 'About 1 in 5 heart attacks is silent—the damage is done, but the person is not aware of it.'
      }]
    };

    function set(variable) {
      var set = Array.from(new Set(this.data.map(function (d) {
        return d[variable];
      }))).map(function (value) {
        return {
          value: value
        };
      });
      return set;
    }

    function id() {
      var _this = this;

      this.metadata.id.forEach(function (id) {
        id.duration = d3.sum(_this.data.filter(function (d) {
          return d.id === id.value;
        }), function (d) {
          return +d.duration;
        });
      });
    }

    function event() {
      var _this = this;

      this.settings.nFoci = this.settings.nFoci || this.metadata.event.length - !!this.settings.eventCentral; // number of event types minus one for

      var theta = 2 * Math.PI / this.settings.nFoci;
      var centerX = this.settings.centerCoordinates.x;
      var centerY = this.settings.centerCoordinates.y;
      this.metadata.event.forEach(function (event, i) {
        event.order = parseInt(_this.data.find(function (d) {
          return d.event === event.value;
        }).event_order);
        event.count = 0;
        event.prevCount = 0;
        event.x = event.order === 0 ? centerX : (event.order * 100 + 50) * Math.cos(i * theta) + centerX;
        event.y = event.order === 0 ? centerY : (event.order * 100 + 50) * Math.sin(i * theta) + centerY;
      }); // Ensure events plot in order.

      this.metadata.event.sort(function (a, b) {
        return a.order - b.order;
      });
    }

    function dataDrivenSettings() {
      this.settings.minRadius = this.settings.minRadius || Math.min(3000 / this.metadata.id.length, 3);
      this.settings.maxRadius = this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
      this.settings.reset = this.settings.reset || d3.max(this.metadata.id, function (id) {
        return id.duration;
      });
      this.settings.eventCentral = this.settings.eventCentral || this.metadata.event[0].value;
      this.settings.eventChangeCount = this.settings.eventChangeCount || this.metadata.event.slice(1).map(function (event) {
        return event.value;
      });
    }

    function defineMetadata() {
      var _this = this;

      // Define sets.
      this.metadata = {
        id: set.call(this, 'id'),
        event: set.call(this, 'event')
      }; // Add additional metadata to ID set.

      id.call(this); // Update settings that depend on data.

      dataDrivenSettings.call(this); // Add additional metadata to event set.

      event.call(this); // Define orbits.

      this.metadata.orbits = d3.nest().key(function (d) {
        return d.order;
      }).entries(this.metadata.event.filter(function (event) {
        return event.value !== _this.settings.eventCentral;
      })).map(function (d, i) {
        d.cx = 380;
        d.cy = 365;
        d.r = (i + 1) * 100 + 50;
        return d;
      });
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
        var currEvent = d.currentEvent.event;
        var curr_moves = d.moves; // Time to go to next activity

        if (d.next_move_time === _this.settings.timepoint && _this.settings.timepoint < d.duration) {
          curr_moves += 1; // Update individual to next event.

          d.currentEvent = d.sched[curr_moves];
          var nextEvent = d.currentEvent.event;
          var eventIndividual = d.events.find(function (event) {
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
          d.moves = curr_moves;
          d.next_move_time += d.sched[d.moves].duration;
        } // Add to new activity count


        var stateChanges = d3.sum(d.events.filter(function (event) {
          return _this.settings.eventChangeCount.includes(event.value);
        }), function (event) {
          return event.count;
        });
        d.r = _this.settings.eventChangeCountAesthetic !== 'color' ? Math.min(_this.settings.minRadius + stateChanges, _this.settings.maxRadius) : _this.settings.minRadius;
        d.color = _this.settings.eventChangeCountAesthetic !== 'size' ? _this.settings.color(stateChanges) : '#aaa';
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

      if (this.settings.eventCount) this.fociLabels.selectAll('tspan.actpct').text(function (d) {
        return "".concat(d.count, " (").concat(d3.format('%')(d.count / _this.data.nested.length), ")");
      }); // Update notes

      if (this.settings.timepoint === this.settings.annotations[this.notes_index].start_minute) {
        this.annotations.style('top', '0px').transition().duration(600).style('top', '20px').style('color', '#000000').text(this.settings.annotations[this.notes_index].note);
      } // Make note disappear at the end.
      else if (this.settings.timepoint === this.settings.annotations[this.notes_index].stop_minute) {
          this.annotations.transition().duration(1000).style('top', '300px').style('color', '#ffffff');
          this.notes_index += 1;

          if (this.notes_index === this.settings.annotations.length) {
            this.notes_index = 0;
          }
        }
    }

    //import addTimer from '../addTimer';
    function reset$1() {
      var _this = this;

      this.settings.timepoint = 0; // Update the event object of the population.

      this.metadata.event.forEach(function (event) {
        event.count = 0;
      });
      this.data.nested.forEach(function (d) {
        // Initial event for the given individual.
        d.currentEvent = d.sched[0]; // Define an event object for the individual.

        d.events.forEach(function (event) {
          event.count = 0;
          event.duration = 0;
        });
        d.events.find(function (event) {
          return event.value === d.currentEvent.event;
        }).count += 1;

        var event = _this.metadata.event.find(function (event) {
          return event.value === d.currentEvent.event;
        });

        event.count += 1;
        var stateChanges = d3.sum(d.events.filter(function (event) {
          return _this.settings.eventChangeCount.includes(event.value);
        }), function (event) {
          return event.count;
        });
        d.x = event.x + Math.random();
        d.y = event.y + Math.random();
        d.r = _this.settings.eventChangeCountAesthetic !== 'color' ? Math.min(_this.settings.minRadius + stateChanges, _this.settings.maxRadius) : _this.settings.minRadius;
        d.color = _this.settings.eventChangeCountAesthetic !== 'size' ? _this.settings.color(stateChanges) : '#aaa';
        d.moves = 0;
        d.next_move_time = d.currentEvent.duration;
      });
    }

    /**
     * Order of operations:
     *
     * 1. Update data for each individual.
     * 2. Resume force simulation.
     * 3. Increment timepoint.
     * 4. Update timer text, percentage annotations, and information annotation.
     * 5. Recursively call addTimer().
     */

    function addTimer() {
      // Increment the timepoint.
      this.settings.timepoint += 1; // Resume the force simulation.

      this.force.resume();

      if (this.settings.timepoint <= this.settings.reset) {
        // Update the node data.
        updateData.call(this); // Accentuate the orbits when an event occurs.

        pulseOrbits.call(this); // Update timer, focus labels, and annotations.

        updateText.call(this);
      } else {
        reset$1.call(this);
      } // Update radius and fill attributes of circles.


      this.circles.attr('r', function (d) {
        return d.r;
      }).style('fill', function (d) {
        return d.color;
      }).style('stroke', function (d) {
        return d.color;
      });
      this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
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
          this.force.resume();
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
        } // Continue running the simulation, at the current timepoint only.


        var resume_for_a_while = function resume_for_a_while() {
          this.force.resume();
          this.pause_timeout = setTimeout(resume_for_a_while.bind(this), this.settings.speeds[this.settings.speed]);
        };

        _this.pause_timeout = setTimeout(resume_for_a_while.bind(_this), _this.settings.speeds[_this.settings.speed]);
      });
      return {
        container: container,
        inputs: inputs
      };
    }

    function reset$2() {
      var _this = this;

      var container = this.controls.container.append('div').classed('fdg-control fdg-control--reset', true);
      var inputs = container.append('div').classed("togglebutton fdg-input", true).attr('title', "Reset animation.").html('&#x21ba;');
      inputs.on('click', function () {
        reset$1.call(_this);
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
      this.controls.reset = reset$2.call(this);
      this.controls.eventList = eventList.call(this);
      this.controls.colorSizeToggle = colorSizeToggle.call(this);
      this.controls.container.selectAll('.togglebutton').on('mousedown', function () {
        this.classList.toggle('clicked');
      }).on('mouseup', function () {
        this.classList.toggle('clicked');
      });
    }

    function addOrbits() {
      // Draw concentric circles.
      var orbits = this.svg.selectAll('circle.orbit').data(this.metadata.orbits).enter().append('circle').classed('orbit', true).attr('cx', function (d) {
        return d.cx;
      }).attr('cy', function (d) {
        return d.cy;
      }).attr('r', function (d) {
        return d.r;
      }).attr('fill', 'none').attr('stroke', '#aaa').attr('stroke-width', '.5'); // Annotate concentric circles.
      //this.svg
      //    .selectAll('text.orbit')
      //    .data(
      //        this.settings.metadata.event.slice(1).map((d, i) => {
      //            return { cx: 380, cy: 365, r: (i + 1) * 100 + 50 };
      //        })
      //    )
      //    .enter()
      //    .append('text')
      //    .classed('orbit', true)
      //    .attr('x', d => d.cx)
      //    .attr('y', d => d.cy - d.r)
      //    .text('asdf')

      return orbits;
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

    function layout() {
      this.container = d3.select(this.element).append('div').classed('force-directed-graph', true).datum(this); // controls

      addControls.call(this); // side panel

      this.timer = this.container.append('div').classed('fdg-timer', true).text("".concat(this.settings.timepoint, " ").concat(this.settings.timeUnit));
      addLegends.call(this);
      this.annotations = this.container.append('div').classed('fdg-annotations', true); // main panel

      this.canvas = this.container.append('div').classed('fdg-canvas', true);
      this.svg = this.canvas.append('svg').classed('fdg-svg', true).attr('width', this.settings.width).attr('height', this.settings.height);
      this.orbits = addOrbits.call(this);
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

      var nestedData = d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (nest) {
        nest.forEach(function (d, i) {
          d.timepoint = i === 0 ? d.duration : d.duration + nest[i - 1].timepoint;

          if (i === 0) {
            d.start_timepoint = 1;
            d.end_timepoint = d.duration;
          } else {
            d.start_timepoint = nest[i - 1].end_timepoint + 1;
            d.end_timepoint = d.start_timepoint + d.duration;
          }
        }); // Initial event for the given individual.

        var currentEvent = nest[0]; // Define an event object for the individual.

        var events = _this.metadata.event.map(function (event) {
          return {
            value: event.value,
            order: event.order,
            count: 0,
            duration: 0,
            totalDuration: d3.sum(nest.filter(function (d) {
              return d.event === event.value;
            }), function (d) {
              return d.duration;
            })
          };
        });

        events.find(function (event) {
          return event.value === currentEvent.event;
        }).count += 1; // Update the event object of the population.

        var event = _this.metadata.event.find(function (event) {
          return event.value === currentEvent.event;
        });

        event.count += 1;
        var stateChanges = d3.sum(events.filter(function (event) {
          return _this.settings.eventChangeCount.includes(event.label);
        }), function (event) {
          return event.count;
        });
        return {
          currentEvent: currentEvent,
          events: events,
          duration: d3.sum(nest, function (d) {
            return d.duration;
          }),
          x: event.x + Math.random(),
          y: event.y + Math.random(),
          r: _this.settings.eventChangeCountAesthetic !== 'color' ? Math.min(_this.settings.minRadius + stateChanges, _this.settings.maxRadius) : _this.settings.minRadius,
          color: _this.settings.eventChangeCountAesthetic !== 'size' ? _this.settings.color(stateChanges) : '#aaa',
          moves: 0,
          next_move_time: currentEvent.duration,
          sched: nest
        };
      }).entries(this.data).map(function (d) {
        return Object.assign(d, d.values);
      });
      return nestedData;
    }

    function dataManipulation() {
      mutateData.call(this);
      this.data.nested = nestData.call(this);
    }

    function collide(alpha) {
      var fdg = this; // Resolve collisions between nodes.

      var quadtree = d3.geom.quadtree(this.data.nested);
      return function (d) {
        // position of current node
        var r = fdg.settings.eventChangeCountAesthetic !== 'color' ? d.r + fdg.settings.maxRadius + fdg.settings.padding : d.r + fdg.settings.minRadius + fdg.settings.padding; // dimensions of current node expressed as the coordinates of the corners of a square

        var nx1 = d.x - r;
        var nx2 = d.x + r;
        var ny1 = d.y - r;
        var ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
          // position and dimensions of other nodes in quad tree
          if (quad.point && quad.point !== d) {
            var xDiff = d.x - quad.point.x; // difference in x coordinate between current node and nearby node (horizontal difference)

            var yDiff = d.y - quad.point.y; // difference in y coordinate between current node and nearby node (vertical difference)

            var distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff); // Euclidean distance between current node and nearby node (absolute difference)
            // minimum distance allowed between current node and nearby node in the quadtree:
            // radius of current node + radius of nearby node + (padding if nodes are at the same focus)

            var minDistance = d.r + quad.point.r + (d.currentEvent.event !== quad.point.currentEvent.event) * fdg.settings.padding; // If the Euclidean distance is less than the minimum distance allowed:

            if (distance < minDistance) {
              // update Euclidean distance
              distance = (distance - minDistance) / distance * alpha; // update horizontal difference (xDiff *= distance)
              // subtract updated horizontal difference from current node

              d.x -= xDiff *= distance; // update vertical difference (yDiff *= distance)
              // subtract updated vertical difference from current node

              d.y -= yDiff *= distance; // add updated horizontal and vertical difference to nearby node

              quad.point.x += xDiff;
              quad.point.y += yDiff;
            }
          }

          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }

    function tick(e) {
      var _this = this;

      // k controls the speed at which the nodes reach the appropriate focus
      var k = 0.04 * e.alpha;
      if (this.ticks !== undefined) this.ticks++; // Push nodes toward their designated focus.

      this.data.nested.forEach(function (d, i) {
        // Find the datum of the destination focus.
        var currentEvent = _this.metadata.event.find(function (event) {
          return event.value === d.currentEvent.event;
        }); // Take the point's current coordinates and add to it the difference between the coordinates of the
        // destination focus and the coordinates of the point, multiplied by some tiny fraction.


        d.x += (currentEvent.x - d.x) * k;
        d.y += (currentEvent.y - d.y) * k;
      }); // Update the coordinates, radius, fill, and stroke of the each node.

      this.circles.each(collide.call(this, 0.2)).attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      });
    }

    function addForceLayout() {
      var force = d3.layout.force().nodes(this.data.nested) // default: []
      // .links([]) default: []
      .size([this.settings.width, this.settings.height]) //.linkStrength(0.1) // default: 0.1
      .friction(0.9) // default: 0.9
      //.linkDistance(20) // default: 20
      //.charge(-(250/this.data.nested.length)) // default: -30
      .charge(0).gravity(0) // default: 0.1
      //.theta(0.8) // default: 0.8
      //.alpha(0.1) // default: 0.1
      .on('tick', tick.bind(this)).start();
      return force;
    }

    function addCircles() {
      var circles = this.svg.selectAll('circle.fdg-bubble').data(this.data.nested).enter().append('circle').classed('fdg-bubble', true).attr('r', function (d) {
        return d.r;
      }).style('fill', function (d) {
        return d.color;
      }).style('fill-opacity', 0.5).style('stroke', function (d) {
        return d.color;
      }).style('stroke-opacity', 1);
      return circles;
    }

    function addFociLabels() {
      var _this = this;

      var text = this.svg.selectAll('text.actlabel').data(this.metadata.event).enter().append('text').attr('class', 'actlabel').attr('x', function (d) {
        return d.x;
      }).attr('y', function (d) {
        return d.y + 35;
      });
      var label = text.append('tspan').attr('x', function (d) {
        return d.x;
      }).attr('text-anchor', 'middle').style('font-weight', 'bold').style('font-size', '20px').text(function (d) {
        return d.value;
      });
      var pct = text.append('tspan').classed('actpct', true).classed('fdg-hidden', this.settings.eventCount === false).attr('x', function (d) {
        return d.x;
      }).attr('text-anchor', 'middle').attr('dy', '1.3em').style('font-weight', 'bold').text(function (d) {
        return "".concat(d.count, " (").concat(d3.format('%')(d.count / _this.data.nested.length), ")");
      });
      return text;
    }

    function init() {
      this.force = addForceLayout.call(this);
      this.circles = addCircles.call(this);
      this.fociLabels = addFociLabels.call(this);
      this.notes_index = 0;
      if (this.settings.playPause === 'play') this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
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
      defineMetadata.call(fdg); // calculate characteristics of variables in data

      layout.call(fdg); // update the DOM

      dataManipulation.call(fdg); // mutate and structure data

      init.call(fdg); // run the simulation

      d3.range(10).forEach(function (i) {
        return console.log(fdg.settings.color(i));
      });
      console.log(fdg.settings.colorScale().domain());
      console.log(fdg.settings.colorScale().range());
      return fdg;
    }

    return forceDirectedGraph;

})));
