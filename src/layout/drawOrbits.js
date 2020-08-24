export default function addOrbits() {
    const orbits = this.svg
        .selectAll('circle.orbit')
        .data(this.metadata.orbit)
        .enter()
        .append('circle')
        .classed('orbit', true)
        .attr(
            'transform',
            `translate(-${this.settings.width / 2 - 100},-${this.settings.height / 2 - 100})`
        )
        .attr('cx', (d) => d.cx)
        .attr('cy', (d) => d.cy)
        .attr('r', (d) => d.r)
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', '.5');

    return orbits;
}
