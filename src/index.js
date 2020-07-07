import defaults from './settings';
import layout from './layout';
import init from './init';

export default function forceDirectedGraph(data, element = 'body', settings = {}) {
    const fdg = {
        data,
        element,
        settings: Object.assign(defaults, settings),
    };

    layout.call(fdg);

    // Annotate concentric circles.
    fdg.svg.selectAll('circle')
        .data(fdg.settings.eventTypes.slice(1).map((d,i) => { return {cx: 380, cy: 365, r: (i+1)*100 + 50}; }))
        .enter()
        .append('circle')
        .attr('cx', d => d.cx)
        .attr('cy', d => d.cy)
        .attr('r', d => d.r)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '1');

    init.call(fdg);

    return fdg;
}
