import addElement from '../addElement';

export default function addTimer(progress) {
    const timer = addElement('timer', progress);
    timer.width = timer.node().clientWidth;
    timer.innerRadius = timer.width / 8;
    timer.svg = addElement('timer__svg', timer, 'svg')
        .attr('width', timer.width)
        .attr('height', timer.width);
    timer.arc = d3
        .arc()
        .innerRadius(timer.width / 2.25)
        .outerRadius(timer.width / 2 - 1)
        .startAngle(0);
    timer.g = addElement('timer__path', timer.svg, 'g').attr(
        'transform',
        `translate(${timer.width / 2},${timer.width / 2})`
    );
    timer.background = addElement('timer__path', timer.g, 'path')
        .classed('fdg-timer__path--background', true)
        .datum({ endAngle: 2 * Math.PI })
        .attr('d', timer.arc)
    timer.foreground = addElement('timer__path', timer.g, 'path')
        .classed('fdg-timer__path--foreground', true)
        .datum({ endAngle: 0 })
        .attr('d', timer.arc)
    timer.percentComplete = addElement('timer__percent-complete', timer.g, 'text')
        .text('0%');

    return timer;
}
