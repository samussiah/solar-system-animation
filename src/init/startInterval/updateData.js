export default function updateData() {
    // Record number of IDs at each focus at previous timepoint.
    this.metadata.event.forEach((event) => {
        event.prevCount = event.count;
    });

    this.data.nested.forEach((d) => {
        const currEvent = d.value.state.event;
        let curr_moves = d.value.moves;

        // Time to go to next activity
        if (
            d.value.nextStateChange === this.settings.timepoint &&
            this.settings.timepoint < d.value.duration
        ) {
            curr_moves += 1;

            // Update individual to next event.
            d.value.state = d.value.sched[curr_moves];
            const nextEvent = d.value.state.event;
            const eventIndividual = d.value.events.find((event) => event.value === nextEvent);
            eventIndividual.count += 1;

            // Update population count at previous and next events.
            this.metadata.event.find((event) => event.value === currEvent).count -= 1;
            const eventPopulation = this.metadata.event.find((event) => event.value === nextEvent);
            eventPopulation.count += 1;

            d.value.moves = curr_moves;
            d.value.nextStateChange += d.value.sched[d.value.moves].duration;
        }

        // Add to new activity count
        const stateChanges = d3.sum(
            d.value.events.filter((event) => this.settings.eventChangeCount.includes(event.value)),
            (event) => event.count
        );
        d.value.r =
            this.settings.eventChangeCountAesthetic !== 'color'
                ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
                : this.settings.minRadius;
        d.value.color =
            this.settings.eventChangeCountAesthetic !== 'size'
                ? this.settings.color(stateChanges)
                : '#aaa';

        d.value.fill = d.value.color.replace('rgb', 'rgba').replace(')', ', 0.5)');
        d.value.stroke = d.value.color.replace('rgb', 'rgba').replace(')', ', 1)');
    });

    // Record change in number of IDs at each focus at current timepoint.
    this.metadata.event.forEach((event) => {
        event.change = event.count - event.prevCount;
        event.data = this.data.nested.filter(d => d.value.state.event === event.value);
    });
}
