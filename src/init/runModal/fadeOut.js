export default function fadeOut(modalSpeed) {
    // Transition text from full opacity to zero opacity to create fade-out effect.
    d3.select(this)
        .transition()
        .duration(modalSpeed / 15)
        .delay(modalSpeed - (modalSpeed / 15) * 2)
        .style('opacity', 0);
}
