export default function getValues(event, d) {
    const state = event.value; // state
    const label = d.value; // state or stratum
    const denominator =
        label !== state
            ? d.nIndividuals
            : ['current-id', 'cumulative-id'].includes(this.settings.eventCountType)
            ? metadata.id.length
            : this.settings.eventChangeType === 'cumulative-event'
            ? event.nEvents
            : console.warn(
                    'Unable to determine [ event.denominator ] in [ eventMetadata ].'
                );
    const proportion = d.count / denominator;
    const proportionFmt = d3.format('.1%')(proportion);

    // Table cell values.
    const countFmt = d3.format(',d')(d.count);
    const countProportionFmt = `${countFmt} (${proportionFmt})`;
    const cumulativeFmt = d3.format(',d')(d.cumulative);
    const displayValue = this.settings.freqTable.countType === 'id'
        ? countProportionFmt
        : this.settings.freqTable.countType === 'event'
        ? cumulativeFmt
        : countFmt;

    return {
        state,
        label,
        denominator,
        proportion,
        proportionFmt,
        countFmt,
        countProportionFmt,
        cumulativeFmt,
        displayValue,
    };
}
