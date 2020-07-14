export default function nestData() {
    const nestedData = d3
        .nest()
        .key((d) => d.id)
        .rollup((d) => {
            // Initial event for the given individual.
            const currentEvent = d[0];

            // Define an event object for the individual.
            const eventTypes = this.eventTypes.map((eventType) => {
                return {
                    label: eventType.label,
                    order: eventType.order,
                    count: 0,
                    duration: 0,
                    totalDuration: d3.sum(
                        d.filter((di) => di.event === eventType.label),
                        (di) => di.duration
                    ),
                };
            });
            eventTypes.find((eventType) => eventType.label === currentEvent.event).count += 1;

            // Update the event object of the population.
            const eventType = this.eventTypes.find(
                (eventType) => eventType.label === currentEvent.event
            );
            eventType.count += 1;

            const stateChanges = d3.sum(
                eventTypes.filter((eventType) => eventType.label !== this.settings.centerEventType),
                (eventType) => eventType.count
            );

            return {
                currentEvent,
                eventTypes,
                duration: d3.sum(d, di => di.duration),
                x: eventType.x + Math.random(),
                y: eventType.y + Math.random(),
                r: this.settings.quantifyEvents !== 'color'
                    ? this.settings.minRadius
                    : this.settings.minRadius + stateChanges,
                color: this.settings.quantifyEvents !== 'size'
                    ? this.settings.color(stateChanges)
                    : '#aaa',
                moves: 0,
                next_move_time: currentEvent.duration,
                sched: d,
            };
        })
        .entries(this.data)
        .map((d) => Object.assign(d, d.values));

    return nestedData;
}
