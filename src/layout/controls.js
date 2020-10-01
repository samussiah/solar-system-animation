import addElement from './addElement';

export default function controls(main) {
    const controls = addElement('controls', main).classed('fdg-hidden', this.settings.hideControls);
    const hide = addElement('hide', controls, 'span');

    return {
        controls,
    };
}
