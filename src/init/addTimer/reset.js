//import addTimer from '../addTimer';

export default function reset() {
    this.settings.timepoint = 0;

    // Update the event object of the population.
    this.eventTypes.forEach(eventType => {
        eventType.count = 0;
    });

    this.data.nested.forEach(d => {
        // Initial event for the given individual.
        d.currentEvent = d.sched[0];

        // Define an event object for the individual.
        d.eventTypes.forEach(eventType => {
            eventType.count = 0;
            eventType.duration = 0;
        });
        d.eventTypes.find(eventType => eventType.label === d.currentEvent.event).count += 1;

        const eventType = this.eventTypes.find(
            eventType => eventType.label === d.currentEvent.event
        );
        eventType.count += 1;

        const stateChanges = d3.sum(
            d.eventTypes.filter(eventType => eventType.label !== this.settings.centerEventType),
            eventType => eventType.count
        );

        d.x = eventType.x + Math.random();
        d.y = eventType.y + Math.random();
        d.r = this.settings.minRadius;// + stateChanges;
        d.color = this.settings.color(stateChanges);
        d.moves = 0;
        d.next_move_time = d.currentEvent.duration;
    });

    //if (this.settings.playPause === 'play')
    //    this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
}
