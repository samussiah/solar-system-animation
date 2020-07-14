import collide from './tick/collide';

// TODO: figure out what k does
export default function tick(e) {
    const k = 0.04 * e.alpha;

    // Push nodes toward their designated focus.
    this.data.nested.forEach((d, i) => {
        const currentEvent = this.eventTypes.find(
            (eventType) => eventType.label === d.currentEvent.event
        );

        // Take the point's current coordinates and add to it the difference between the coordinates of the
        // corresponding focus and the coordinates of the point, multiplied by some tiny fraction.
        if (d.key === '23') console.log('---');
        if (d.key === '23') console.log(currentEvent.label);
        if (d.key === '23') console.log(d.next_move_time);
        if (d.key === '23') console.log(d.x);
        d.x += (currentEvent.x - d.x) * k * 0.5;
        if (d.key === '23') console.log(d.x);
        d.y += (currentEvent.y - d.y) * k * 0.5;
    });

    this.circles
        .each(collide.call(this, 0.5))
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => d.r)
        .style('fill', (d) => d.color)
        .style('stroke', (d) => d.color);
}
