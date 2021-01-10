export default function formatValues(d) {
    // Format the counts and proportions.
    const idNumerator = d3.format(',d')(d.freqs.idNumerator);
    const eventNumerator = d3.format(',d')(d.freqs.eventNumerator);
    const idPercent = d3.format('.1%')(d.freqs.idDenominator > 0 ? d.freqs.idProportion : 0);
    const eventPercent = d3.format('.1%')(d.freqs.eventDenominator > 0 ? d.freqs.eventProportion : 0);
    const idNumeratorPercent = `${idNumerator} (${idPercent})`;
    const eventNumeratorPercent = `${eventNumerator} (${eventPercent})`;

    return {
        idNumerator,
        eventNumerator,
        idPercent,
        eventPercent,
        idNumeratorPercent,
        eventNumeratorPercent,
    };
}
