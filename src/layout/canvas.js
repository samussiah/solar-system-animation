export default function canvas(main) {
    const animation = this.util.addElement('animation', main);
    this.settings.width = animation.node().clientWidth;
    this.settings.height = animation.node().clientHeight;

    // progress bar at top
    const progressBar = this.util
        .addElement('progress-bar', animation)
        .classed('fdg-hidden', !this.settings.displayProgressBar);
    const progressTimepoint = this.util
        .addElement('progress-timepoint', animation)
        .classed('fdg-hidden', !this.settings.displayProgressBar);

    // background SVG
    const svgBackground = this.util
        .addElement('svg--background', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    // canvas
    const canvas = this.util
        .addElement('canvas', animation, 'canvas')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    canvas.context = canvas.node().getContext('2d');

    // SVG
    const svgForeground = this.util
        .addElement('svg--foreground', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    const focusAnnotations = this.util.addElement('focus-annotations', svgForeground, 'g');

    // modal
    const modalContainer = this.util.addElement('modal', animation);
    // TODO: add button to clear or hide modal
    //const modalClear = this.util.addElement('modal__clear', modalContainer)
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
    const modal = this.util.addElement('modal__text', modalContainer);

    return {
        animation,
        progressBar,
        progressTimepoint,
        svgBackground,
        canvas,
        svgForeground,
        focusAnnotations,
        modal,
    };
}
