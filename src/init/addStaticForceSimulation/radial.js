export default function radial(data, x, y) {
    const simulation = d3
        .forceSimulation(data)
        .force('charge', d3.forceCollide().radius(this.settings.minRadius + 0.5))
        .force('r', d3.forceRadial(this.settings.orbitRadius / 2))
        .stop();

    for (let i = 0; i < 30; i++) simulation.tick();

    const g = this.containers.svgBackground
        .insert('g', ':first-child')
        .attr('transform', `translate(${x},${y})`);
    //g.append('text')
    //    .attr('x', 0)
    //    .attr('y', -this.settings.orbitRadius / 2)
    //    .attr('dy', -36)
    //    .attr('text-anchor', 'middle')
    //    .text('No state changes');
    //g.append('text')
    //    .attr('x', 0)
    //    .attr('y', -this.settings.orbitRadius / 2)
    //    .attr('dy', -16)
    //    .attr('text-anchor', 'middle')
    //    .text(`${data.length} (${d3.format('.1%')(data.length / this.data.nested.length)})`);
    const nodes = g
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return d.x;
        })
        .attr('cy', function (d) {
            return d.y;
        })
        .attr('r', this.settings.minRadius)
        .attr('fill', this.settings.color(0))
        .attr('fill-opacity', 0.25);

    return {
        simulation,
        g,
        nodes,
    };
}
