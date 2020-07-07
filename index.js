(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.forceDirectedDiagram = factory());
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
      eventTypes: [{
        'index': '0',
        'short': 'Home',
        'desc': 'Home'
      }, {
        'index': '1',
        'short': 'Hosp.',
        'desc': 'Hospitalization'
      }, {
        'index': '2',
        'short': 'ICU',
        'desc': 'Intensive Care Unit'
      }, {
        'index': '3',
        'short': 'Death',
        'desc': 'Death'
      } //{'index': '0', 'short': 'Sleeping', 'desc': 'Sleeping'},
      //{'index': '1', 'short': 'Personal Care', 'desc': 'Personal Care'},
      //{'index': '2', 'short': 'Eating & Drinking', 'desc': 'Eating and Drinking'},
      //{'index': '3', 'short': 'Education', 'desc': 'Education'},
      //{'index': '4', 'short': 'Work', 'desc': 'Work and Work-Related Activities'},
      //{'index': '5', 'short': 'Housework', 'desc': 'Household Activities'},
      //{'index': '6', 'short': 'Household Care', 'desc': 'Caring for and Helping Household Members'},
      //{'index': '7', 'short': 'Non-Household Care', 'desc': 'Caring for and Helping Non-Household Members'},
      //{'index': '8', 'short': 'Shopping', 'desc': 'Consumer Purchases'},
      //{'index': '9', 'short': 'Pro. Care Services', 'desc': 'Professional and Personal Care Services'},
      //{'index': '10', 'short': 'Leisure', 'desc': 'Socializing, Relaxing, and Leisure'},
      //{'index': '11', 'short': 'Sports', 'desc': 'Sports, Exercise, and Recreation'},
      //{'index': '12', 'short': 'Religion', 'desc': 'Religious and Spiritual Activities'},
      //{'index': '13', 'short': 'Volunteering', 'desc': 'Volunteer Activities'},
      //{'index': '14', 'short': 'Phone Calls', 'desc': 'Telephone Calls'},
      //{'index': '15', 'short': 'Misc.', 'desc': 'Other'},
      //{'index': '16', 'short': 'Traveling', 'desc': 'Traveling'},
      ],
      annotations: [{
        'start_minute': 1,
        'stop_minute': 40,
        'note': 'The simulation kicks in, based on data from the American Time Use Survey.'
      }, {
        'start_minute': 70,
        'stop_minute': 120,
        'note': 'Most people are still sleeping this early in the morning, but some are already at work or preparing for the day.'
      }, {
        'start_minute': 180,
        'stop_minute': 300,
        'note': 'It\'s wake up time for most. Time to start the day with morning rituals, breakfast and a wonderful commute.'
      }, {
        'start_minute': 360,
        'stop_minute': 440,
        'note': 'The day is in full swing with work or housework. Stores and services are open so people can run errands, and they take various forms of transportation to get there.'
      }, {
        'start_minute': 480,
        'stop_minute': 540,
        'note': 'Lunch hour. Many go eat, but there\'s still activity throughout. You see a small shift at the end of the hour.'
      }, {
        'start_minute': 660,
        'stop_minute': 720,
        'note': 'Coffee break? Again, at the top of the hour, you see a shift in activity.'
      }, {
        'start_minute': 780,
        'stop_minute': 830,
        'note': 'With the work day done, it\'s time to commute home and fix dinner or go out for a while.'
      }, {
        'start_minute': 870,
        'stop_minute': 890,
        'note': 'Dinner time!'
      }, {
        'start_minute': 930,
        'stop_minute': 1010,
        'note': 'Dinner\'s done. Time for relaxation, TV, games, hobbies and socializing.'
      }, {
        'start_minute': 1080,
        'stop_minute': 1140,
        'note': 'Winding down for the day. From leisure time, people shift to personal care and sleep.'
      }, {
        'start_minute': 1210,
        'stop_minute': 1300,
        'note': 'Goodnight. More than 80% of people are asleep and it peaks at 96% around 3:00am.'
      }]
    };
    settings.foci = foci(settings);

    function layout() {
      this.container = d3.select(this.element).append('div').classed('force-directed-graph', true).datum(this);
      this.svg = this.container.append('svg').classed('fdg-svg', true).attr('width', this.settings.width).attr('height', this.settings.height);
    }

    function color(activity) {
      var colorByActivity = {
        "0": "#e0d400",
        "1": "#1c8af9",
        "2": "#51BC05",
        "3": "#FF7F00",
        "4": "#DB32A4",
        "5": "#00CDF8",
        "6": "#E63B60",
        "7": "#8E5649",
        "8": "#68c99e",
        "9": "#a477c8",
        "10": "#5C76EC",
        "11": "#E773C3",
        "12": "#799fd2",
        "13": "#038a6c",
        "14": "#cc87fa",
        "15": "#ee8e76",
        "16": "#bbbbbb"
      };
      return colorByActivity[activity];
    }

    // Output readable percent based on count.
    function readablePercent(n) {
      var pct = 100 * n / 1000;

      if (pct < 1 && pct > 0) {
        pct = "<1%";
      } else {
        pct = Math.round(pct) + "%";
      }

      return pct;
    }

    // Minutes to time of day. Data is minutes from 4am.
    function minutesToTime(m) {
      var minutes = (m + 4 * 60) % 1440;

      return "".concat(minutes, " days since randomization"); //return hh + ":" + mm + ampm
    }

    function init() {
      var fdg = this;
      var sched_objs = [],
          curr_minute = 0;
      this.data.forEach(function (d) {
        var day_array = d.day.split(",");
        var activities = [];

        for (var i = 0; i < day_array.length; i++) {
          // Duration
          if (i % 2 == 1) {
            activities.push({
              'act': '' + day_array[i - 1] % 4,
              'duration': +day_array[i]
            });
          }
        }

        sched_objs.push(activities);
      }); // Used for percentages by minute

      var act_counts = {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0
      }; //, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0 };
      // A node for each person's schedule

      var nodes = sched_objs.map(function (o, i) {
        var act = o[0].act;
        act_counts[act] += 1;
        var init_x = fdg.settings.foci[act].x + Math.random();
        var init_y = fdg.settings.foci[act].y + Math.random();
        return {
          act: act,
          radius: 3,
          x: init_x,
          y: init_y,
          color: color(act),
          moves: 0,
          next_move_time: o[0].duration,
          sched: o
        };
      });
      var force = d3.layout.force().nodes(nodes).size([fdg.settings.width, fdg.settings.height]) // .links([])
      .gravity(0).charge(0).friction(.9).on("tick", tick).start();
      var circle = fdg.svg.selectAll("circle").data(nodes).enter().append("circle").attr("r", function (d) {
        return d.radius;
      }).style("fill", function (d) {
        return d.color;
      }); // .call(force.drag);
      // Activity labels

      var label = fdg.svg.selectAll("text").data(fdg.settings.eventTypes).enter().append("text").attr("class", "actlabel").attr("x", function (d, i) {
        if (d.desc == fdg.settings.centerEventType) {
          return fdg.settings.centerCoordinates.x;
        } else {
          var theta = 2 * Math.PI / (fdg.settings.eventTypes.length - 1);
          return (i * 100 + 50) * Math.cos(i * theta) + 380; //return 340 * Math.cos(i * theta)+380;
        }
      }).attr("y", function (d, i) {
        if (d.desc == fdg.settings.centerEventType) {
          return fdg.settings.centerCoordinates.y;
        } else {
          var theta = 2 * Math.PI / (fdg.settings.eventTypes.length - 1);
          return (i * 100 + 50) * Math.sin(i * theta) + 365; //return 340 * Math.sin(i * theta)+365;
        }
      });
      label.append("tspan").attr("x", function () {
        return d3.select(this.parentNode).attr("x");
      }) // .attr("dy", "1.3em")
      .attr("text-anchor", "middle").text(function (d) {
        return d["short"];
      });
      label.append("tspan").attr("dy", "1.3em").attr("x", function () {
        return d3.select(this.parentNode).attr("x");
      }).attr("text-anchor", "middle").attr("class", "actpct").text(function (d) {
        return act_counts[d.index] + "%";
      }); // Update nodes based on activity and duration

      var notes_index = 0;

      function timer() {
        d3.range(nodes.length).map(function (i) {
          var curr_node = nodes[i],
              curr_moves = curr_node.moves; // Time to go to next activity

          if (curr_node.next_move_time == curr_minute) {
            if (curr_node.moves == curr_node.sched.length - 1) {
              curr_moves = 0;
            } else {
              curr_moves += 1;
            } // Subtract from current activity count


            act_counts[curr_node.act] -= 1; // Move on to next activity

            curr_node.act = curr_node.sched[curr_moves].act; // Add to new activity count

            act_counts[curr_node.act] += 1;
            curr_node.moves = curr_moves;
            curr_node.cx = fdg.settings.foci[curr_node.act].x;
            curr_node.cy = fdg.settings.foci[curr_node.act].y;
            nodes[i].next_move_time += nodes[i].sched[curr_node.moves].duration;
          }
        });
        force.resume();
        curr_minute += 1; // Update percentages

        label.selectAll("tspan.actpct").text(function (d) {
          return readablePercent(act_counts[d.index]);
        }); // Update time

        var true_minute = curr_minute % 1440;
        d3.select("#current_time").text(minutesToTime(true_minute)); // Update notes
        // var true_minute = curr_minute % 1440;

        if (true_minute == fdg.settings.annotations[notes_index].start_minute) {
          d3.select("#note").style("top", "0px").transition().duration(600).style("top", "20px").style("color", "#000000").text(fdg.settings.annotations[notes_index].note);
        } // Make note disappear at the end.
        else if (true_minute == fdg.settings.annotations[notes_index].stop_minute) {
            d3.select("#note").transition().duration(1000).style("top", "300px").style("color", "#ffffff");
            notes_index += 1;

            if (notes_index == fdg.settings.annotations.length) {
              notes_index = 0;
            }
          }

        setTimeout(timer, fdg.settings.speeds[fdg.settings.speed]);
      }

      setTimeout(timer, fdg.settings.speeds[fdg.settings.speed]);

      function tick(e) {
        var k = 0.04 * e.alpha; // Push nodes toward their designated focus.

        nodes.forEach(function (o, i) {
          var curr_act = o.act; // Make sleep more sluggish moving.

          if (curr_act == "0") {
            var damper = 0.6;
          } else {
            var damper = 1;
          }

          o.color = color(curr_act);
          o.y += (fdg.settings.foci[curr_act].y - o.y) * k * damper;
          o.x += (fdg.settings.foci[curr_act].x - o.x) * k * damper;
        });
        circle.each(collide(.5)).style("fill", function (d) {
          return d.color;
        }).attr("cx", function (d) {
          return d.x;
        }).attr("cy", function (d) {
          return d.y;
        });
      } // Resolve collisions between nodes.


      function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
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
      } // Speed toggle


      d3.selectAll(".togglebutton").on("click", function () {
        if (d3.select(this).attr("data-val") == "slow") {
          d3.select(".slow").classed("current", true);
          d3.select(".medium").classed("current", false);
          d3.select(".fast").classed("current", false);
        } else if (d3.select(this).attr("data-val") == "medium") {
          d3.select(".slow").classed("current", false);
          d3.select(".medium").classed("current", true);
          d3.select(".fast").classed("current", false);
        } else {
          d3.select(".slow").classed("current", false);
          d3.select(".medium").classed("current", false);
          d3.select(".fast").classed("current", true);
        }

        fdg.settings.speed = d3.select(this).attr("data-val");
      });
    }

    function forceDirectedGraph(data) {
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
      var settings$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fdg = {
        data: data,
        element: element,
        settings: Object.assign(settings, settings$1)
      };
      layout.call(fdg); // Annotate concentric circles.

      fdg.svg.selectAll('circle').data(fdg.settings.eventTypes.slice(1).map(function (d, i) {
        return {
          cx: 380,
          cy: 365,
          r: (i + 1) * 100 + 50
        };
      })).enter().append('circle').attr('cx', function (d) {
        return d.cx;
      }).attr('cy', function (d) {
        return d.cy;
      }).attr('r', function (d) {
        return d.r;
      }).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1');
      init.call(fdg);
      return fdg;
    }

    return forceDirectedGraph;

})));
