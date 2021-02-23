import coordinates from '../defineMetadata/coordinates';
import restartForceSimulation from '../init/startInterval/restartForceSimulation';
import addStaticForceSimulation from '../init/addStaticForceSimulation';
import updateData from '../init/startInterval/update/data';

// TODO: modularize this function with declaritive subfunctions
export default function resize() {
    this.settings.width.main = this.layout.main.node().clientWidth;
    this.settings.height.main = this.layout.main.node().clientHeight;
    this.settings.width.sidebar = this.layout.sidebarContainer.node().clientWidth;
    this.settings.width.canvas = this.layout.canvasContainer.node().clientWidth;

    // timer
    this.layout.timer.width = this.layout.timer.node().clientWidth;
    this.layout.timer.svg
        .attr('width', this.layout.timer.width)
        .attr('height', this.layout.timer.width);
    this.layout.timer.arc
        .innerRadius(this.layout.timer.width / 2.25)
        .outerRadius(this.layout.timer.width / 2);
    this.layout.timer.g.attr(
        'transform',
        `translate(${this.layout.timer.width / 2},${this.layout.timer.width / 2})`
    );
    this.layout.timer.background.attr('d', this.layout.timer.arc);
    this.layout.timer.foreground.attr('d', this.layout.timer.arc);

    // background SVG
    this.layout.svgBackground
        .attr('width', this.settings.width.main)
        .attr('height', this.settings.height.main)
        .style('left', -this.settings.width.sidebar);

    // canvas
    this.layout.canvas
        .attr('width', this.settings.width.canvas)
        .attr('height', this.settings.height.main);

    // SVG
    this.layout.svgForeground
        .attr('width', this.settings.width.canvas)
        .attr('height', this.settings.height.main);

    coordinates.call(this, this.metadata);

    // orbits
    this.orbits
        .attr('cx', (d) => d.cx)
        .attr('cy', (d) => d.cy)
        .attr('r', (d) => d.r);
    this.layout.svgBackground
        .select('g.fdg-g--orbits')
        .attr('transform', `translate(${this.settings.width.sidebar},0)`);

    // focus coordinates
    if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
        this.metadata.event.forEach((event, i) => {
            // Update coordinates of categorical foci.
            event.foci.forEach((focus, j) => {
                focus.x = event.x + 50 * Math.cos(focus.angle);
                focus.dx = event.x + (i === 0 ? 75 : 50) * Math.cos(focus.angle);
                focus.y = event.y + 50 * Math.sin(focus.angle);
                focus.dy = event.y + (i === 0 ? 75 : 50) * Math.sin(focus.angle);

                // Position stratum foci along orbits rather than on a circle at event focus.
                if (this.settings.stratificationPositioning === 'orbital') {
                    focus.theta =
                        event.theta +
                        ((this.settings.arcLength * this.settings.offsets[j]) /
                            (2 * Math.PI * event.radius)) *
                            360;

                    // Define position along orbit on which the stratum focus will appear.
                    focus.x =
                        event.order === 0
                            ? focus.x
                            : this.settings.center.x +
                              event.radius * // number of orbit radii from the center
                                  Math.cos(focus.theta); // position along the circle at the given orbit along which
                    focus.dx = focus.x;
                    focus.y =
                        event.order === 0
                            ? focus.y
                            : this.settings.center.y +
                              event.radius * // number of orbit radii from the center
                                  Math.sin(focus.theta); // y-position of the along the given orbit at which the focus circle at the
                    focus.dy = focus.y;
                }
            });
            event.fociLabels
                .selectAll(`text.fdg-focus-annotation__text`)
                .attr('x', (d) => d.dx)
                .attr('y', (d) => d.dy);
        });
    }

    // Update the node data.
    updateData.call(this, this.sequence ? this.sequence.data : this.data);
    restartForceSimulation.call(this);

    // static force simulation
    addStaticForceSimulation.call(this);

    // focus annotations
    this.focusAnnotations.attr('transform', (d) => `translate(${d.x},${d.y})`);

    // custom annotations
    if (this.customAnnotations) {
        this.settings.annotations.forEach((annotation) => {
            annotation.radius = annotation.orbit * this.settings.orbitRadius;
            annotation.theta = (2 * Math.PI * annotation.angle) / 360;
            annotation.x =
                this.settings.center.x +
                annotation.radius * // number of orbit radii from the center
                    Math.cos(annotation.theta); // position along the circle at the given orbit along which
            annotation.y =
                annotation.order === 0
                    ? this.settings.center.y
                    : this.settings.center.y +
                      annotation.radius * // number of orbit radii from the center
                          Math.sin(annotation.theta); // y-position of the along the given orbit at which the focus circle at the
        });
        this.customAnnotations.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }
}
