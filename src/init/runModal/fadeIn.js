import fadeOut from './fadeOut';

export default function fadeIn(selection) {
    selection
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .on('end', fadeOut);
}
