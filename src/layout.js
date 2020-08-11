import addControls from './layout/addControls';
import addLegends from './layout/addLegends';
import drawOrbits from './layout/drawOrbits';
import annotateFoci from './layout/annotateFoci';

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
    this.notes = this.container.append('div').classed('fdg-notes', true);

    // main panel
    this.container = this.container.append('div').classed('fdg-container', true);

    // canvas underlay
    this.canvas = this.container
        .append('canvas')
        .classed('fdg-canvas', true)
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    this.context = this.canvas.node().getContext('2d');

    // SVG overlay
    this.svg = this.container
        .append('svg')
        .classed('fdg-svg', true)
        .attr('width', this.settings.width + 200)
        .attr('height', this.settings.height + 200);

    // Draw concentric circles.
    this.orbits = drawOrbits.call(this);

    // Annotate foci.
    this.focusAnnotations = annotateFoci.call(this);
}
