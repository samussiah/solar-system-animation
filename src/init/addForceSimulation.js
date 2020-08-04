import tick from './addForceSimulation/tick';

export default function addForceSimulation() {
    const forceSimulation = d3.forceSimulation()
        .nodes(this.data.nested)
        .alphaDecay(.005)
        //.alphaTarget(1)
        .velocityDecay(0.9)
        .force('center', d3.forceCenter(this.settings.width/2, this.settings.height/2))
        .force('x', d3.forceX().x(d => this.metadata.event.find(event => event.value === d.value.state.event).x).strength(0.3))//Math.pow(this.data.nested.length, -.6)))
        .force('y', d3.forceY().y(d => this.metadata.event.find(event => event.value === d.value.state.event).y).strength(0.3))//Math.pow(this.data.nested.length, -.6)))
        .force('charge', d3.forceManyBodyReuse().strength(-2))
        //.force('manyBody', d3.forceManyBody().strength(-1))
        //.force('collide', d3.forceCollide().radius(d => d.value.r).strength(-.5))
        .on('tick', tick.bind(this));

    return forceSimulation;
}
