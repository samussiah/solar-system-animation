import tick from './addForceSimulation/tick';

export default function addForceSimulation(event) {
    //const forceSimulation = d3
    //    .forceSimulation()
    //    .nodes(this.data.nested)
    //    .alphaDecay(0.005)
    //    //.alphaTarget(1)
    //    .velocityDecay(0.9)
    //    .force('center', d3.forceCenter(this.settings.width / 2, this.settings.height / 2))
    //    .force(
    //        'x',
    //        d3
    //            .forceX()
    //            .x(
    //                (d) =>
    //                    this.metadata.event.find((event) => event.value === d.value.state.event).x
    //            )
    //            .strength(0.3)
    //    ) //Math.pow(this.data.nested.length, -.6)))
    //    .force(
    //        'y',
    //        d3
    //            .forceY()
    //            .y(
    //                (d) =>
    //                    this.metadata.event.find((event) => event.value === d.value.state.event).y
    //            )
    //            .strength(0.3)
    //    ) //Math.pow(this.data.nested.length, -.6)))
    //    .force('charge', d3.forceManyBodyReuse().strength(-2))
    //    //.force('manyBody', d3.forceManyBody().strength(-1))
    //    //.force('collide', d3.forceCollide().radius(d => d.value.r).strength(-.5))
    //    .on('tick', tick.bind(this));

    const forceSimulation = d3
        .forceSimulation()
        .nodes(event.data)
        .alphaDecay(0.005)
        .velocityDecay(0.9)
        .force('center', d3.forceCenter(event.x, event.y))
        .force('x', d3.forceX(event.x).strength(0.3))
        .force('y', d3.forceY(event.y).strength(0.3))
        .force('charge', d3.forceManyBodyReuse().strength(-2))
        .on('tick', tick.bind(this));

    if (event.value !== this.settings.eventCentral)
        forceSimulation.force('collide', d3.forceCollide().radius(this.settings.minRadius + .5));

    return forceSimulation;
}
