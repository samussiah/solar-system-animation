import getState from './nestData/getState';
import countStateChanges from './nestData/countStateChanges';
import defineRadius from './nestData/defineRadius';
import defineColor from './nestData/defineColor';

export default function nestData() {
    const nestedData = d3
        .nest()
        .key((d) => d.id)
        .rollup((group) => {
            const noStateChange = group.length === 1 && state.event === this.settings.eventCentral;
            const duration = d3.sum(group, (d) => d.duration);

            // Initial state for the given individual.
            const state = getState.call(this, group, 0);

            // Count state changes.
            const nStateChanges = countStateChanges.call(this, group);

            // Define radius.
            const r = defineRadius.call(this, nStateChanges);

            // Define color.
            const color = defineColor.call(this, nStateChanges);

            return {
                group, // array of data representing all records for an individual
                noStateChange, // boolean - did individual have any events? used to present those individuals in a static force layout
                duration: d3.sum(group, (d) => d.duration), // full duration of individual in data
                state, // object representing a single record of an individual
                nStateChanges, // number of state changes the indivdual has experienceda thus far
                r, // radius of bubble
                ...color, // color/fill/stroke of bubble
            };
        })
        .entries(this.data);

    return nestedData;
}
