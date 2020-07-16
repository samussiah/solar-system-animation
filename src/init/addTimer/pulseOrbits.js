export default function pulseOrbits() {
    const fdg = this;

    this.orbits.each(function (d) {
        if (d.change > 0) {
            d3.select(this)
                .transition()
                .duration(fdg.settings.speeds[fdg.settings.speed] / 2)
                .attr('stroke-width', 0.5 * d.change)
                .transition()
                .duration(fdg.settings.speeds[fdg.settings.speed] / 2)
                .attr('stroke-width', 0.5);
        }
    });
}
