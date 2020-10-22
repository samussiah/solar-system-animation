export default function draw(worker, color) {
    const main = this;

    worker.onmessage = function (event) {
        const className = `fdg-static--${event.data.color.replace(/[^0-9_a-z]/gi, '-')}`;
        main.containers.svgBackground.selectAll(`.${className}`).remove();
        const g = main.containers.svgBackground
            .insert('g', ':first-child')
            .classed(`fdg-static ${className}`, true);

        // translate to the central focus
        if (main.settings.staticLayout == 'radial')
            g.attr(
                'transform',
                `translate(${main.settings.orbitRadius / 2},${main.settings.height / 2})`
            );

        const circles = g
            .selectAll('.fdg-static__circle')
            .data(event.data.nodes)
            .enter()
            .append('circle')
            .classed('fdg-static__circle', true)
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr('r', event.data.radius)
            .attr('fill', event.data.color)
            .attr('fill-opacity', 0.25);
    };
}
