// Determine the numerator of the state proportions.
export default function getNumerator(eventCountType, counts) {
    const numerator =
        eventCountType === 'current-id'
            ? counts.nIds
            : eventCountType === 'cumulative-id'
            ? counts.nIdsCumulative
            : eventCountType === 'cumulative-event'
            ? counts.nEvents
            : console.warn('Unable to determine [ numerator ] in [ getNumerator() ].');

    return numerator;
}
