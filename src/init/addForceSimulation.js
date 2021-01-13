import { forceManyBodyReuse } from 'd3-force-reuse';
import { forceManyBodySampled } from 'd3-force-sampled';
import tick from './addForceSimulation/tick';

// When using D3’s force layout with a disjoint graph, you typically want the positioning
// forces (d3.forceX and d3.forceY) instead of the centering force (d3.forceCenter). The
// positioning forces, unlike the centering force, prevent detached subgraphs from escaping
// the viewport.
//
// https://observablehq.com/@d3/disjoint-force-directed-graph?collection=@d3/d3-force

export default function addForceSimulation(data) {
    const forceSimulation = d3
        .forceSimulation()
        .nodes(
            data.nested.filter(
                (d) => !(this.settings.drawStaticSeparately && d.value.noStateChange)
            )
        )
        .alphaDecay(0.01)
        .velocityDecay(0.9)
        .force('center', d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2)) // cleared after first interval
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
            'charge',
            this.settings.manyBody === 'forceManyBodyReuse'
                ? forceManyBodyReuse().strength(this.settings.chargeStrength)
                : this.settings.manyBody === 'forceManyBodySampled'
                ? forceManyBodySampled().strength(
                      (this.settings.chargeStrength * this.metadata.id.length) / 1000
                  )
                : d3.forceManyBody().strength(this.settings.chargeStrength)
        )
        .force(
            'collide',
            d3.forceCollide().radius((d) => d.value.size + this.settings.collisionPadding)
        )
        .on('tick', tick.bind(this, data));

    return forceSimulation;
}
