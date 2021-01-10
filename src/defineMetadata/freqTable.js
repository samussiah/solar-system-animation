// Frequency table data structure
//
// - Vertical: one record per state and state-stratum
//
//   - label (state or stratum)
//   - n participants (% participants)
//   - n events
//
// - Horizontal: one record per state with columns for state and each stratum
//
//     - label (state)
//     - n participants or events at state
//     - [...strata]
//       - n participants (% participants) or n event (% events)

import getFreqs from './freqTable/getFreqs';
import formatValues from './freqTable/formatValues';
import defineCellValues from './freqTable/defineCellValues';

export default function freqTable(metadata) {
    const freqTable = d3.merge(
        metadata.event.map((event) => {
            // One row per event per focus plus an overall event record.
            const rowGroup = this.settings.colorBy.type === 'categorical'
                ? [event, ...event.foci]
                : [event];

            // For each row calculate numerators, denominators, and proportions.
            rowGroup.forEach((d) => {
                d.state = event.key; // state
                d.label = d.key; // state or stratum
                d.freqs = getFreqs.call(this, d, event, metadata);
                d.fmt = formatValues.call(this, d);
            });

            return rowGroup;
        })
    );

    // Define an array of values to populate the frequency table.
    freqTable.forEach((d) => {
        d.cells = defineCellValues.call(this, d);
    });

    return freqTable;
}
