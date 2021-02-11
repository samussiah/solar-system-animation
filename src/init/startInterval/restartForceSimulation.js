export default function restartForceSimulation() {
    // Remove centering force after first interval.
    if (
        !!this.forceSimulation &&
        !!this.forceSimulation.force('center') &&
        this.settings.removeCenterForce === true
    )
        this.forceSimulation.force('center', null);

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
        .force(
            'collide',
            d3.forceCollide().radius((d) => d.value.size + this.settings.collisionPadding)
        )
        .restart();
}
