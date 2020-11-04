import addElement from './addElement';

export default function canvas(main) {
    const animation = addElement('animation', main);
    this.settings.width = animation.node().clientWidth;
    this.settings.height = animation.node().clientHeight;

    // background SVG
    const svgBackground = addElement('svg--background', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    // canvas
    const canvas = addElement('canvas', animation, 'canvas')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    canvas.context = canvas.node().getContext('2d');

    // SVG
    const svgForeground = addElement('svg--foreground', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    const focusAnnotations = addElement('focus-annotations', svgForeground, 'g');

    // modal
    const modalContainer = addElement('modal', animation);
    // TODO: add button to clear or hide modal
    //const modalClear = addElement('modal__clear', modalContainer)
    //    //.classed('fdg-hidden', true)
    //    .text('x');
    //modalClear
    //    .on('mouseover', function() {
    //        if (this.classList.includes('fdg-hidden'))
    //            this.classList.toggle('fdg-hidden')
    //    })
    //    .on('click', () => {
    //        this.modal.stop();
    //    });
    const modal = addElement('modal__text', modalContainer);

    return {
        animation,
        svgBackground,
        canvas,
        svgForeground,
        focusAnnotations,
        modal,
    };
}
