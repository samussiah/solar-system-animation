import addElement from './addElement';
import addProgressCircle from './sidebar/addProgressCircle';
import addCountdown from './sidebar/addCountdown';

export default function sidebar(main) {
    const sidebar = addElement('sidebar', main);
    const legends = addElement('legends', sidebar);
    const progress = addElement('progress', sidebar);
    const timer = addElement('timer', progress).classed('fdg-sidebar__label', true);
    progress.circle = addProgressCircle.call(this, progress);
    //const stopwatch = addElement('stopwatch', progress, 'svg')
    //    .attr('viewBox', '0 0 100 100')
    //    .style('display', 'block')
    //    .style('width', '100%')
    //    .style('outline', 'thick solid black');
    //console.log(stopwatch.node());
    //const width = stopwatch.node().clientWidth;
    //console.log(sidebar.node().clientWidth);
    //stopwatch.append('circle')
    //    .style('fill', 'black')
    //    .attr('cx', '50%')
    //    .attr('cy', '50%')
    //    .attr('r', '50%');
    //console.log(stopwatch.node().getAttribute('viewBox'));
    //console.log(stopwatch.node().viewBox.baseVal);
    //progress.arc = d3.arc()
    //    .innerRadius(0)
    //    .outerRadius(width/2)
    //    .startAngle(0);
    //const arcPath = stopwatch
    //    .append('g')
    //    .attr('transform', `translate(50%,50%)`)
    //    .append('path')
    //    .datum({endAngle: 0 * Math.PI * 2})
    //    .style('fill', 'orange')
    //    .attr('d', progress.arc);
    const countdown = addCountdown.call(this, progress);
    const freqTable = addElement('freq-table', sidebar);

    return {
        sidebar,
        legends,
        progress,
        timer,
        //stopwatch,
        //arcPath,
        countdown,
        freqTable,
    };
}
