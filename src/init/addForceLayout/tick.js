import collide from './tick/collide';

// TODO: figure out what k does
export default function tick(e) {
    const k = 0.04 * e.alpha;

    // Push nodes toward their designated focus.
    this.data.nested.forEach((d, i) => {
        const currentEvent = this.eventTypes.find(
            (eventType) => eventType.label === d.currentEvent.event
        );
        d.x += (currentEvent.x - d.x) * k * 0.5;
        d.y += (currentEvent.y - d.y) * k * 0.5;
        //d.color = this.settings.colorScale(
        //    d3.sum(d.eventTypes.filter(eventType => eventType.label !== this.settings.centerEventType), eventType => eventType.count)
        //);
    });

    this.circles
        .each(collide.call(this, 0.5))
        .style('fill', (d) => d.color)
        .style('stroke', (d) => d.color)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => d.r);
}
