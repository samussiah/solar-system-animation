export default function addOrbits() {
    // Annotate concentric circles.
    this.svg
        .selectAll('circle')
        .data(
            this.settings.eventTypes.slice(1).map((d, i) => {
                return { cx: 380, cy: 365, r: (i + 1) * 100 + 50 };
            })
        )
        .enter()
        .append('circle')
        .attr('cx', (d) => d.cx)
        .attr('cy', (d) => d.cy)
        .attr('r', (d) => d.r)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '1');
}
