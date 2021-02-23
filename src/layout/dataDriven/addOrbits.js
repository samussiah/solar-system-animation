export default function addOrbits() {
    const g = this.layout.svgBackground
        .append('g')
        .classed('fdg-g fdg-g--orbits', true)
        .attr('transform', `translate(${this.settings.width.sidebar},0)`);

    const shadows = g
        .append('defs')
        .selectAll('filter')
        .data(this.metadata.orbit)
        .join('filter')
        .attr('id', (d, i) => `orbit--${i}`);

    shadows
        .append('feDropShadow')
        .attr('dx', 0)
        .attr('dy', 0)
        .attr('stdDeviation', 5)
        .attr('flood-color', 'black');

    const orbits = g
        .selectAll('circle.orbit')
        .data(this.metadata.orbit)
        .enter()
        .append('circle')
        .classed('orbit', true)
        .attr('cx', (d) => d.cx)
        .attr('cy', (d) => d.cy)
        .attr('r', (d) => d.r)
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', '.5')
        .style('filter', (d, i) => `url(#orbit--${i})`);

    return orbits;
}
