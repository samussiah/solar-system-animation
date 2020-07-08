export default function addCircles() {
    const circles = this.svg
        .selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('r', d => d.radius)
        .style('fill', d => d.color);
        //.call(force.drag);

    return circles;
}
