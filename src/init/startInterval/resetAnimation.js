import getState from '../../dataManipulation/nestData/getState';
import calculateInitialPointCoordinates from '../../dataManipulation/nestData/calculateInitialPointCoordinates';
import defineRadius from '../../dataManipulation/nestData/defineRadius';
import defineColor from '../../dataManipulation/nestData/defineColor';

export default function resetAnimation() {
    this.settings.timepoint = 0;
    this.controls.timepoint.inputs.attr('value', 0);

    // Update the event object of the population.
    this.metadata.event.forEach((event) => {
        event.count = 0;
        event.cumulative = 0;
    });

    this.data.nested.forEach((d) => {
        // Initial event for the given individual.
        d.value.state = getState.call(this, d.value.group, 0);

        // Reset individual event object.
        d.value.events.forEach((event) => {
            event.count = 0;
            event.duration = 0;
        });

        // Update individual event count at initial event.
        //updateEventCount.call(this, d.value.events, d.value.state.event);

        // Reset state index and timepoint of next state change.
        d.value.moves = 0;
        d.value.nextStateChange = d.value.state.duration;

        // Update population count at previous and current events.
        const populationEvent = this.metadata.event.find(
            (event) => event.value === d.value.state.event
        );

        const stateChanges = d3.sum(
            d.value.events.filter((event) => this.settings.eventChangeCount.includes(event.value)),
            (event) => event.count
        );

        // Calculate initial point coordinates.
        Object.assign(d.value, calculateInitialPointCoordinates.call(this, populationEvent));

        // Define radius.
        d.value.r = defineRadius.call(this, stateChanges);

        // Define color.
        Object.assign(d.value, defineColor.call(this, stateChanges));
    });
}
