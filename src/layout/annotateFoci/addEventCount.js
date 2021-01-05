import getTextAnchor from './x/getPosition';

export default function addEventCount(text) {
    const eventCount = text
        .append('tspan')
        .classed('fdg-focus-annotation__event-count', true)
        .classed('fdg-hidden', this.settings.eventCount === false)
        .attr('x', 0)
        .attr('dy', '1.3em')
        //.attr('text-anchor', (d) => getTextAnchor.call(this, d));
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle');

    return eventCount;
}
