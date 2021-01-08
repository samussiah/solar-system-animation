// Frequency data structure
//
// - Vertical: one record per state and state-stratum
//   - state
//   - stratum
//   - label (state or stratum)
//   - participant denominator (population or stratum total)
//   - participant numerator (number of participants in a given state)
//   - participant proportion
//   - event count
//   - formatted values (columns)
//     - label
//     - nParticipants (%)
//     - nEvents
//
// - Horizontal: one record per state with columns for each stratum
//   - columns:
//     - state
//     - [...strata]

import getNumerator from '../init/startInterval/update/data/eventMetadata/getNumerator';

export default function freqTable(metadata) {
    const freqTable = d3.merge(
        metadata.event.map((event) => {
            // One record per event per focus plus an overall event record.
            const rowGroup =
                this.settings.colorBy.type === 'categorical' ? [event, ...event.foci] : [event];

            rowGroup.forEach((d) => {
                d.state = event.key; // state
                d.label = d.key; // state or stratum

                // Determine numerator that appears at each focus.
                d.numerator = getNumerator(this.settings.eventCountType, {
                    nIds: d.nIds,
                    nIdsCumulative: d.nIdsCumulative,
                    nEvents: d.nEvents,
                });

                d.denominator =
                    d !== event
                        ? d.individuals.length
                        : ['current-id', 'cumulative-id'].includes(this.settings.eventCountType)
                        ? metadata.id.length
                        : this.settings.eventChangeType === 'cumulative-event'
                        ? event.nEvents
                        : console.warn(
                              'Unable to determine [ event.denominator ] in [ eventMetadata ].'
                          );
                // TODO: match this calculation with what's in eventMetadata()
                // TODO: figure out what to use as the denominator
                // TODO: modularize this code for use here and in eventMetadata() - does it event need to happen here?
                //
                // Calculate the proportion.
                d.proportion = d.numerator / d.denominator;

                // Format the counts and proportions.
                d.fmt = {
                    numerator: d3.format(',d')(d.numerator),
                    percent: d3.format('.1%')(d.proportion),
                    nEvents: d3.format(',d')(d.nEvents),
                };
                d.fmt.numeratorPercent = `${d.fmt.numerator} (${d.fmt.percent})`;
                d.displayValue = this.settings.freqTable.countType === 'event'
                    ? d.fmt.nEvents
                    : d.fmt.numeratorPercent;
            });

            return rowGroup;
        })
    );

    freqTable.forEach((d) => {
        d.cells =
            this.settings.freqTable.structure === 'vertical'
                ? [d.label, d.fmt.numeratorPercent, d.fmt.nEvents]
                : [
                      d.label,
                      d.displayValue,
                      ...(d.foci ? d.foci.map((focus) => focus.displayValue) : []),
                  ];
        d.cells.proportion = d.proportion;
    });

    return freqTable;
}
