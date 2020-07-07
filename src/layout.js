export default function layout() {
    this.container = d3.select(this.element).append('div').classed('force-directed-graph', true).datum(this);
    this.svg = this.container
        .append('svg')
        .classed('fdg-svg', true)
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
}
