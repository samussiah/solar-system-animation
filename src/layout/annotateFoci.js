export default function annotateFoci() {
    const g = this.containers.svgForeground
        .append('g')
        .classed('fdg-g fdg-g--focus-annotations', true);

    const fociLabels = g
        .selectAll('g.fdg-focus-annotation')
        .data(this.metadata.event)
        .join('g')
        .classed('fdg-focus-annotation', true)
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

    const isCenterX = (d) => Math.round(d.x) === Math.round(this.settings.orbitRadius / 2);
    const isLessThanCenterX = (d) =>
        d.order === 1 || Math.round(d.x) < Math.round(this.settings.width / 2);
    const getX = (d) => (isCenterX(d) ? d.x : d.x - (-1) ** isLessThanCenterX(d) * 10);
    const getTextAnchor = (d) => (isCenterX(d) ? 'middle' : isLessThanCenterX(d) ? 'start' : 'end');
    const getDx = (d) => (isCenterX(d) ? 0 : isLessThanCenterX(d) ? '2em' : '-2em');

    const isCenterY = (d) => Math.round(d.y) === Math.round(this.settings.height / 2);
    const isLessThanCenterY = (d) => Math.round(d.y) < Math.round(this.settings.height / 2);
    const getY = (d) => (isCenterY(d) ? d.y : d.y + (-1) ** isLessThanCenterY(d) * 35);
    const getAlignmentBaseline = (d) =>
        isCenterY(d) ? 'center' : isLessThanCenterY(d) ? 'bottom' : 'top';
    const getDy = (d) => (isCenterY(d) ? 0 : isLessThanCenterY(d) ? '-2em' : '2em');

    ['background', 'foreground'].forEach((pos) => {
        const text = fociLabels
            .append('text')
            .classed(`fdg-focus-annotation__text fdg-focus-annotation__${pos}`, true);
        if (this.settings.colorBy.type !== 'categorical')
            text.style('transform', (d) => `translate(${getDx(d)},${getDy(d)})`);
        const label = text
            .append('tspan')
            .classed('fdg-focus-annotation__label', true)
            .attr('x', 0)
            .attr('text-anchor', (d) => getTextAnchor(d))
            .text((d) => d.value);
        const eventCount = text
            .append('tspan')
            .classed('fdg-focus-annotation__event-count', true)
            .classed('fdg-hidden', this.settings.eventCount === false)
            .attr('x', 0)
            .attr('dy', '1.3em')
            .attr('text-anchor', (d) => getTextAnchor(d));
    });

    return fociLabels;
}
