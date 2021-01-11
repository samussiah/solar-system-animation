import runModal from '../../runModal';
import getState from '../../../dataManipulation/nestData/getState';
import getAestheticValues from '../../../dataManipulation/nestData/getAestheticValues';
import getCoordinates from '../../../dataManipulation/nestData/getCoordinates';
import getColorScale from '../../../dataManipulation/nestData/getColorScale';
import getAesthetics from '../../../dataManipulation/nestData/getAesthetics';

// TODO: reset data as in nestData and update/data
export default function resetAnimation() {
    this.settings.timepoint = 0;
    this.settings.progress = 0;
    this.settings.modalIndex = 0;
    this.controls.timepoint.inputs.attr('value', 0);

    // Update the event object of the population.
    this.metadata.event.forEach((event) => {
        event.prevCount = 0;
        event.count = 0;
        event.cumulative = 0;
    });

    this.data.nested.forEach((d) => {
        d.value.statePrevious = null;
        d.value.state = getState.call(this, d.value.group);

        const aestheticValues = getAestheticValues.call(this, d.value.group, d.value.state);
        d.value.coordinates = getCoordinates.call(this, d.value.state, aestheticValues.colorValue);
        d.value.colorScale = getColorScale.call(this, aestheticValues.colorValue);
        const aesthetics = getAesthetics.call(this, aestheticValues, d.value.colorScale);

        Object.assign(d.value, aestheticValues, aesthetics);
    });

    if (this.modal) this.modal.stop();
    runModal.call(this);
}
