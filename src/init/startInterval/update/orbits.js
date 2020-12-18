export default function orbits() {
    const main = this;

    //if (this.settings.pulseOrbits) {
    this.orbits.each(function (d) {
        d.rAdjPrev = d.rAdj;
        const distances = d3.merge(d.values.map((di) => di.data)).map((d) => d.value.distance);
        const rAdj = distances.length ? Math.max(d3.median(distances), d.r) : d.r;
        const diff = rAdj - d.rAdjPrev;
        d.rAdj = d.rAdjPrev + Math.min(diff / 10, main.settings.orbitRadius / 100);
        //d.change = d3.sum(d.values, (di) => di.change);
        //if (d.change > 0) {
        d3.select(this)
            .transition()
            .duration(main.settings.speeds[main.settings.speed])
            .attr('r', d.rAdj);
        //.duration(main.settings.speeds[main.settings.speed] / 2)
        //.attr('stroke-width', 0.5 * d.change)
        //.transition()
        //.duration(main.settings.speeds[main.settings.speed] / 2)
        //.attr('stroke-width', 0.5);
        //}
    });
    //}
}
