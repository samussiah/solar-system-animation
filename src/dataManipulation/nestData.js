export default function nestData() {
    const R = this.settings.width / this.metadata.event.length / 2;

    const nestedData = d3
        .nest()
        .key((d) => d.id)
        .rollup((group) => {
            // Establish start and end timepoints for each state.
            group.forEach((d, i) => {
                d.timepoint = i === 0 ? d.duration : d.duration + group[i - 1].timepoint;
                if (i === 0) {
                    d.start_timepoint = 1;
                    d.end_timepoint = d.duration;
                } else {
                    d.start_timepoint = group[i - 1].end_timepoint + 1;
                    d.end_timepoint = d.start_timepoint + d.duration;
                }
            });

            // Initial state for the given individual.
            const state = group[0];

            // Define an event object for the individual.
            const events = this.metadata.event.map((event) => {
                return {
                    value: event.value,
                    order: event.order,
                    count: 0,
                    duration: 0,
                    totalDuration: d3.sum(
                        group.filter((d) => d.event === event.value),
                        (d) => d.duration
                    ),
                };
            });
            events.find((event) => event.value === state.event).count += 1;

            // Update the event object of the population.
            const event = this.metadata.event.find((event) => event.value === state.event);
            event.count += 1;

            const stateChanges = d3.sum(
                events.filter((event) => this.settings.eventChangeCount.includes(event.label)),
                (event) => event.count
            );

            const theta = Math.random() * 2 * Math.PI;
            const r = Math.sqrt(~~(Math.random() * R * R));

            const datum = {
                state,
                events,
                stateChanges,
                duration: d3.sum(group, (d) => d.duration),
                sx: event.x + r * Math.cos(theta), //Math.random()*this.settings.width/this.metadata.event.length * (Math.random() < .5 ? -1 : 1),
                sy: event.y + r * Math.sin(theta), //Math.random()*this.settings.height/this.metadata.event.length * (Math.random() < .5 ? -1 : 1),
                tx: event.x,
                ty: event.y,
                r:
                    this.settings.eventChangeCountAesthetic !== 'color'
                        ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
                        : this.settings.minRadius,
                color:
                    this.settings.eventChangeCountAesthetic !== 'size'
                        ? this.settings.color(stateChanges)
                        : '#aaa',
                moves: 0,
                nextStateChange: state.duration,
                sched: group,
            };

            datum.fill = datum.color.replace('rgb', 'rgba').replace(')', ', 0.5)');
            datum.stroke = datum.color.replace('rgb', 'rgba').replace(')', ', 1)');

            return datum;
        })
        .entries(this.data);

    return nestedData;
}
