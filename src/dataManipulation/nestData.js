import defineTimepoints from './nestData/defineTimepoints';
import getState from './nestData/getState';
import defineIndividualEvents from './nestData/defineIndividualEvents';
import updateEventCount from '../init/startInterval/updateData/updateEventCount';
import countStateChanges from './nestData/countStateChanges';
import calculateInitialPointCoordinates from './nestData/calculateInitialPointCoordinates';
import defineRadius from './nestData/defineRadius';
import defineColor from './nestData/defineColor';

export default function nestData() {
    const nestedData = d3
        .nest()
        .key((d) => d.id)
        .rollup((group) => {
            // Establish start and end timepoints for each state (mutates data array).
            defineTimepoints(group);

            // Initial state for the given individual.
            const state = getState.call(this, group, 0);

            // Define an event object for the individual.
            const individualEvents = defineIndividualEvents.call(this, group);
            const individualEvent = updateEventCount.call(this, individualEvents, state.event);

            // Update the event object of the population.
            const populationEvent = updateEventCount.call(this, this.metadata.event, state.event);

            // Calculate initial point coordinates.
            const initialPointCoordinates = calculateInitialPointCoordinates.call(
                this,
                populationEvent
            );

            // Count state changes
            const stateChanges = countStateChanges.call(this, individualEvents);

            // Define radius.
            const r = defineRadius.call(this, stateChanges);

            // Define color.
            const color = defineColor.call(this, stateChanges);

            const datum = {
                state,
                events: individualEvents,
                duration: d3.sum(group, (d) => d.duration),
                moves: 0,
                nextStateChange: state.duration,
                movesSinceChange: 0,
                group,

                // point attributes
                ...initialPointCoordinates,
                r,
                ...color,
            };

            return datum;
        })
        .entries(this.data);

    return nestedData;
}
