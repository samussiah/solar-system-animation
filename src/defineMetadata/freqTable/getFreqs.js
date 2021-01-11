export default function getFreqs(d, event, metadata) {
    // Calculate the current number of individuals and events.
    const idNumerator =
        this.settings.eventCountType === 'cumulative-id' ? d.nIdsCumulative : d.nIds;
    const eventNumerator = d.nEvents;

    // Calculate the total number of individuals and events.
    const idDenominator =
        d !== event
            ? d.individuals.length // number of individuals in the stratum
            : metadata.id.length; // total number of individuals
    const eventDenominator =
        d !== event
            ? event.nEvents // number of events at the given state
            : event.nEventsTotal; // total number of events (doesn't really have any use but hey, it's something)

    // Calculate proportions.
    const idProportion = idNumerator / idDenominator;
    const eventProportion = eventNumerator / eventDenominator;

    return {
        idNumerator,
        eventNumerator,
        idDenominator,
        eventDenominator,
        idProportion,
        eventProportion,
    };
}
