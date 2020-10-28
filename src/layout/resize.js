import coordinates from '../defineMetadata/coordinates';
import addStaticForceSimulation from '../init/addStaticForceSimulation';
import updateData from '../init/startInterval/update/data';

export default function resize() {
    const node = this.containers.animation.node();
    this.settings.width = node.clientWidth;
    this.settings.height = this.containers.animation.node().clientHeight;

    // stopwatch
    this.containers.stopwatch.width = this.containers.stopwatch.node().clientWidth;
    this.containers.stopwatch.innerRadius = this.containers.stopwatch.width / 8;
    this.containers.stopwatch.svg
        .attr('width', this.containers.stopwatch.width)
        .attr('height', this.containers.stopwatch.width);
    this.containers.stopwatch.arc
        .innerRadius(this.containers.stopwatch.innerRadius)
        .outerRadius(this.containers.stopwatch.width / 2 - 1);
    this.containers.stopwatch.g.attr(
        'transform',
        `translate(${this.containers.stopwatch.width / 2},${this.containers.stopwatch.width / 2})`
    );
    this.containers.stopwatch.background.attr('d', this.containers.stopwatch.arc);
    this.containers.stopwatch.foreground.attr('d', this.containers.stopwatch.arc);

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

    // force simulations
    //this.metadata.event.forEach((event) => {
    //    // Update coordinates of categorical foci.
    //    if (this.settings.colorBy.type === 'categorical')
    //        event.foci.forEach((focus, i) => {
    //            focus.x = event.x + 50 * Math.cos(i * this.settings.colorBy.theta);
    //            focus.y = event.y + 50 * Math.sin(i * this.settings.colorBy.theta);
    //            const forceSimulation = event.forceSimulation.find(
    //                (forceSimulation) => forceSimulation.category === focus.key
    //            );
    //            forceSimulation.force('x', d3.forceX(focus.x).strength(0.3));
    //            forceSimulation.force('y', d3.forceY(focus.y).strength(0.3));
    //        });
    //    else
    //        event.forceSimulation.forEach((forceSimulation) => {
    //            forceSimulation
    //                .force('x', d3.forceX(event.x).strength(0.3))
    //                .force('y', d3.forceY(event.y).strength(0.3));
    //        });
    //});

    // Update the node data.
    updateData.call(this);
    this.forceSimulation
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
        );

    // static force simulation
    addStaticForceSimulation.call(this);

    // focus annotations
    this.focusAnnotations.attr('transform', (d) => `translate(${d.x},${d.y})`);
}
