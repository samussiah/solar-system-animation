import tick from './addForceLayout/tick';

export default function addForceLayout() {
    const force = d3.layout
        .force()
        .nodes(this.nodes)
        // .links([])
        .size([this.settings.width, this.settings.height])
        .gravity(0)
        .charge(0)
        .friction(0.9)
        .on('tick', tick.bind(this))
        .start();

    return force;
}
