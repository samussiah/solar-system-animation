import hasVariables from './mutateData/hasVariables';
import mapVariables from './mutateData/mapVariables';
import addVariables from './mutateData/addVariables';
import sort from './mutateData/sort';

export default function mutateData() {
    // Check for existence of variables.
    const has = hasVariables.call(this);

    // Apply data mappings.
    mapVariables.call(this);

    // Define duration, sequence, and/or start and end timepoints.
    addVariables.call(this, has);

    // Sort data by id and sequence.
    sort.call(this);
}
