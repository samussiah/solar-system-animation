export default function categorical() {
    const container = this.legends.container
        .append('div')
        .classed('fdg-legend fdg-legend--categorical', true);
    container
        .append('div')
        .classed('fdg-sidebar__label fdg-legend__label', true)
        .html(this.settings.colorBy.label);
    const legendItems = container
        .append('svg')
        .attr('width', 200)
        .attr('height', 20 * this.scales.color.domain().length)
        .selectAll('g')
        .data(this.scales.color.domain())
        .join('g')
        .attr('transform', 'translate(20,0)');
    legendItems
        .append('circle')
        .classed('fdg-legend__symbol', true)
        .attr('cx', 20)
        .attr('cy', (d, i) => i * 20 + 10)
        .attr('r', 7)
        .attr('fill', (d) => this.scales.color(d));
    legendItems
        .append('text')
        .classed('fdg-legend__label', true)
        .attr('font-size', '1rem')
        .attr('x', 35)
        .attr('y', (d, i) => i * 20 + 12)
        .attr('alignment-baseline', 'middle')
        .html(
            (d) =>
                `${d} (n=${d3.format(',d')(
                    this.metadata.id.filter((di) => di.colorStratum === d).length
                )})`
        );
}
