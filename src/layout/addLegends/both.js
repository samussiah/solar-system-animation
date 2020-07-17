export default function both() {
    this.bothLegend = this.legends
        .append('div')
        .classed('fdg-legend fdg-legend--both', true)
        .classed(
            'fdg-hidden',
            this.settings.eventChangeCountAesthetic !== 'both' ||
                this.settings.eventChangeCount.length === 0
        );
    const legendDimensions = [200, 50];
    this.bothLegend
        .append('div')
        .classed('fdg-legend__label', true)
        .style('width', legendDimensions[0] + 'px')
        .html(
            `Number of <span class = "fdg-measure">${this.settings.eventChangeCount
                .join(', ')
                .replace(/, ([^,]*)$/, ', and $1')}</span> events`
        );
    const bothLegendSvg = this.bothLegend
        .append('svg')
        .attr('width', legendDimensions[0])
        .attr('height', legendDimensions[1])
        .append('g');
    bothLegendSvg
        .selectAll('circle.legend-mark')
        .data(this.settings.colors())
        .enter()
        .append('circle')
        .classed('legend-mark', true)
        .attr(
            'cx',
            (d, i) =>
                i * (legendDimensions[0] / this.settings.colors().length) +
                legendDimensions[0] / this.settings.colors().length / 2
        )
        .attr('cy', legendDimensions[1] / 4)
        .attr('r', (d, i) => i + this.settings.minRadius)
        .attr('fill', (d) => d)
        .attr('fill-opacity', 0.5)
        .attr('stroke', (d) => d)
        .attr('stroke-opacity', 1);
    bothLegendSvg
        .append('text')
        .attr('x', legendDimensions[0] / this.settings.colors().length / 2)
        .attr('y', legendDimensions[1] / 2 + 16)
        .attr('text-anchor', 'middle')
        .text('0');
    bothLegendSvg
        .append('text')
        .attr('x', legendDimensions[0] - legendDimensions[0] / this.settings.colors().length / 2)
        .attr('y', legendDimensions[1] / 2 + 16)
        .attr('text-anchor', 'middle')
        .text(`${this.settings.colors().length}+`);
}
