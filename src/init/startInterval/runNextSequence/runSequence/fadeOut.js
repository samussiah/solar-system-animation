export default function fadeOut(selection) {
    return selection
        .transition()
        .duration(this.settings.modalSpeed)
        .style('opacity', 0);
}
