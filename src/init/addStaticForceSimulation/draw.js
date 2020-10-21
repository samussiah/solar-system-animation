export default function draw(worker) {
    const main = this;

    worker.onmessage = function(event) {
        const g = main.containers.svgBackground
            .insert('g', ':first-child')
            .classed('fdg-static', true);

        // translate to the central focus
        if (main.settings.staticLayout == 'radial')
            g.attr('transform', `translate(${main.settings.orbitRadius / 2},${main.settings.height / 2})`);

        const circles = g
            .selectAll('.fdg-static__circle')
            .data(event.data)
            .enter()
            .append('circle')
            .classed('fdg-static__circle', true)
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr('r', main.settings.minRadius)
            .attr('fill', main.settings.color(0))
            .attr('fill-opacity', 0.25);
    };
}
