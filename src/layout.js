import addSpeedControl from './layout/addSpeedControl';
import addOrbits from './layout/addOrbits';

export default function layout() {
    this.container = d3
        .select(this.element)
        .append('div')
        .classed('force-directed-graph', true)
        .datum(this);
    addSpeedControl.call(this);
    this.svg = this.container
        .append('svg')
        .classed('fdg-svg', true)
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    addOrbits.call(this);
}
