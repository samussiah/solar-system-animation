import addSequences from './controls/addSequences';

export default function controls(main) {
    const controls = this.util.addElement('controls', main)
        .classed('fdg-hidden', this.settings.hideControls);
    const hide = this.util.addElement('hide', controls, 'span');
    const sequences = addSequences.call(this, controls);

    return {
        controls,
        sequences,
        hide
    };
}
