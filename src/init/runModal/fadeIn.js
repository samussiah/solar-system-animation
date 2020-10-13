import fadeOut from './fadeOut';

export default function fadeIn(selection, modalSpeed) {
    // Transition text from zero opacity to full opacity to create fade-in effect.
    selection
        .style('opacity', 0)
        .transition()
        .duration(modalSpeed / 15)
        .style('opacity', 1)
        .on('end', function () {
            fadeOut.call(this, modalSpeed);
        });
}
