import addControls from './layout/addControls';
import addOrbits from './layout/addOrbits';
import addLegends from './layout/addLegends';

export default function layout() {
    this.container = d3
        .select(this.element)
        .append('div')
        .classed('force-directed-graph', true)
        .datum(this);

    // controls
    addControls.call(this);

    // side panel
    this.timer = this.container
        .append('div')
        .classed('fdg-timer', true)
        .text(`${this.settings.timepoint} ${this.settings.timeUnit}`);
    addLegends.call(this);
    this.annotations = this.container.append('div').classed('fdg-annotations', true);

    // main panel
    this.canvas = this.container.append('div').classed('fdg-canvas', true);
    this.svg = this.canvas
        .append('svg')
        .classed('fdg-svg', true)
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    this.orbits = addOrbits.call(this);
}
