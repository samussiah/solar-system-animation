import tick from './addForceSimulation/tick';

export default function addForceSimulation(event) {
    // When using D3’s force layout with a disjoint graph, you typically want the positioning
    // forces (d3.forceX and d3.forceY) instead of the centering force (d3.forceCenter). The
    // positioning forces, unlike the centering force, prevent detached subgraphs from escaping
    // the viewport.
    //
    // https://observablehq.com/@d3/disjoint-force-directed-graph?collection=@d3/d3-force
    const forceSimulation = d3
        .forceSimulation()
        .nodes(event.data)
        .alphaDecay(0.005)
        .velocityDecay(0.9)
        .force('x', d3.forceX(event.x).strength(0.3))
        .force('y', d3.forceY(event.y).strength(0.3))
        .force('charge', d3.forceManyBodyReuse().strength(-2))
        .on('tick', tick.bind(this));

    //if (event.value !== this.settings.eventCentral)
    forceSimulation.force('collide', d3.forceCollide().radius(this.settings.minRadius + 0.5));

    return forceSimulation;
}
