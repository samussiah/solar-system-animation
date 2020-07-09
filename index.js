(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.forceDirectedGraph = factory());
}(this, (function () { 'use strict';

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
      eventTypes: null,
      // data-driven by default
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

    function addSpeedControl() {
      var _this = this;

      var fdg = this;
      var container = this.controls.append('div').classed('fdg-controls__speed', true);
      var inputs = container.selectAll('div').data(Object.keys(this.settings.speeds).map(function (key) {
        return {
          label: key,
          value: _this.settings.speeds[key]
        };
      })).enter().append('div').attr('class', function (d) {
        return "togglebutton ".concat(d.label, " ").concat(d.label === _this.settings.speed ? 'current' : '');
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

    function layout() {
      this.container = d3.select(this.element).append('div').classed('force-directed-graph', true).datum(this);
      this.controls = this.container.append('div').classed('fdg-controls', true);
      addSpeedControl.call(this);
      this.canvas = this.container.append('div').classed('fdg-canvas', true);
      this.svg = this.canvas.append('svg').classed('fdg-svg', true).attr('width', this.settings.width).attr('height', this.settings.height);
    }

    function defineEventTypes() {
      var eventTypes = Array.from(new Set(this.data.map(function (d) {
        return d.event_order + ':|:' + d.event;
      }))).map(function (eventType) {
        var split = eventType.split(':|:');
        return {
          order: parseInt(split[0]),
          label: split[1],
          count: 0
        };
      }).sort(function (a, b) {
        return a.order - b.order ? a.order - b.order : a.label < b.label ? -1 : 1;
      }); // Define coordinates of foci.
      // TODO: make the coordinates a little less hard-coded, particularly the + 380 and + 365 bits

      var theta = 2 * Math.PI / (eventTypes.length - 1);
      var centerX = this.settings.centerCoordinates.x;
      var centerY = this.settings.centerCoordinates.y;
      eventTypes.forEach(function (eventType, i) {
        eventType.x = i === 0 ? centerX : (i * 100 + 50) * Math.cos(i * theta) + centerX;
        eventType.y = i === 0 ? centerY : (i * 100 + 50) * Math.sin(i * theta) + centerY;
      });
      console.table(eventTypes);
      return eventTypes;
    }

    function dataManipulation() {
      this.eventTypes = defineEventTypes.call(this);
    }

    function addOrbits() {
      console.log(this); // Draw concentric circles.

      var orbits = this.svg.selectAll('circle.orbit').data(this.eventTypes.slice(1).map(function (d, i) {
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

    function forceDirectedGraph(data) {
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
      var settings$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fdg = {
        data: data,
        element: element,
        settings: Object.assign(settings, settings$1)
      };
      layout.call(fdg);
      dataManipulation.call(fdg);
      addOrbits.call(fdg); //init.call(fdg);

      return fdg;
    }

    return forceDirectedGraph;

})));
