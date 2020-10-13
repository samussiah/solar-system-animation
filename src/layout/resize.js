import coordinates from '../defineMetadata/coordinates';

export default function resize() {
    const node = this.containers.animation.node();
    this.settings.width = node.clientWidth;
    this.settings.height = this.containers.animation.node().clientHeight;

    // background SVG
    this.containers.svgBackground
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    // canvas
    this.containers.canvas.attr('width', this.settings.width).attr('height', this.settings.height);

    // SVG
    this.containers.svgForeground
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    coordinates.call(this, this.metadata);

    // orbits
    this.orbits
        .attr('cx', (d) => d.cx)
        .attr('cy', (d) => d.cy)
        .attr('r', (d) => d.r);

    // static force simulation
    this.staticForceSimulation.simulation
        .force('center', d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2))
        .force('x', d3.forceX(this.settings.orbitRadius / 2).strength(0.3))
        .force('y', d3.forceY(this.settings.height / 2).strength(0.3));
    for (let i = 0; i < 30; i++) this.staticForceSimulation.simulation.tick();
    this.staticForceSimulation.nodes.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

    // force simulations
    this.metadata.event.forEach((event) => {
        // Update coordinates of categorical foci.
        if (this.settings.colorBy.type === 'categorical')
            event.foci.forEach((focus, i) => {
                focus.x = event.x + 50 * Math.cos(i * this.settings.colorBy.theta);
                focus.y = event.y + 50 * Math.sin(i * this.settings.colorBy.theta);
                const forceSimulation = event.forceSimulation.find(
                    (forceSimulation) => forceSimulation.category === focus.key
                );
                forceSimulation.force('x', d3.forceX(focus.x).strength(0.3));
                forceSimulation.force('y', d3.forceY(focus.y).strength(0.3));
            });
        else
            event.forceSimulation.forEach((forceSimulation) => {
                forceSimulation
                    .force('x', d3.forceX(event.x).strength(0.3))
                    .force('y', d3.forceY(event.y).strength(0.3));
            });
    });

    // focus annotations
    this.focusAnnotations.attr('transform', (d) => `translate(${d.x},${d.y})`);
}
