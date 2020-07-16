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
            const events = this.metadata.event.map((event) => {
                return {
                    value: event.value,
                    order: event.order,
                    count: 0,
                    duration: 0,
                    totalDuration: d3.sum(
                        nest.filter((d) => d.event === event.value),
                        (d) => d.duration
                    ),
                };
            });
            events.find((event) => event.value === currentEvent.event).count += 1;

            // Update the event object of the population.
            const event = this.metadata.event.find(
                (event) => event.value === currentEvent.event
            );
            event.count += 1;

            const stateChanges = d3.sum(
                events.filter((event) => this.settings.eventChangeCount.includes(event.label)),
                (event) => event.count
            );

            return {
                currentEvent,
                events,
                duration: d3.sum(nest, (d) => d.duration),
                x: event.x + Math.random(),
                y: event.y + Math.random(),
                r:
                    this.settings.eventChangeCountAesthetic !== 'color'
                        ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
                        : this.settings.minRadius,
                color:
                    this.settings.eventChangeCountAesthetic !== 'size'
                        ? this.settings.color(stateChanges)
                        : '#aaa',
                moves: 0,
                next_move_time: currentEvent.duration,
                sched: nest,
            };
        })
        .entries(this.data)
        .map((d) => Object.assign(d, d.values));

    return nestedData;
}
