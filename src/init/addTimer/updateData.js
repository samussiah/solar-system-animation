export default function updateData() {
    this.metadata.event.forEach((event) => {
        event.prevCount = event.count;
    });

    this.data.nested.forEach((d) => {
        const currEvent = d.currentEvent.event;
        let curr_moves = d.moves;

        // Time to go to next activity
        if (d.next_move_time === this.settings.timepoint) {
            if (d.moves === d.sched.length - 1) {
                curr_moves = 0;
            } else {
                curr_moves += 1;
            }

            // Update individual to next event.
            d.currentEvent = d.sched[curr_moves];
            const nextEvent = d.currentEvent.event;
            const eventIndividual = d.events.find((event) => event.value === nextEvent);
            eventIndividual.count += 1;

            // Update population count at previous and next events.
            this.metadata.event.find((event) => event.value === currEvent).count -= 1;
            const eventPopulation = this.metadata.event.find(
                (event) => event.value === nextEvent
            );
            eventPopulation.count += 1;

            d.moves = curr_moves;
            d.next_move_time += d.sched[d.moves].duration;
        }

        // Add to new activity count
        const stateChanges = d3.sum(
            d.events.filter((event) => this.settings.eventChangeCount.includes(event.value)),
            (event) => event.count
        );
        d.r =
            this.settings.eventChangeCountAesthetic !== 'color'
                ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
                : this.settings.minRadius;
        d.color =
            this.settings.eventChangeCountAesthetic !== 'size' ? this.settings.color(stateChanges) : '#aaa';
    });

    this.metadata.event.forEach((event) => {
        event.change = event.count - event.prevCount;
    });
}
