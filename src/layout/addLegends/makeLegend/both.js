export default function both(svg, legendDimensions) {
    const marks = svg
        .selectAll('circle.legend-mark')
        .data(this.colorScale.range())
        .join(this.settings.shape === 'circle' ? 'circle' : 'rect')
        .classed('legend-mark', true)
        .attr('fill', (d) => d)
        .attr('fill-opacity', 0.5)
        .attr('stroke', (d) => d)
        .attr('stroke-opacity', 1);

    if (this.settings.shape === 'circle')
        marks
            .attr(
                'cx',
                (d, i) =>
                    i * (legendDimensions[0] / this.settings.nColors) +
                    legendDimensions[0] / this.settings.nColors / 2
            )
            .attr('cy', legendDimensions[1] / 4)
            .attr('r', (d, i) => i + this.settings.minRadius);
    else if (this.settings.shape === 'square')
        marks
            .attr(
                'x',
                (d, i) =>
                    i * (legendDimensions[0] / this.settings.nColors) +
                    legendDimensions[0] / this.settings.nColors / 2 -
                    (i + this.settings.minRadius)
            )
            .attr('y', (d, i) => legendDimensions[1] / 4 - (i + this.settings.minRadius))
            .attr('width', (d, i) => (i + this.settings.minRadius) * 2)
            .attr('height', (d, i) => (i + this.settings.minRadius) * 2);

    return marks;
}
