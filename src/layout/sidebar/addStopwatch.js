import addElement from '../addElement';

export default function addStopwatch(progress) {
    const stopwatch = addElement('stopwatch', progress).style('width', '100%');
    stopwatch.width = stopwatch.node().clientWidth;
    stopwatch.innerRadius = stopwatch.width / 8;
    stopwatch.svg = addElement('stopwatch__svg', stopwatch, 'svg')
        .attr('width', stopwatch.width)
        .attr('height', stopwatch.width);
    stopwatch.arc = d3
        .arc()
        .innerRadius(stopwatch.innerRadius)
        .outerRadius(stopwatch.width / 2 - 1)
        .cornerRadius(12)
        .startAngle(0);
    stopwatch.g = addElement('stopwatch__path', stopwatch.svg, 'g').attr(
        'transform',
        `translate(${stopwatch.width / 2},${stopwatch.width / 2})`
    );
    stopwatch.background = addElement('stopwatch__path', stopwatch.g, 'path')
        .datum({ endAngle: 2 * Math.PI })
        .attr('d', stopwatch.arc)
        .style('fill', 'white')
        .style('stroke', 'black')
        .style('stroke-width', 0.5);
    stopwatch.foreground = addElement('stopwatch__path', stopwatch.g, 'path')
        .datum({ endAngle: 0 })
        .attr('d', stopwatch.arc)
        .style('fill', '#a6d96a')
        //.style('fill-opacity', .5)
        .style('stroke', 'black')
        .style('stroke-width', 0.5);
    stopwatch.percentBackground = addElement('stopwatch__text', stopwatch.g, 'text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-weight', 'bold')
        .style('stroke', 'white')
        .style('stroke-width', '4px')
        .text('0%');
    stopwatch.percentForeground = addElement('stopwatch__text', stopwatch.g, 'text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-weight', 'bold')
        //.style('stroke', 'black')
        //.style('stroke-width', '2px')
        .text('0%');

    return stopwatch;
}
