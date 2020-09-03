export default function circular(data) {
    const simulation = d3
        .forceSimulation()
        .nodes(data)
        .force('center', d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2))
        .force('x', d3.forceX(this.settings.orbitRadius / 2).strength(0.3))
        .force('y', d3.forceY(this.settings.height / 2).strength(0.3))
        .force('charge', d3.forceManyBodyReuse().strength(-(2000 / data.length)))
        .force('collide', d3.forceCollide().radius(this.settings.minRadius + 0.5))
        .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    const g = this.containers.svg.insert('g', ':first-child');
    //.attr('transform', `translate(${this.settings.orbitRadius/2},${this.settings.height/2})`);
    g.append('text')
        .attr('x', 0)
        .attr('y', -this.settings.orbitRadius / 2)
        .attr('dy', -36)
        .attr('text-anchor', 'middle')
        .text('No state changes');
    g.append('text')
        .attr('x', 0)
        .attr('y', -this.settings.orbitRadius / 2)
        .attr('dy', -16)
        .attr('text-anchor', 'middle')
        .text(`${data.length} (${d3.format('.1%')(data.length / this.data.nested.length)})`);
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
        .attr('fill', this.settings.color(0));
}
