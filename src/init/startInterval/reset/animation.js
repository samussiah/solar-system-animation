import runModal from '../../runModal';
import getState from '../../../dataManipulation/nestData/getState';

// TODO: reset data as in nestData and update/data
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

        const event = this.metadata.event.find((event) => event.value === d.value.state.event);
        d.value.coordinates = { x: event.x, y: event.y };

        const datum = defineDatum.call(this, d.value.group, d.value.state, d.value.colorScale);
        Object.assign(d.value, datum);
    });

    if (this.modal) this.modal.stop();
    runModal.call(this);
}
