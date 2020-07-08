import collide from './tick/collide';

export default function tick(e) {
    const fdg = this;
    var k = 0.04 * e.alpha;

    // Push nodes toward their designated focus.
    this.nodes.forEach(function (o, i) {
        var curr_act = o.act;

        // Make sleep more sluggish moving.
        if (curr_act == '0') {
            var damper = 0.6;
        } else {
            var damper = 1;
        }
        //o.color = fdg.settings.color(curr_act);
        o.color = fdg.settings.colorScale(o.eventCounts['1'] + o.eventCounts['2'] + o.eventCounts['3']);
        o.y += (fdg.settings.foci[curr_act].y - o.y) * k * damper;
        o.x += (fdg.settings.foci[curr_act].x - o.x) * k * damper;
    });

    fdg.circles
        .each(collide.call(this, 0.5))
        .style('fill', d => d.color)
        .style('stroke', d => d.color)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.radius);
}
