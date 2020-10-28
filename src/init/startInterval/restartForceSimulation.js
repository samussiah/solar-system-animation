export default function restartForceSimulation() {
    // Remove centering force after first interval.
    if (this.settings.timepoint === 1) this.forceSimulation.force('center', null);

    // Reheat the simulation (alpha(1)) and update the coordinates of the x- and y- forces.
    this.forceSimulation
        .alpha(1)
        .force(
            'x',
            d3
                .forceX()
                .x((d) => d.value.coordinates.x)
                .strength(0.3)
        )
        .force(
            'y',
            d3
                .forceY()
                .y((d) => d.value.coordinates.y)
                .strength(0.3)
        )
        .restart();
}
