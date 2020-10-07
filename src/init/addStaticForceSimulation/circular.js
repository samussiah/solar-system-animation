import { forceManyBodyReuse } from 'd3-force-reuse';

export default function circular(data) {
    const simulation = d3
        .forceSimulation()
        .nodes(data)
        .force('center', d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2))
        .force('x', d3.forceX(this.settings.orbitRadius / 2).strength(0.3))
        .force('y', d3.forceY(this.settings.height / 2).strength(0.3))
        .force('charge', forceManyBodyReuse().strength(this.settings.chargeStrength))
        .force('collide', d3.forceCollide().radius(this.settings.minRadius + 0.5))
        .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    const g = this.containers.svgBackground.insert('g', ':first-child');
    //g.append('text')
    //    .attr('x', this.settings.orbitRadius / 2)
    //    .attr('y', this.settings.height/2)
    //    .attr('dy', -(this.settings.orbitRadius / 2)-20)
    //    .attr('text-anchor', 'middle')
    //    .text('No state changes');
    //g.append('text')
    //    .attr('x', this.settings.orbitRadius / 2)
    //    .attr('y', this.settings.height / 2)
    //    .attr('dy', -(this.settings.orbitRadius / 2))
    //    .attr('text-anchor', 'middle')
    //    .text(`${data.length} (${d3.format('.1%')(data.length / this.data.nested.length)})`);
    const nodes = g
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', this.settings.minRadius)
        .attr('fill', this.settings.color(0))
        .attr('fill-opacity', 0.25);

    return {
        simulation,
        g,
        nodes,
    };
}
