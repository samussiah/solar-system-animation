export default function pulseOrbits() {
    const fdg = this;

    if (this.settings.pulseOrbits) {
        this.orbits.each(function (d) {
            d.change = d3.sum(d.values, (di) => di.change);
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
}
