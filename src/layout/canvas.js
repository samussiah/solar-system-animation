export default function canvas(main) {
    const container = this.util.addElement('animation', main);
    this.settings.width.canvas = container.node().clientWidth;

    // background SVG - orbits
    const svgBackground = this.util
        .addElement('svg--background', container, 'svg')
        .attr('width', this.settings.width.main)
        .attr('height', this.settings.height.main)
        .style('position', 'absolute')
        .style('left', -this.settings.width.sidebar)
        .style('top', 0);

    // canvas - bubbles
    const canvas = this.util
        .addElement('canvas', container, 'canvas')
        .attr('width', this.settings.width.canvas)
        .attr('height', this.settings.height.main);
    canvas.context = canvas.node().getContext('2d');

    // foreground SVG - annotations
    const svgForeground = this.util
        .addElement('svg--foreground', container, 'svg')
        .attr('width', this.settings.width.canvas)
        .attr('height', this.settings.height.main);
    const sequenceOverlay = this.util
        .addElement('sequence-overlay', svgForeground, 'g')
        .classed('fdg-focus-annotation', true)
        .attr('transform', 'translate(20,20)');
    sequenceOverlay.background = this.util
        .addElement('sequence-overlay__background', sequenceOverlay, 'text')
        .classed('fdg-focus-annotation__background fdg-focus-annotation__text', true)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.background.sequence = this.util
        .addElement('sequence-overlay__background__sequence', sequenceOverlay.background, 'tspan')
        .classed('fdg-focus-annotation__label', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.background.event = this.util
        .addElement('sequence-overlay__background__event', sequenceOverlay.background, 'tspan')
        .classed('fdg-focus-annotation__event-count', true)
        .attr('x', 0)
        .attr('y', 30)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.foreground = this.util
        .addElement('sequence-overlay__foreground', sequenceOverlay, 'text')
        .classed('fdg-focus-annotation__foreground fdg-focus-annotation__text', true)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.foreground.sequence = this.util
        .addElement('sequence-overlay__foreground__sequence', sequenceOverlay.foreground, 'tspan')
        .classed('fdg-focus-annotation__label', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('alignment-baseline', 'hanging');
    sequenceOverlay.foreground.event = this.util
        .addElement('sequence-overlay__foreground__event', sequenceOverlay.foreground, 'tspan')
        .classed('fdg-focus-annotation__event-count', true)
        .attr('x', 0)
        .attr('y', 30)
        .attr('alignment-baseline', 'hanging');
    const customAnnotations = this.util.addElement('custom-annotations', svgForeground, 'g');
    const focusAnnotations = this.util.addElement('focus-annotations', svgForeground, 'g');

    // modal
    const modalContainer = this.util
        .addElement('modal', container)
        .attr(
            'class',
            (d) =>
                `fdg-modal ${this.settings.modalPosition
                    .split('-')
                    .map((position) => `fdg-modal--${position}`)
                    .join(' ')} fdg-modal--${this.settings.modalPosition}`
        )
        .classed('fdg-hidden', this.settings.text.length === 0)
        .style(
            'width',
            /^\d{1,3}%$/.test(this.settings.modalWidth) ? this.settings.modalWidth : '50%'
        );
    const modal = this.util.addElement('modal__text', modalContainer);

    // footnotes
    const footnotes = this.util.addElement('footnotes', container);
    footnotes
        .selectAll('div.fdg-footnote')
        .data(this.settings.footnotes)
        .join('div')
        .classed('fdg-footnote', true)
        .html((d) => d);

    return {
        canvasContainer: container,
        svgBackground,
        canvas,
        svgForeground,
        sequenceOverlay,
        focusAnnotations,
        customAnnotations,
        modal,
        footnotes,
    };
}
