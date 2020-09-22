export default function fadeOut(transition) {
    d3.select(this).transition().duration(1000).delay(3000).style('opacity', 0);
}
