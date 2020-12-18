// Count the number of events, i.e. the number of times any ID has existed in the given state.
export default function countCumulative(data, timepoint, event, stratum) {
    return data.filter(
        (d) =>
            d.start_timepoint <= timepoint &&
            d[event.key] === event.value &&
            (stratum === undefined || d[stratum.key] === stratum.value)
    ).length;
}
