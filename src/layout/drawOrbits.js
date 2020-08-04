export default function addOrbits() {
    const orbits = this.svg
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
        .attr('stroke-width', '.5');

    return orbits;
}
