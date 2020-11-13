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
            const category =
                this.settings.colorBy.type === 'categorical'
                    ? group[0][this.settings.colorBy.variable]
                    : null;

            // Initial state for the given individual.
            const state = getState.call(this, group, 0);
            const noStateChange = group.length === 1 && state.event === this.settings.eventCentral;
            const destination =
                this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify
                    ? this.metadata.event
                          .find((event) => event.value === state.event)
                          .foci.find((focus) => focus.key === category)
                    : this.metadata.event.find((event) => event.value === state.event);
            const coordinates = { x: destination.x, y: destination.y };

            // Count number of state changes, define aesthetic, define radius, and define color.
            const colorScale =
                this.settings.colorBy.type === 'categorical'
                    ? this.metadata.strata.find((stratum) => stratum.key === category).colorScale
                    : this.colorScale;
            const datum = defineDatum.call(this, group, state, colorScale);

            return {
                group, // array of data representing all records for an individual
                duration, // full duration of individual in data
                category,
                stateprevious: null,
                state, // object representing a single record of an individual
                noStateChange, // boolean - did individual have any events? used to present those individuals in a static force layout
                coordinates,
                colorScale,
                ...datum,
            };
        })
        .entries(this.data);

    return nestedData;
}
