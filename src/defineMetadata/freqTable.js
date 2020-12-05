// Frequency data structure: one record per event/event-stratum
//
// - state
// - stratum
// - label (state or stratum)
// - participant denominator (population or stratum total)
// - participant numerator (number of participants in a given state)
// - participant proportion
// - event count
// - formatted values
//   - label
//   - nParticipants (%)
//   - nEvents

export default function freqTable(metadata) {
    const freqTable = d3.merge(
        metadata.event.map((event) => {
            // One record per event per focus plus an overall event record.
            const rowGroup = [event, ...event.foci];

            rowGroup.forEach((d) => {
                d.state = event.value; // state
                d.label = d.value; // state or stratum
                d.denominator = d.label !== d.state ? d.nParticipants : metadata.id.length;
                d.proportion = d.count / d.denominator;
                d.proportionFmt = d3.format('.1%')(d.proportion);

                // Table cell values.
                d.countFmt = d3.format(',d')(d.count);
                d.countProportionFmt = `${d.countFmt} (${d.proportionFmt})`;
                d.cumulativeFmt = d3.format(',d')(d.cumulative);
                d.cells = [d.label, d.countProportionFmt, d.cumulativeFmt];
                d.cells.proportion = d.proportion;
            });

            return rowGroup;
        })
    );

    return freqTable;
}
