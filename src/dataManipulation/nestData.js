import getState from './nestData/getState';
import getAestheticValues from './nestData/getAestheticValues';
import getCoordinates from './nestData/getCoordinates';
import getColorScale from './nestData/getColorScale';
import getAesthetics from './nestData/getAesthetics';

export default function nestData(data) {
    const nestedData = d3
        .nest()
        .key((d) => d.id)
        .rollup((group) => {
            // individual-level values - calculated once
            const duration = d3.sum(group, (d) => d.duration);
            const noStateChange = group.length === 1;
            const locked = false; // used to anchor individuals at a focus

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

    return nestedData;
}
