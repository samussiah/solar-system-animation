import color from './init/color';
import readablePercent from './init/readablePercent';
import minutesToTime from './init/minutesToTime';

export default function init() {
    const fdg = this;

    var sched_objs = [],
        curr_minute = 0;
    
    this.data.forEach(function(d) {
        var day_array = d.day.split(",");
        var activities = [];
        for (var i=0; i < day_array.length; i++) {
            // Duration
            if (i % 2 == 1) {
                activities.push({'act': '' + (day_array[i-1]%4), 'duration': +day_array[i]});
            }
        }
        sched_objs.push(activities);
    });
    
    // Used for percentages by minute
    var act_counts = { "0": 0, "1": 0, "2": 0, "3": 0 };//, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0 };
    
    // A node for each person's schedule
    var nodes = sched_objs.map(function(o,i) {
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
            sched: o,
        }
    });

    var force = d3.layout.force()
        .nodes(nodes)
        .size([fdg.settings.width, fdg.settings.height])
        // .links([])
        .gravity(0)
        .charge(0)
        .friction(.9)
        .on("tick", tick)
        .start();

    var circle = fdg.svg.selectAll("circle")
        .data(nodes)
      .enter().append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) { return d.color; });
        // .call(force.drag);
    
    // Activity labels
    var label = fdg.svg.selectAll("text")
        .data(fdg.settings.eventTypes)
      .enter().append("text")
        .attr("class", "actlabel")
        .attr("x", function(d, i) {
            if (d.desc == fdg.settings.centerEventType) {
                return fdg.settings.centerCoordinates.x;
            } else {
                var theta = 2 * Math.PI / (fdg.settings.eventTypes.length-1);
                return (i*100 + 50) * Math.cos(i * theta)+380;
                //return 340 * Math.cos(i * theta)+380;
            }
            
        })
        .attr("y", function(d, i) {
            if (d.desc == fdg.settings.centerEventType) {
                return fdg.settings.centerCoordinates.y;
            } else {
                var theta = 2 * Math.PI / (fdg.settings.eventTypes.length-1);
                return (i*100 + 50) * Math.sin(i * theta)+365;
                //return 340 * Math.sin(i * theta)+365;
            }
            
        });
        
    label.append("tspan")
        .attr("x", function() { return d3.select(this.parentNode).attr("x"); })
        // .attr("dy", "1.3em")
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.short;
        });
    label.append("tspan")
        .attr("dy", "1.3em")
        .attr("x", function() { return d3.select(this.parentNode).attr("x"); })
        .attr("text-anchor", "middle")
        .attr("class", "actpct")
        .text(function(d) {
            return act_counts[d.index] + "%";
        });
        

    // Update nodes based on activity and duration
    var notes_index = 0;
    function timer() {
        d3.range(nodes.length).map(function(i) {
            var curr_node = nodes[i],
                curr_moves = curr_node.moves; 

            // Time to go to next activity
            if (curr_node.next_move_time == curr_minute) {
                if (curr_node.moves == curr_node.sched.length-1) {
                    curr_moves = 0;
                } else {
                    curr_moves += 1;
                }
            
                // Subtract from current activity count
                act_counts[curr_node.act] -= 1;
            
                // Move on to next activity
                curr_node.act = curr_node.sched[ curr_moves ].act;
            
                // Add to new activity count
                act_counts[curr_node.act] += 1;
            
                curr_node.moves = curr_moves;
                curr_node.cx = fdg.settings.foci[curr_node.act].x;
                curr_node.cy = fdg.settings.foci[curr_node.act].y;
            
                nodes[i].next_move_time += nodes[i].sched[ curr_node.moves ].duration;
            }

        });

        force.resume();
        curr_minute += 1;

        // Update percentages
        label.selectAll("tspan.actpct")
            .text(function(d) {
                return readablePercent(act_counts[d.index]);
            });
    
        // Update time
        var true_minute = curr_minute % 1440;
        d3.select("#current_time").text(minutesToTime(true_minute));
        
        // Update notes
        // var true_minute = curr_minute % 1440;
        if (true_minute == fdg.settings.annotations[notes_index].start_minute) {
            d3.select("#note")
                .style("top", "0px")
              .transition()
                .duration(600)
                .style("top", "20px")
                .style("color", "#000000")
                .text(fdg.settings.annotations[notes_index].note);
        } 
        
        // Make note disappear at the end.
        else if (true_minute == fdg.settings.annotations[notes_index].stop_minute) {
            
            d3.select("#note").transition()
                .duration(1000)
                .style("top", "300px")
                .style("color", "#ffffff");
                
            notes_index += 1;
            if (notes_index == fdg.settings.annotations.length) {
                notes_index = 0;
            }
        }
        
        
        setTimeout(timer, fdg.settings.speeds[fdg.settings.speed]);
    }
    setTimeout(timer, fdg.settings.speeds[fdg.settings.speed]);
    
    
    
        
    function tick(e) {
      var k = 0.04 * e.alpha;
  
      // Push nodes toward their designated focus.
      nodes.forEach(function(o, i) {
        var curr_act = o.act;
        
        // Make sleep more sluggish moving.
        if (curr_act == "0") {
            var damper = 0.6;
        } else {
            var damper = 1;
        }
        o.color = color(curr_act);
        o.y += (fdg.settings.foci[curr_act].y - o.y) * k * damper;
        o.x += (fdg.settings.foci[curr_act].x - o.x) * k * damper;
      });

      circle
            .each(collide(.5))
            .style("fill", function(d) { return d.color; })
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }


    // Resolve collisions between nodes.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + fdg.settings.maxRadius + fdg.settings.padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
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
    
    
    
    
    // Speed toggle
    d3.selectAll(".togglebutton")
      .on("click", function() {
        if (d3.select(this).attr("data-val") == "slow") {
            d3.select(".slow").classed("current", true);
            d3.select(".medium").classed("current", false);
            d3.select(".fast").classed("current", false);
        } else if (d3.select(this).attr("data-val") == "medium") {
            d3.select(".slow").classed("current", false);
            d3.select(".medium").classed("current", true);
            d3.select(".fast").classed("current", false);
        } 
        else {
            d3.select(".slow").classed("current", false);
            d3.select(".medium").classed("current", false);
            d3.select(".fast").classed("current", true);
        }
        
        fdg.settings.speed = d3.select(this).attr("data-val");
    });
}
