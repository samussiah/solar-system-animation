import getState from './nestData/getState';
//import countStateChanges from './nestData/countStateChanges';
//import defineRadius from './nestData/defineRadius';
//import defineColor from './nestData/defineColor';
import defineDatum from './nestData/defineDatum';

export default function nestData() {
    const nestedData = d3
        .nest()
        .key((d) => d.id)
        .rollup((group) => {
            const duration = d3.sum(group, (d) => d.duration);

            // Initial state for the given individual.
            const statePrevious = null;
            const state = getState.call(this, group, 0);
            const noStateChange = group.length === 1 && state.event === this.settings.eventCentral;

            // Count number of state changes, define aesthetic, define radius, and define color.
            const datum = defineDatum.call(this, group, state, statePrevious);

            return {
                group, // array of data representing all records for an individual
                duration: d3.sum(group, (d) => d.duration), // full duration of individual in data
                statePrevious,
                state, // object representing a single record of an individual
                noStateChange, // boolean - did individual have any events? used to present those individuals in a static force layout
                ...datum,
            };
        })
        .entries(this.data);

    return nestedData;
}
