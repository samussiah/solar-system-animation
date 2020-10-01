import runModal from '../../runModal';
import getState from '../../../dataManipulation/nestData/getState';
import defineDatum from '../../../dataManipulation/nestData/defineDatum';

export default function resetAnimation() {
    this.settings.timepoint = 0;
    this.settings.modalIndex = 0;
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

        const datum = defineDatum.call(this, d.value.group, d.value.state, d.value.statePrevious);
        Object.assign(d.value, datum);
    });

    if (this.modal) this.modal.stop();
    runModal.call(this);
}
