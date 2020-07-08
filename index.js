(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.forceDirectedGraph = factory());
}(this, (function () { 'use strict';

    function foci(settings) {
      var foci = settings.eventTypes.reduce(function (foci, eventType, i) {
        if (eventType.desc === settings.centerEventType) {
          foci[eventType.index] = Object.assign({}, settings.centerCoordinates);
        } else {
          var theta = 2 * Math.PI / (settings.eventTypes.length - 1); //foci[eventType.index] = {x: settings.centerCoordinates.x + (i+1)*100, y: settings.centerCoordinates.y};

          foci[eventType.index] = {
            x: (i * 100 + 50) * Math.cos(i * theta) + 380,
            y: (i * 100 + 50) * Math.sin(i * theta) + 365
          };
        }

        return foci;
      }, {});
      return foci;
    }

    function eventCounts(settings) {
      var eventCounts = settings.eventTypes.reduce(function (eventCounts, eventType) {
        eventCounts[eventType.index] = 0;
        return eventCounts;
      }, {});
      return eventCounts;
    }

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
        '16': '#bbbbbb'
      };
      return eventColors[eventTypeIndex];
    }

    function colorScale(n) {
      var colors = ['#a50026', //'#d73027',
      '#f46d43', //'#fdae61',
      '#fee08b', //'#ffffbf',
      '#d9ef8b', //'#a6d96a',
      '#66bd63', //'#1a9850',
      '#006837'].reverse();
      var colorScale = d3.scale.linear().domain(d3.range(colors.length)).range(colors);
      return colorScale(Math.min(n, colors.length));
    }

    var settings = {
      speed: 'slow',
      speeds: {
        slow: 1000,
        medium: 200,
        fast: 50
      },
      centerEventType: 'Home',
      centerCoordinates: {
        x: 380,
        y: 365
      },
      width: 780,
      height: 800,
      padding: 1,
      maxRadius: 3,
      color: color,
      colorScale: colorScale,
      eventTypes: [{
        index: '0',
        "short": 'Home',
        desc: 'Home'
      }, {
        index: '1',
        "short": 'Hosp.',
        desc: 'Hospitalization'
      }, {
        index: '2',
        "short": 'ICU',
        desc: 'Intensive Care Unit'
      }, {
        index: '3',
        "short": 'Death',
        desc: 'Death'
      }],
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
    settings.foci = foci(settings);
    settings.eventCounts = eventCounts(settings);
    d3.range(5).forEach(function (n) {
      console.log(settings.colorScale(n));
    });

    function addSpeedControl() {
      var fdg = this;
      var speedControl = d3.selectAll('.togglebutton').on('click', function () {
        if (d3.select(this).attr('data-val') == 'slow') {
          d3.select('.slow').classed('current', true);
          d3.select('.medium').classed('current', false);
          d3.select('.fast').classed('current', false);
        } else if (d3.select(this).attr('data-val') == 'medium') {
          d3.select('.slow').classed('current', false);
          d3.select('.medium').classed('current', true);
          d3.select('.fast').classed('current', false);
        } else {
          d3.select('.slow').classed('current', false);
          d3.select('.medium').classed('current', false);
          d3.select('.fast').classed('current', true);
        }

        fdg.settings.speed = d3.select(this).attr('data-val');
      });
      return speedControl;
    }

    function addOrbits() {
      // Draw concentric circles.
      this.svg.selectAll('circle.orbit').data(this.settings.eventTypes.slice(1).map(function (d, i) {
        return {
          cx: 380,
          cy: 365,
          r: (i + 1) * 100 + 50
        };
      })).enter().append('circle').classed('orbit', true).attr('cx', function (d) {
        return d.cx;
      }).attr('cy', function (d) {
        return d.cy;
      }).attr('r', function (d) {
        return d.r;
      }).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1'); // Annotate concentric circles.
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

    function layout() {
      this.container = d3.select(this.element).append('div').classed('force-directed-graph', true).datum(this);
      addSpeedControl.call(this);
      this.svg = this.container.append('svg').classed('fdg-svg', true).attr('width', this.settings.width).attr('height', this.settings.height);
      addOrbits.call(this);
    }

    function defineNodes() {
      var _this = this;

      // A node for each person's schedule
      var nodes = this.data.map(function (d) {
        var act = d[0].act;
        _this.settings.eventCounts[act] += 1;
        var init_x = _this.settings.foci[act].x + Math.random();
        var init_y = _this.settings.foci[act].y + Math.random();

        var eventCounts = _this.settings.eventTypes.reduce(function (eventCounts, eventType) {
          eventCounts[eventType.index] = 0;
          return eventCounts;
        }, {});

        eventCounts[act] += 1;
        return {
          act: act,
          eventCounts: eventCounts,
          x: init_x,
          y: init_y,
          radius: 2 + eventCounts['1'] + eventCounts['2'] + eventCounts['3'],
          color: _this.settings.colorScale(eventCounts['1'] + eventCounts['2'] + eventCounts['3']),
          moves: 0,
          next_move_time: d[0].duration,
          sched: d
        };
      });
      return nodes;
    }

    function collide(alpha) {
      var fdg = this; // Resolve collisions between nodes.

      var quadtree = d3.geom.quadtree(fdg.nodes);
      return function (d) {
        var r = d.radius + fdg.settings.maxRadius + fdg.settings.padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
          if (quad.point && quad.point !== d) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + (d.act !== quad.point.act) * fdg.settings.padding;

            if (l < r) {
              l = (l - r) / l * alpha;
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
      var fdg = this;
      var k = 0.04 * e.alpha; // Push nodes toward their designated focus.

      this.nodes.forEach(function (o, i) {
        var curr_act = o.act; // Make sleep more sluggish moving.

        if (curr_act == '0') {
          var damper = 0.6;
        } else {
          var damper = 1;
        } //o.color = fdg.settings.color(curr_act);


        o.color = fdg.settings.colorScale(o.eventCounts['1'] + o.eventCounts['2'] + o.eventCounts['3']);
        o.y += (fdg.settings.foci[curr_act].y - o.y) * k * damper;
        o.x += (fdg.settings.foci[curr_act].x - o.x) * k * damper;
      });
      fdg.circles.each(collide.call(this, 0.5)).style('fill', function (d) {
        return d.color;
      }).style('stroke', function (d) {
        return d.color;
      }).attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      }).attr('r', function (d) {
        return d.radius;
      });
    }

    function addForceLayout() {
      var force = d3.layout.force().nodes(this.nodes) // .links([])
      .size([this.settings.width, this.settings.height]).gravity(0).charge(0).friction(0.9).on('tick', tick.bind(this)).start();
      return force;
    }

    function addCircles() {
      var circles = this.svg.selectAll('circle').data(this.nodes).enter().append('circle').attr('r', function (d) {
        return d.radius;
      }).style('fill', function (d) {
        return d.color;
      }).style('fill-opacity', 0.5).style('stroke', function (d) {
        return d.color;
      }).style('stroke-opacity', 1); //.call(force.drag);

      return circles;
    }

    function addFociLabels() {
      var fdg = this; // Activity labels

      var text = this.svg.selectAll('text').data(this.settings.eventTypes).enter().append('text').attr('class', 'actlabel').attr('x', function (d, i) {
        if (d.desc == fdg.settings.centerEventType) {
          return fdg.settings.centerCoordinates.x;
        } else {
          var theta = 2 * Math.PI / (fdg.settings.eventTypes.length - 1);
          return (i * 100 + 50) * Math.cos(i * theta) + 380; //return 340 * Math.cos(i * theta)+380;
        }
      }).attr('y', function (d, i) {
        if (d.desc == fdg.settings.centerEventType) {
          return fdg.settings.centerCoordinates.y;
        } else {
          var theta = 2 * Math.PI / (fdg.settings.eventTypes.length - 1);
          return (i * 100 + 50) * Math.sin(i * theta) + 365; //return 340 * Math.sin(i * theta)+365;
        }
      });
      var label = text.append('tspan').attr('x', function () {
        return d3.select(this.parentNode).attr('x');
      }) // .attr("dy", "1.3em")
      .attr('text-anchor', 'middle').text(function (d) {
        return d["short"];
      });
      var pct = text.append('tspan').attr('dy', '1.3em').attr('x', function () {
        return d3.select(this.parentNode).attr('x');
      }).attr('text-anchor', 'middle').attr('class', 'actpct').text(function (d) {
        return fdg.settings.eventCounts[d.index] + '%';
      });
      return text;
    }

    // Output readable percent based on count.
    function readablePercent(n) {
      var pct = 100 * n / 1000;

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

      return "".concat(minutes, " day").concat(m === 1 ? '' : 's', " since heart failure"); //return hh + ":" + mm + ampm
    }

    function addTimer() {
      var fdg = this;
      d3.range(fdg.nodes.length).map(function (i) {
        var curr_node = fdg.nodes[i],
            curr_moves = curr_node.moves; // Time to go to next activity

        if (curr_node.next_move_time == fdg.timepoint) {
          if (curr_node.moves == curr_node.sched.length - 1) {
            curr_moves = 0;
          } else {
            curr_moves += 1;
          } // Subtract from current activity count


          fdg.settings.eventCounts[curr_node.act] -= 1; // Move on to next activity

          curr_node.act = curr_node.sched[curr_moves].act;
          curr_node.eventCounts[curr_node.act] += 1; // Add to new activity count

          fdg.settings.eventCounts[curr_node.act] += 1;
          curr_node.moves = curr_moves;
          curr_node.cx = fdg.settings.foci[curr_node.act].x;
          curr_node.cy = fdg.settings.foci[curr_node.act].y;
          curr_node.radius = 2 + curr_node.eventCounts['1'] + curr_node.eventCounts['2'] + curr_node.eventCounts['3'];
          curr_node.color = fdg.settings.colorScale(curr_node.eventCounts['1'] + curr_node.eventCounts['2'] + curr_node.eventCounts['3']);
          fdg.nodes[i].next_move_time += fdg.nodes[i].sched[curr_node.moves].duration;
        }
      });
      fdg.force.resume();
      fdg.timepoint += 1; // Update percentages

      fdg.fociLabels.selectAll('tspan.actpct').text(function (d) {
        return readablePercent(fdg.settings.eventCounts[d.index]);
      }); // Update time

      var true_minute = fdg.timepoint % 1440;
      d3.select('#current_time').text(minutesToTime(true_minute)); // Update notes
      // var true_minute = fdg.timepoint % 1440;

      if (true_minute == fdg.settings.annotations[fdg.notes_index].start_minute) {
        d3.select('#note').style('top', '0px').transition().duration(600).style('top', '20px').style('color', '#000000').text(fdg.settings.annotations[fdg.notes_index].note);
      } // Make note disappear at the end.
      else if (true_minute == fdg.settings.annotations[fdg.notes_index].stop_minute) {
          d3.select('#note').transition().duration(1000).style('top', '300px').style('color', '#ffffff');
          fdg.notes_index += 1;

          if (fdg.notes_index == fdg.settings.annotations.length) {
            fdg.notes_index = 0;
          }
        }

      setTimeout(addTimer.bind(fdg), fdg.settings.speeds[fdg.settings.speed]);
    }

    function init() {
      this.nodes = defineNodes.call(this);
      this.force = addForceLayout.call(this);
      this.circles = addCircles.call(this);
      this.fociLabels = addFociLabels.call(this);
      this.timepoint = 0;
      this.notes_index = 0;
      setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
      console.log(this.nodes);
    }

    function forceDirectedGraph(data) {
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
      var settings$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fdg = {
        data: data,
        element: element,
        settings: Object.assign(settings, settings$1)
      };
      layout.call(fdg);
      init.call(fdg);
      return fdg;
    }

    return forceDirectedGraph;

})));
