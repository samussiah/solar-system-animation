import { forceManyBodyReuse } from 'd3-force-reuse';
import { forceManyBodySampled } from 'd3-force-sampled';
import tick from './addForceSimulation/tick';

export default function addForceSimulation(data, x, y) {
    // When using D3’s force layout with a disjoint graph, you typically want the positioning
    // forces (d3.forceX and d3.forceY) instead of the centering force (d3.forceCenter). The
    // positioning forces, unlike the centering force, prevent detached subgraphs from escaping
    // the viewport.
    //
    // https://observablehq.com/@d3/disjoint-force-directed-graph?collection=@d3/d3-force
    const forceSimulation = d3
        .forceSimulation()
        //.nodes(event.data.filter((d) => !d.value.noStateChange))
        .nodes(data)
        .alphaDecay(0.01)
        //.alphaMin(.75)
        //.alphaTarget(.8)
        .velocityDecay(0.9)
        .force('center', d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2))
        .force('x', d3.forceX(x).strength(0.3))
        .force('y', d3.forceY(y).strength(0.3))
        .force('charge', forceManyBodyReuse().strength(this.settings.chargeStrength))
        //.force('charge', forceManyBodySampled().strength(this.settings.chargeStrength*2))
        .on('tick', tick.bind(this));

    //if (event.value !== this.settings.eventCentral)
    forceSimulation.force(
        'collide',
        //d3.forceCollide().radius((d) => d.value.r + 0.5)
        d3.forceCollide().radius(this.settings.minRadius + 1)
    );

    return forceSimulation;
}
