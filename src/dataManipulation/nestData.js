export default function nestData() {
    const nestedData = d3
        .nest()
        .key((d) => d.id)
        .rollup((nest) => {
            nest.forEach((d, i) => {
                d.timepoint = i === 0 ? d.duration : d.duration + nest[i - 1].timepoint;
                if (i === 0) {
                    d.start_timepoint = 1;
                    d.end_timepoint = d.duration;
                } else {
                    d.start_timepoint = nest[i - 1].end_timepoint + 1;
                    d.end_timepoint = d.start_timepoint + d.duration;
                }
            });

            // Initial event for the given individual.
            const currentEvent = nest[0];

            // Define an event object for the individual.
            const eventTypes = this.eventTypes.map((eventType) => {
                return {
                    label: eventType.label,
                    order: eventType.order,
                    count: 0,
                    duration: 0,
                    totalDuration: d3.sum(
                        nest.filter((d) => d.event === eventType.label),
                        (d) => d.duration
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
                duration: d3.sum(nest, (d) => d.duration),
                x: eventType.x + Math.random(),
                y: eventType.y + Math.random(),
                r:
                    this.settings.quantifyEvents !== 'color'
                        ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
                        : this.settings.minRadius,
                color:
                    this.settings.quantifyEvents !== 'size'
                        ? this.settings.color(stateChanges)
                        : '#aaa',
                moves: 0,
                next_move_time: currentEvent.duration,
                sched: nest,
            };
        })
        .entries(this.data)
        .map((d) => Object.assign(d, d.values));
    console.table(nestedData[0].sched);

    return nestedData;
}
