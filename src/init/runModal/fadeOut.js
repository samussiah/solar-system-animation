export default function fadeOut(modalSpeed) {
    d3.select(this)
        .transition()
        .duration(modalSpeed / 15)
        .delay(modalSpeed - (modalSpeed / 15) * 2)
        .style('opacity', 0);
}
