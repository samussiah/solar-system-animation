import runModal from '../../runModal';
import getState from '../../../dataManipulation/nestData/getState';
import countStateChanges from '../../../dataManipulation/nestData/countStateChanges';
import defineRadius from '../../../dataManipulation/nestData/defineRadius';
import defineColor from '../../../dataManipulation/nestData/defineColor';

export default function resetAnimation() {
    this.settings.timepoint = 0;
    this.settings.notesIndex = 0;
    this.controls.timepoint.inputs.attr('value', 0);

    // Update the event object of the population.
    this.metadata.event.forEach((event) => {
        event.prevCount = 0;
        event.count = 0;
        event.cumulative = 0;
    });

    this.data.nested.forEach((d) => {
        // Initial event for the given individual.
        d.value.statePrevious = null;
        d.value.state = getState.call(this, d.value.group, 0);

        // Count state changes.
        d.value.nStateChanges = countStateChanges.call(this, d.value.group);

        // Define radius.
        d.value.r = defineRadius.call(this, d.value.nStateChanges);

        // Define color.
        Object.assign(d.value, defineColor.call(this, d.value.nStateChanges));
    });

    if (this.modal) this.modal.stop();
    runModal.call(this);
}
