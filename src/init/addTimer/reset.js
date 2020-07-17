//import addTimer from '../addTimer';

export default function reset() {
    this.settings.timepoint = 0;

    // Update the event object of the population.
    this.metadata.event.forEach((event) => {
        event.count = 0;
    });

    this.data.nested.forEach((d) => {
        // Initial event for the given individual.
        d.currentEvent = d.sched[0];

        // Define an event object for the individual.
        d.events.forEach((event) => {
            event.count = 0;
            event.duration = 0;
        });
        d.events.find((event) => event.value === d.currentEvent.event).count += 1;

        const event = this.metadata.event.find((event) => event.value === d.currentEvent.event);
        event.count += 1;

        const stateChanges = d3.sum(
            d.events.filter((event) => this.settings.eventChangeCount.includes(event.value)),
            (event) => event.count
        );

        d.x = event.x + Math.random();
        d.y = event.y + Math.random();
        d.r =
            this.settings.eventChangeCountAesthetic !== 'color'
                ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
                : this.settings.minRadius;
        d.color =
            this.settings.eventChangeCountAesthetic !== 'size'
                ? this.settings.color(stateChanges)
                : '#aaa';
        d.moves = 0;
        d.next_move_time = d.currentEvent.duration;
    });
}
