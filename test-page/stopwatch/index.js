

var duration = 2500,
    repeat = 3

function draw_stopwatch_arc(angle){

  var r = 7.4
  var cx = 23.8
  var cy = 24.1

  var px = r * Math.sin(angle)
  var py = -1 * r * Math.cos(angle)

  var d = "M" + cx + "," + cy + " "
  d += "l" + px + "," + py + " "
  if (angle < Math.PI) {
    d += "A " + r + " " + r + " 0 0 0 " + (cx) + " " + (cy - r) + " "
  } else {
    d += "A " + r + " " + r + " 0 0 0 " + (cx) + " " + (cy + r) + " "
    d += "A " + r + " " + r + " 0 0 0 " + (cx) + " " + (cy - r) + " "
  }

  d3.select(".stopwatch-center")
    .transition().duration(0)
      .attr("d", d)

}

var stopwatch_timer = false
function stopwatch_single_turn(duration){
  if (stopwatch_timer) { stopwatch_timer.stop() }
  stopwatch_timer = d3.timer(function(t){
    if (t > duration) { stopwatch_timer.stop() }
    else { draw_stopwatch_arc(t * 2 * Math.PI / duration) }
  })
}

var count = 1
stopwatch_interval = d3.interval(function(){
  stopwatch_single_turn(duration)
  count += 1
  //if (count >= repeat) { stopwatch_interval.stop() }
}, duration)
stopwatch_single_turn(duration)

