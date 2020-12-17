// Determine the numerator of the state proportions.
export default function getNumerator(eventCountType, n) {
    const numerator = eventCountType === 'current-id'
            ? n.ids
            : eventCountType === 'cumulative-id'
            ? n.cumulativeIds
            : eventCountType === 'cumulative-event'
            ? n.events
            : console.warn('Unable to determine [ numerator ] in [ getNumerator() ].');

    return numerator;
}
