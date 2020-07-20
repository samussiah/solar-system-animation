export default function both(svg, legendDimensions) {
    const marks = svg
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

    return marks;
}
