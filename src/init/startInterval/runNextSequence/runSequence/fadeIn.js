export default function fadeIn(selection, html) {
    return selection
        .html(html)
        .style('opacity', 0)
        .transition()
        .duration(this.settings.modalSpeed / 5)
        .style('opacity', 1);
}
