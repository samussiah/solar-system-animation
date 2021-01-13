import filterData from './eventMetadata/filterData';
import updateIdSet from './eventMetadata/updateIdSet';
import countCumulative from './eventMetadata/countCumulative';

import getFreqs from '../../../../defineMetadata/freqTable/getFreqs';
import formatValues from '../../../../defineMetadata/freqTable/formatValues';
import defineCellValues from '../../../../defineMetadata/freqTable/defineCellValues';

// Update states and strata at each timepoint.
export default function eventMetadata(data) {
    this.metadata.event.forEach((event) => {
        // Subset data on individuals in the given state.
        event.data = filterData(data.nested, ['value', 'state', 'event'], event.key);

        // Update current set of individuals.
        event.ids = updateIdSet(event.data, event.ids);
        event.nIds = event.ids.size;

        // Update cumulative set of individuals.
        updateIdSet(event.data, event.idsCumulative, true);
        event.nIdsCumulative = event.idsCumulative.size;

        // Update cumulative number of events.
        event.nEvents = countCumulative(data, this.settings.timepoint, event.key);

        // Calculate numerators, denominators, and proportions.
        event.freqs = getFreqs.call(this, event, event, this.metadata);
        event.fmt = formatValues.call(this, event);

        // Calculate the change in IDs in the given state from the previous timepoint.
        event.change = event.nIds - event.nIdsPrevious;

        if (event.foci)
            event.foci.forEach((focus) => {
                // Subset data on individuals in the given state and stratum.
                focus.data = filterData(event.data, ['value', 'colorValue'], focus.key);

                // Update current set of individuals.
                focus.ids = updateIdSet(focus.data, focus.ids);
                focus.nIds = focus.ids.size;

                // Update cumulative set of individuals.
                updateIdSet(focus.data, focus.idsCumulative, true);
                focus.nIdsCumulative = focus.idsCumulative.size;

                // Update cumulative number of events.
                focus.nEvents = countCumulative(data, this.settings.timepoint, event.key, {
                    key: this.settings.colorBy.variable,
                    value: focus.key,
                });

                // Calculate numerators, denominators, and proportions.
                focus.freqs = getFreqs.call(this, focus, event, this.metadata);
                focus.fmt = formatValues.call(this, focus);
                focus.cells = defineCellValues.call(this, focus);
                focus.change = focus.nIds - focus.nIdsPrevious;
            });

        // Define an array for the frequency table.
        event.cells = defineCellValues.call(this, event);
    });
}
