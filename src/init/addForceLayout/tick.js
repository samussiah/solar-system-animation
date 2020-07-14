import collide from './tick/collide';

// TODO: figure out what k does
export default function tick(e) {
    const k = 0.02 * e.alpha;

    // Push nodes toward their designated focus.
    this.data.nested.forEach((d, i) => {
        // Find the datum of the destination focus.
        const currentEvent = this.eventTypes.find(
            (eventType) => eventType.label === d.currentEvent.event
        );

        // Take the point's current coordinates and add to it the difference between the coordinates of the
        // destination focus and the coordinates of the point, multiplied by some tiny fraction.
        d.x += (currentEvent.x - d.x) * k;
        d.y += (currentEvent.y - d.y) * k;
    });

    this.circles
        .each(collide.call(this, 0.5))
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => d.r)
        .style('fill', (d) => d.color)
        .style('stroke', (d) => d.color);
}
