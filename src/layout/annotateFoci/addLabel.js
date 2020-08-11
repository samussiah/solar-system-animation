export default function addLabel(positioning) {
    const isCenterX = (d) => Math.round(d.x) === Math.round(this.settings.width / 2);
    const isLessThanCenterX = (d) => Math.round(d.x) < Math.round(this.settings.width / 2);
    const getX = (d) => (isCenterX(d) ? d.x : d.x - (-1) ** isLessThanCenterX(d) * 10);
    const getTextAnchor = (d) => (isCenterX(d) ? 'middle' : isLessThanCenterX(d) ? 'start' : 'end');

    const isCenterY = (d) => Math.round(d.y) === Math.round(this.settings.height / 2);
    const isLessThanCenterY = (d) => Math.round(d.y) < Math.round(this.settings.height / 2);
    const getY = (d) => (isCenterY(d) ? d.y : d.y + (-1) ** isLessThanCenterY(d) * 35);
    const getAlignmentBaseline = (d) =>
        isCenterY(d) ? 'center' : isLessThanCenterY(d) ? 'bottom' : 'top';

    const textBackground = fociLabels
        .append('text')
        .classed('fdg-foci-label__text', true)
        .attr('x', (d) => positioning.getX(d))
        .attr('y', (d) => positioning.getY(d));

    //textBackground
    //    .selectAll('tspan')
    //    .data([
    //        {
    //            class: 'value',
    //            dy: 0,

    //    .append('tspan')
    //    .classed('fdg-foci-label__value', true)
    //    .attr('x', (d) => positioning.getX(d))
    //    .attr('text-anchor', d => positioning.getTextAnchor(d))
    //    //.attr('alignment-baseline', d => positioning.getAlignmentBaseline(d))
    //    .style('font-weight', 'bold')
    //    .style('font-size', '20px')
    //    .attr('stroke', 'white')
    //    .attr('stroke-width', '4px')
    //    .text((d) => d.value);

    //textBackground
    //    .append('tspan')
    //    .classed('fdg-foci-label__pct', true)
    //    .classed('fdg-hidden', this.settings.eventCount === false)
    //    .attr('x', (d) => positioning.getX(d))
    //    .attr('text-anchor', d => positioning.getTextAnchor(d))
    //    //.attr('alignment-baseline', d => positionging.getAlignmentBaseline(d))
    //    .attr('dy', '1.3em')
    //    .style('font-weight', 'bold')
    //    .attr('stroke', 'white')
    //    .attr('stroke-width', '4px')
    //    .text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);
}
