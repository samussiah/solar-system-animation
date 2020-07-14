export default function addOrbits() {
    // Draw concentric circles.
    const orbits = this.svg
        .selectAll('circle.orbit')
        .data(
            this.eventTypes.slice(1).map((d, i) => {
                return { cx: 380, cy: 365, r: (i + 1) * 100 + 50 };
            })
        )
        .enter()
        .append('circle')
        .classed('orbit', true)
        .attr('cx', (d) => d.cx)
        .attr('cy', (d) => d.cy)
        .attr('r', (d) => d.r)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '1');

    // Annotate concentric circles.
    //this.svg
    //    .selectAll('text.orbit')
    //    .data(
    //        this.settings.eventTypes.slice(1).map((d, i) => {
    //            return { cx: 380, cy: 365, r: (i + 1) * 100 + 50 };
    //        })
    //    )
    //    .enter()
    //    .append('text')
    //    .classed('orbit', true)
    //    .attr('x', d => d.cx)
    //    .attr('y', d => d.cy - d.r)
    //    .text('asdf')
}
