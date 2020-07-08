import readablePercent from './addTimer/readablePercent';
import minutesToTime from './addTimer/minutesToTime';

export default function addTimer() {
    const fdg = this;

    d3.range(fdg.nodes.length).map(function (i) {
        var curr_node = fdg.nodes[i],
            curr_moves = curr_node.moves;

        // Time to go to next activity
        if (curr_node.next_move_time == fdg.timepoint) {
            if (curr_node.moves == curr_node.sched.length - 1) {
                curr_moves = 0;
            } else {
                curr_moves += 1;
            }

            // Subtract from current activity count
            fdg.settings.eventCounts[curr_node.act] -= 1;

            // Move on to next activity
            curr_node.act = curr_node.sched[curr_moves].act;
            curr_node.eventCounts[curr_node.act] += 1;

            // Add to new activity count
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
    fdg.timepoint += 1;

    // Update percentages
    fdg.fociLabels.selectAll('tspan.actpct').text(function (d) {
        return readablePercent(fdg.settings.eventCounts[d.index]);
    });

    // Update time
    var true_minute = fdg.timepoint % 1440;
    d3.select('#current_time').text(minutesToTime(true_minute));

    // Update notes
    // var true_minute = fdg.timepoint % 1440;
    if (true_minute == fdg.settings.annotations[fdg.notes_index].start_minute) {
        d3.select('#note')
            .style('top', '0px')
            .transition()
            .duration(600)
            .style('top', '20px')
            .style('color', '#000000')
            .text(fdg.settings.annotations[fdg.notes_index].note);
    }

    // Make note disappear at the end.
    else if (true_minute == fdg.settings.annotations[fdg.notes_index].stop_minute) {
        d3.select('#note')
            .transition()
            .duration(1000)
            .style('top', '300px')
            .style('color', '#ffffff');

        fdg.notes_index += 1;
        if (fdg.notes_index == fdg.settings.annotations.length) {
            fdg.notes_index = 0;
        }
    }

    setTimeout(addTimer.bind(fdg), fdg.settings.speeds[fdg.settings.speed]);
}
