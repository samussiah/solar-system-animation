export default function addOrbits() {
    // Draw concentric circles.
    const orbits = this.svg
        .selectAll('circle.orbit')
        .data(
            this.metadata.event
                .filter(event => event.value !== this.settings.eventCentral)
                .map((event, i) =>
                    Object.assign(event, { cx: 380, cy: 365, r: (i + 1) * 100 + 50 })
                )
        )
        .enter()
        .append('circle')
        .classed('orbit', true)
        .attr('cx', (d) => d.cx)
        .attr('cy', (d) => d.cy)
        .attr('r', (d) => d.r)
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', '.5');

    // Annotate concentric circles.
    //this.svg
    //    .selectAll('text.orbit')
    //    .data(
    //        this.settings.metadata.event.slice(1).map((d, i) => {
    //            return { cx: 380, cy: 365, r: (i + 1) * 100 + 50 };
    //        })
    //    )
    //    .enter()
    //    .append('text')
    //    .classed('orbit', true)
    //    .attr('x', d => d.cx)
    //    .attr('y', d => d.cy - d.r)
    //    .text('asdf')

    return orbits;
}
