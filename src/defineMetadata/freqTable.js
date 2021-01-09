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
                // TODO: define ID-level and event-level freqency objects
                // TODO: use the appropriate frequency at each focus and in the frequency table
                // TODO: this requires an update to init/startInterval/update/data/eventMetadata.js

                // Calculate the current number of individuals and events.
                d.idNumerator = getNumerator(this.settings.eventCountType, {
                    nIds: d.nIds,
                    nIdsCumulative: d.nIdsCumulative,
                    nEvents: d.nEvents,
                });
                d.eventNumerator = getNumerator('cumulative-event', {
                    nIds: d.nIds,
                    nIdsCumulative: d.nIdsCumulative,
                    nEvents: d.nEvents,
                });

                // Calculate the total number of individuals and events.
                d.idDenominator =
                    d !== event
                        ? d.individuals.length // number of individuals in the stratum
                        : metadata.id.length; // total number of individuals
                d.eventDenominator =
                    d !== event
                        ? event.nEvents // number of events at the given state
                        : event.nEventsTotal; // total number of events (doesn't really have any use but hey, it's something)

                // Calculate the proportion.
                d.idProportion = d.idNumerator / d.idDenominator;
                d.eventProportion = d.eventNumerator / d.eventDenominator;

                // Format the counts and proportions.
                d.fmt = {
                    idNumerator: d3.format(',d')(d.idNumerator),
                    idPercent: d3.format('.1%')(d.idProportion),
                    eventNumerator: d3.format(',d')(d.eventNumerator),
                    eventPercent: d3.format('.1%')(d.eventProportion),
                };
                d.fmt.idNumeratorPercent = `${d.fmt.idNumerator} (${d.fmt.idPercent})`;
                d.fmt.eventNumeratorPercent = `${d.fmt.eventNumerator} (${d.fmt.eventPercent})`;
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
