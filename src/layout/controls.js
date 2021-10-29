export default function controls(main) {
    const container = this.util
        .addElement('controls', main)
        .classed('fdg-hidden', this.settings.hideControls);
    const hide = this.util.addElement('hide', container, 'span');

    return {
        controlsContainer: container,
        hide,
    };
}
