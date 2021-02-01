export default function canvas(main) {
    const animation = this.util.addElement('animation', main);
    this.settings.width = animation.node().clientWidth;
    this.settings.height = animation.node().clientHeight;

    // progress bar
    const progressBar = this.util
        .addElement('progress-bar', animation)
        .classed('fdg-hidden', !this.settings.displayProgressBar);
    const progressTimepoint = this.util
        .addElement('progress-timepoint', animation)
        .classed('fdg-hidden', !this.settings.displayProgressBar);

    // background SVG - orbits
    const svgBackground = this.util
        .addElement('svg--background', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    // canvas - bubbles
    const canvas = this.util
        .addElement('canvas', animation, 'canvas')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    canvas.context = canvas.node().getContext('2d');

    // foreground SVG - annotations
    const svgForeground = this.util
        .addElement('svg--foreground', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    const sequenceOverlay = this.util.addElement('sequence-overlay', svgForeground, 'g')
        .classed('fdg-focus-annotation', true)
        .attr('transform', 'translate(20,20)');
    sequenceOverlay.background = this.util.addElement('sequence-overlay__background', sequenceOverlay, 'text')
        .classed('fdg-focus-annotation__background fdg-focus-annotation__text', true)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.background.sequence = this.util.addElement('sequence-overlay__background__sequence', sequenceOverlay.background, 'tspan')
        .classed('fdg-focus-annotation__label', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.background.event = this.util.addElement('sequence-overlay__background__event', sequenceOverlay.background, 'tspan')
        .classed('fdg-focus-annotation__event-count', true)
        .attr('x', 0)
        .attr('y', 30)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.foreground = this.util.addElement('sequence-overlay__foreground', sequenceOverlay, 'text')
        .classed('fdg-focus-annotation__foreground fdg-focus-annotation__text', true)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.foreground.sequence = this.util.addElement('sequence-overlay__foreground__sequence', sequenceOverlay.foreground, 'tspan')
        .classed('fdg-focus-annotation__label', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.foreground.event = this.util.addElement('sequence-overlay__foreground__event', sequenceOverlay.foreground, 'tspan')
        .classed('fdg-focus-annotation__event-count', true)
        .attr('x', 0)
        .attr('y', 30)
        .attr('alignment-baseline', 'hanging');
    const focusAnnotations = this.util.addElement('focus-annotations', svgForeground, 'g');

    // modal
    const modalContainer = this.util.addElement('modal', animation)
        .attr('class', d => `fdg-modal ${
            this.settings.modalPosition
                .split('-')
                .map(position => `fdg-modal--${position}`)
                .join(' ')
        } fdg-modal--${this.settings.modalPosition}`)
        .style('width', /^\d{1,3}%$/.test(this.settings.modalWidth)
            ? this.settings.modalWidth
            : '50%'
        );
    const modal = this.util.addElement('modal__text', modalContainer);

    return {
        animation,
        progressBar,
        progressTimepoint,
        svgBackground,
        canvas,
        svgForeground,
        sequenceOverlay,
        focusAnnotations,
        modal,
    };
}
