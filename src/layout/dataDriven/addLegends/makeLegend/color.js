export default function color(svg, legendDimensions) {
    const marks = svg
        .selectAll('rect.legend-mark')
        .data(this.scales.color.range())
        .enter()
        .append('rect')
        .classed('legend-mark', true)
        .attr('x', (d, i) => i * (legendDimensions[0] / this.settings.colorBy.nColors))
        .attr('y', 0)
        .attr('width', legendDimensions[0] / this.settings.colorBy.nColors)
        .attr('height', legendDimensions[1] / 3)
        .attr('fill', (d) => d)
        .attr('fill-opacity', 0.5)
        .attr('stroke', (d) => d)
        .attr('stroke-opacity', 1);

    return marks;
}
