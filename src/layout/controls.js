import addElement from './addElement';

export default function controls(main) {
    const controls = addElement('controls', main).classed('fdg-hidden', this.settings.hideControls);

    return {
        controls,
    };
}
