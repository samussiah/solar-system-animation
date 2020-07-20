import tick from './addForceLayout/tick';

export default function addForceLayout() {
    const force = d3.layout
        .force()
        .nodes(this.data.nested) // default: []
        // .links([]) default: []
        .size([this.settings.width, this.settings.height])
        //.linkStrength(0.1) // default: 0.1
        .friction(0.9) // default: 0.9
        //.linkDistance(20) // default: 20
        //.charge(-(250/this.data.nested.length)) // default: -30
        .charge(0)
        .gravity(0) // default: 0.1
        //.theta(0.8) // default: 0.8
        //.alpha(0.1) // default: 0.1
        .on('tick', tick.bind(this))
        .start();

    return force;
}
