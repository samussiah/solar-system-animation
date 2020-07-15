export default function updateData() {
    this.eventTypes.forEach(eventType => {
        eventType.prevCount = eventType.count;
    });

    this.data.nested.forEach((d) => {
        const currEvent = d.currentEvent.event;
        let curr_moves = d.moves;

        // Add to new activity count
        const stateChanges = d3.sum(
            d.eventTypes.filter(
                (eventType) => eventType.label !== this.settings.centerEventType
            ),
            (eventType) => eventType.count
        );
        d.r = this.settings.quantifyEvents !== 'color'
            ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
            : this.settings.minRadius;
        d.color = this.settings.quantifyEvents !== 'size'
            ? this.settings.color(stateChanges)
            : '#aaa';

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
            const eventIndividual = d.eventTypes.find((eventType) => eventType.label === nextEvent);
            eventIndividual.count += 1;

            // Update population count at previous and next events.
            this.eventTypes.find((eventType) => eventType.label === currEvent).count -= 1;
            const eventPopulation = this.eventTypes.find(
                (eventType) => eventType.label === nextEvent
            );
            eventPopulation.count += 1;

            d.moves = curr_moves;
            d.next_move_time += d.sched[d.moves].duration;
        }
    });

    this.eventTypes.forEach(eventType => {
        eventType.change = eventType.count - eventType.prevCount;
    });
}
