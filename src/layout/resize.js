import coordinates from '../defineMetadata/coordinates';
import restartForceSimulation from '../init/startInterval/restartForceSimulation';
import addStaticForceSimulation from '../init/addStaticForceSimulation';
import updateData from '../init/startInterval/update/data';

export default function resize() {
    const node = this.containers.animation.node();
    this.settings.width = node.clientWidth;
    this.settings.height = this.containers.animation.node().clientHeight;

    // timer
    this.containers.timer.width = this.containers.timer.node().clientWidth;
    this.containers.timer.svg
        .attr('width', this.containers.timer.width)
        .attr('height', this.containers.timer.width);
    this.containers.timer.arc
        .innerRadius(this.containers.timer.width / 2.25)
        .outerRadius(this.containers.timer.width / 2);
    this.containers.timer.g.attr(
        'transform',
        `translate(${this.containers.timer.width / 2},${this.containers.timer.width / 2})`
    );
    this.containers.timer.background.attr('d', this.containers.timer.arc);
    this.containers.timer.foreground.attr('d', this.containers.timer.arc);

    // background SVG
    this.containers.svgBackground
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    // canvas
    this.containers.canvas.attr('width', this.settings.width).attr('height', this.settings.height);

    // SVG
    this.containers.svgForeground
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    coordinates.call(this, this.metadata);

    // orbits
    this.orbits
        .attr('cx', (d) => d.cx)
        .attr('cy', (d) => d.cy)
        .attr('r', (d) => d.r);

    // focus coordinates
    if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
        this.metadata.event.forEach((event, i) => {
            // Update coordinates of categorical foci.
            event.foci.forEach((focus, j) => {
                focus.x = event.x + 50 * Math.cos(focus.angle);
                focus.dx = event.x + (i === 0 ? 75 : 50) * Math.cos(focus.angle);
                focus.y = event.y + 50 * Math.sin(focus.angle);
                focus.dy = event.y + (i === 0 ? 75 : 50) * Math.sin(focus.angle);
            });
            event.fociLabels
                .selectAll(`text.fdg-focus-annotation__text`)
                .attr('x', (d) => d.dx)
                .attr('y', (d) => d.dy);
        });
    }

    // Update the node data.
    updateData.call(this);
    restartForceSimulation.call(this);

    // static force simulation
    addStaticForceSimulation.call(this);

    // focus annotations
    this.focusAnnotations.attr('transform', (d) => `translate(${d.x},${d.y})`);
}
