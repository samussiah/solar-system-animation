import addSpeedControl from './layout/addSpeedControl';

export default function layout() {
    this.container = d3
        .select(this.element)
        .append('div')
        .classed('force-directed-graph', true)
        .datum(this);
    this.controls = this.container
        .append('div')
        .classed('fdg-controls', true);
    addSpeedControl.call(this);
    this.canvas = this.container
        .append('div')
        .classed('fdg-canvas', true);
    this.svg = this.canvas
        .append('svg')
        .classed('fdg-svg', true)
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
}
