export default function draw(worker, color) {
    const main = this;

    worker.onmessage = function (event) {
        const className = `fdg-static--${event.data.id.replace(/[^0-9_a-z]/gi, '-')}`;
        main.containers.svgBackground.selectAll(`.${className}`).remove();
        const g = main.containers.svgBackground
            .insert('g', ':first-child')
            .classed(`fdg-static ${className}`, true)
            .attr('transform', `translate(${main.settings.widthDiff},0)`);

        // translate to the central focus
        if (main.settings.staticLayout == 'radial')
            g.attr(
                'transform',
                `translate(${main.settings.widthDiff + main.settings.orbitRadius / 2},${
                    main.settings.height / 2
                })`
            );

        const marks = g
            .selectAll('.fdg-static__mark')
            .data(event.data.nodes)
            .join(main.settings.shape === 'circle' ? 'circle' : 'rect')
            .classed('fdg-static__mark', true)
            .attr('fill', (d) => d.color)
            .attr('fill-opacity', 0.25);

        if (main.settings.shape === 'circle')
            marks
                .attr('cx', (d) => d.x)
                .attr('cy', (d) => d.y)
                .attr('r', event.data.radius);
        else
            marks
                .attr('x', (d) => d.x - event.data.radius)
                .attr('y', (d) => d.y - event.data.radius)
                .attr('width', event.data.radius * 2)
                .attr('height', event.data.radius * 2);
    };
}
