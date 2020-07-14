export default function addCircles() {
    const circles = this.svg
        .selectAll('circle.fdg-bubble')
        .data(this.data.nested)
        .enter()
        .append('circle')
        .classed('fdg-bubble', true)
        .attr('r', (d) => d.r)
        .style('fill', (d) => d.color)
        .style('fill-opacity', 0.5)
        .style('stroke', (d) => d.color)
        .style('stroke-opacity', 1);

    return circles;
}
