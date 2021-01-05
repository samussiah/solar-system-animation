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

export default function freqTable(metadata) {
    const freqTable = d3.merge(
        metadata.event.map((event) => {
            // One record per event per focus plus an overall event record.
            const rowGroup =
                this.settings.colorBy.type === 'categorical' ? [event, ...event.foci] : [event];

            rowGroup.forEach((d) => {
                d.state = event.value; // state
                d.label = d.value; // state or stratum
                d.denominator =
                    d.label !== d.state
                        ? d.nIndividuals
                        : ['current-id', 'cumulative-id'].includes(this.settings.eventCountType)
                        ? metadata.id.length
                        : this.settings.eventChangeType === 'cumulative-event'
                        ? event.nEvents
                        : console.warn(
                              'Unable to determine [ event.denominator ] in [ eventMetadata ].'
                          );
                d.proportion = d.count / d.denominator;
                d.proportionFmt = d3.format('.1%')(d.proportion);

                // Table cell values.
                d.countFmt = d3.format(',d')(d.count);
                d.countProportionFmt = `${d.countFmt} (${d.proportionFmt})`;
                d.cumulativeFmt = d3.format(',d')(d.cumulative);
            });

            return rowGroup;
        })
    );

    freqTable.forEach((d) => {
        d.cells =
            this.settings.freqTable.structure === 'vertical'
                ? [d.label, d.countProportionFmt, d.cumulativeFmt]
                : [
                      d.label,
                      d.countProportionFmt,
                      ...(d.foci ? d.foci.map((focus) => focus.countProportionFmt) : []),
                  ];
        d.cells.proportion = d.proportion;
    });

    return freqTable;
}
