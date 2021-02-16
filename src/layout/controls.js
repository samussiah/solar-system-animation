export default function controls(main) {
    const controls = this.util
        .addElement('controls', main)
        .classed('fdg-hidden', this.settings.hideControls);
    const hide = this.util.addElement('hide', controls, 'span');

    return {
        controls,
        hide,
    };
}
