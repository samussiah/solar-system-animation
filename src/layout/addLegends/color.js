export default function color() {
    this.colorLegend = this.legends.append('div').classed('fdg-legend fdg-legend__color', true);
    const legendDimensions = [200,100];
    this.colorLegend
        .append('div')
        .html('Number of <span class = "fdg-measure">hospitalization</span> events');
    const colorLegendSvg = this.colorLegend
        .append('svg')
        .attr('width', legendDimensions[0])
        .attr('height', legendDimensions[1])
        .append('g');
    colorLegendSvg
        .selectAll('rect.legend-mark')
        .data(this.settings.colors())
        .enter()
        .append('rect')
        .classed('legend-mark', true)
        .attr('x', (d,i) => i*(legendDimensions[0]/this.settings.colors().length))
        .attr('y', 0)
        .attr('width', legendDimensions[0]/this.settings.colors().length)
        .attr('height', legendDimensions[1]/2)
        .attr('fill', d => d)
        .attr('fill-opacity', 0.5)
        .attr('stroke', d => d)
        .attr('stroke-opacity', 1);
    colorLegendSvg
        .append('text')
        .attr('x', legendDimensions[0]/this.settings.colors().length/2)
        .attr('y', legendDimensions[1]/2 + 16)
        .attr('text-anchor', 'middle')
        .text('0');
    colorLegendSvg
        .append('text')
        .attr('x', legendDimensions[0] - legendDimensions[0]/this.settings.colors().length/2)
        .attr('y', legendDimensions[1]/2 + 16)
        .attr('text-anchor', 'middle')
        .text(`${this.settings.colors().length}+`);
}
