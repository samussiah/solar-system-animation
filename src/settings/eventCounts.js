export default function eventCounts(settings) {
    const eventCounts = settings.eventTypes.reduce((eventCounts, eventType) => {
        eventCounts[eventType.index] = 0;
        return eventCounts;
    }, {});

    return eventCounts;
}
