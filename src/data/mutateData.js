import hasVariables from './mutateData/hasVariables';
import mapVariables from './mutateData/mapVariables';
import addVariables from './mutateData/addVariables';
import orderByState from './mutateData/orderByState';
import sort from './mutateData/sort';

export default function mutateData() {
    // Check for existence of variables.
    const has = hasVariables.call(this);

    // Apply data mappings.
    mapVariables.call(this);

    // Define:
    // - start and end timepoints with duration if only duration exists
    // - duration if only start and end points exist
    // - order of states with start and end timepoints
    addVariables.call(this, has);

    // Define alternative order of events by event order and ID.
    orderByState.call(this);

    // Sort data by ID then chronologically.
    sort.call(this, has);
}
