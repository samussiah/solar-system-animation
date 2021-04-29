import getState from './nestData/getState';
import getAestheticValues from './nestData/getAestheticValues';
import getCoordinates from './nestData/getCoordinates';
import getColorScale from './nestData/getColorScale';
import getAesthetics from './nestData/getAesthetics';

export default function structure(data) {
    // sequenced animation (vs timed animation)
    // one interval per state
    // each interval is offset by the position of the ID in the full set of IDs:
    // - ID 001 begins at timepoint 1
    // - ID 002 begins at timepoint 2
    // - ...
    // the full duration of each ID is the number of times they change states
    // - at timepoint 0 all IDs are at s0
    // - at timepoint 1 ID 001 moves to s1
    // - at timepoint 2 ID 001 moves to s2 and ID 002 moves to s1
    // - ...
    const grouped = d3
        .nest()
        .key((d) => d.id)
        .rollup((group) => {
            // individual-level values - calculated once
            const duration = d3.sum(group, (d) => d.duration);
            const noStateChange =
                group.length === 1 && group[0].event === this.settings.eventCentral;

            // state-level values - calculated once per timepoint
            const state = getState.call(this, group, 0);
            const aestheticValues = getAestheticValues.call(this, group, state);
            const coordinates = getCoordinates.call(this, state, aestheticValues.colorValue);
            const distance = Math.sqrt(
                (coordinates.x - this.settings.center.x) ** 2 +
                    (coordinates.y - this.settings.center.y) ** 2
            );
            const colorScale = getColorScale.call(this, aestheticValues.colorValue);
            const aesthetics = getAesthetics.call(this, aestheticValues, colorScale);

            return {
                index: this.metadata.id.findIndex((id) => id.key === state.id),
                group, // array: data
                duration, // number: total duration of individual
                noStateChange, // boolean: did individual ever change state?
                stateprevious: null, // object: datum at previous timepoint
                state, // object: datum at current timepoint
                ...aestheticValues, // number/string, number, string: colorValue, sizeValue, shapeValue
                coordinates, // object: { x, y }
                distance,
                colorScale, // function: returns color given value
                ...aesthetics, // string, number, string: color, size, shape
            };
        })
        .entries(data);

    return grouped;
}
