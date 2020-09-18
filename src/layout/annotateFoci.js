export default function annotateFoci() {
    const fdg = this;

    const g = this.containers.svgForeground.append('g').classed('fdg-g fdg-g--focus-annotations', true);

    const fociLabels = g
        .selectAll('g.fdg-focus-annotation')
        .data(this.metadata.event)
        .join('g')
        .classed('fdg-focus-annotation', true);

    if (this.settings.translate)
        fociLabels.attr(
            'transform',
            `translate(-${this.settings.width / 2 - 100},-${this.settings.height / 2 - 100})`
        );

    // defs - give the text a background
    //const filters = fociLabels
    //    .append('defs')
    //    .classed('fdg-focus-annotation__defs', true)
    //        .append('filter')
    //        .classed('fdg-focus-annotation__filter', true)
    //        .attr('id', d => `fdg-focus-annotation__${d.value.toLowerCase().replace(/ /g, '-')}`)
    //        .attr('x', 0)
    //        .attr('y', 0)
    //        .attr('width', 1)
    //        .attr('height', 1);

    //filters.append('feFlood').attr('flood-color', '#aaaaaaaa');
    //filters.append('feComposite').attr('in', 'SourceGraphic').attr('operator', 'xor');

    // text

    const isCenterX = (d) => Math.round(d.x) === Math.round(this.settings.orbitRadius / 2);
    const isLessThanCenterX = (d) =>
        d.order === 1 || Math.round(d.x) < Math.round(this.settings.width / 2);
    const getX = (d) => (isCenterX(d) ? d.x : d.x - (-1) ** isLessThanCenterX(d) * 10);
    const getTextAnchor = (d) => (isCenterX(d) ? 'middle' : isLessThanCenterX(d) ? 'start' : 'end');

    const isCenterY = (d) => Math.round(d.y) === Math.round(this.settings.height / 2);
    const isLessThanCenterY = (d) => Math.round(d.y) < Math.round(this.settings.height / 2);
    const getY = (d) => (isCenterY(d) ? d.y : d.y + (-1) ** isLessThanCenterY(d) * 35);
    const getAlignmentBaseline = (d) =>
        isCenterY(d) ? 'center' : isLessThanCenterY(d) ? 'bottom' : 'top';

    const textBackground = fociLabels
        .append('text')
        .classed('fdg-focus-annotation__text', true)
        .attr('x', (d) => getX(d))
        .attr('y', (d) => getY(d));
    //.attr('filter', d => `url(#fdg-focus-annotation__${d.value.toLowerCase().replace(/ /g, '-')})`);

    textBackground
        .append('tspan')
        .classed('fdg-focus-annotation__label', true)
        .attr('x', (d) => getX(d))
        .attr('text-anchor', (d) => getTextAnchor(d))
        //.attr('alignment-baseline', d => getAlignmentBaseline(d))
        .style('font-weight', 'bold')
        .style('font-size', '20px')
        .attr('stroke', 'white')
        .attr('stroke-width', '4px')
        .text((d) => d.value);

    textBackground
        .append('tspan')
        .classed('fdg-focus-annotation__event-count', true)
        .classed('fdg-hidden', this.settings.eventCount === false)
        .attr('x', (d) => getX(d))
        .attr('text-anchor', (d) => getTextAnchor(d))
        //.attr('alignment-baseline', d => getAlignmentBaseline(d))
        .attr('dy', '1.3em')
        .style('font-weight', 'bold')
        .attr('stroke', 'white')
        .attr('stroke-width', '4px');
    //.text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);

    const textForeground = fociLabels
        .append('text')
        .classed('fdg-focus-annotation__text', true)
        .attr('x', (d) => getX(d))
        .attr('y', (d) => getY(d));
    //.attr('filter', d => `url(#fdg-focus-annotation__${d.value.toLowerCase().replace(/ /g, '-')})`);

    textForeground
        .append('tspan')
        .classed('fdg-focus-annotation__label', true)
        .attr('x', (d) => getX(d))
        .attr('text-anchor', (d) => getTextAnchor(d))
        //.attr('alignment-baseline', d => getAlignmentBaseline(d))
        .style('font-weight', 'bold')
        .style('font-size', '20px')
        .attr('fill', 'black')
        .text((d) => d.value);

    textForeground
        .append('tspan')
        .classed('fdg-focus-annotation__event-count', true)
        .classed('fdg-hidden', this.settings.eventCount === false)
        .attr('x', (d) => getX(d))
        .attr('text-anchor', (d) => getTextAnchor(d))
        //.attr('alignment-baseline', d => getAlignmentBaseline(d))
        .attr('dy', '1.3em')
        .style('font-weight', 'bold')
        .attr('fill', 'black');
    //.text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);

    return fociLabels;
}
