export default function updateData() {
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
            const eventIndividual = d.eventTypes.find((eventType) => eventType.label === nextEvent);
            eventIndividual.count += 1;

            // Update population count at previous and next events.
            this.eventTypes.find((eventType) => eventType.label === currEvent).count -= 1;
            const eventPopulation = this.eventTypes.find(
                (eventType) => eventType.label === nextEvent
            );
            eventPopulation.count += 1;

            // Add to new activity count
            const stateChanges = d3.sum(
                d.eventTypes.filter(
                    (eventType) => eventType.label !== this.settings.centerEventType
                ),
                (eventType) => eventType.count
            );

            d.moves = curr_moves;
            //d.x = eventPopulation.x;
            //d.y = eventPopulation.y;
            d.r = this.settings.minRadius;// + stateChanges;
            d.color = this.settings.color(stateChanges);

            d.next_move_time += d.sched[d.moves].duration;
        }
    });
}
