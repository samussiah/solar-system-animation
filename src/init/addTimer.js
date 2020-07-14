import readablePercent from './addTimer/readablePercent';
import minutesToTime from './addTimer/minutesToTime';

/**
 * Order of operations:
 *
 * 1. Update data for each individual.
 * 2. Resume force simulation.
 * 3. Increment timepoint.
 * 4. Update timer text, percentage annotations, and information annotation.
 * 5. Recursively call addTimer().
 */

export default function addTimer() {
    this.settings.timepoint += 1;
    this.force.resume();

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
            d.x = eventPopulation.x;
            d.y = eventPopulation.y;
            d.r = 2 + stateChanges;
            d.color = this.settings.colorScale(stateChanges);

            d.next_move_time += d.sched[d.moves].duration;
        }
    });

    if (this.settings.timepoint === this.settings.reset) {
        this.settings.timepoint = 0;

        // Update the event object of the population.
        this.eventTypes.forEach(eventType => {
            eventType.count = 0;
        });

        this.data.nested.forEach(d => {
            // Initial event for the given individual.
            const currentEvent = d.sched[0];

            // Define an event object for the individual.
            d.eventTypes.forEach(eventType => {
                eventType.count = 0;
                eventType.duration = 0;
            });
            d.eventTypes.find(eventType => eventType.label === currentEvent.event).count += 1;

            const eventType = this.eventTypes.find(
                eventType => eventType.label === currentEvent.event
            );
            eventType.count += 1;

            const stateChanges = d3.sum(
                d.eventTypes.filter(eventType => eventType.label !== this.settings.centerEventType),
                eventType => eventType.count
            );

            d.x = eventType.x + Math.random();
            d.y = eventType.y + Math.random();
            d.r = 2 + stateChanges;
            d.color = this.settings.colorScale(stateChanges);
            d.moves = 0;
            d.next_move_time = currentEvent.duration;
        });
    }

    // Update percentages
    this.fociLabels.selectAll('tspan.actpct').text((d) => readablePercent(d.count));

    // Update time
    const true_minute = this.settings.timepoint % 1440;
    this.timer.text(minutesToTime.call(this, true_minute));

    // Update notes
    if (true_minute === this.settings.annotations[this.notes_index].start_minute) {
        this.annotations
            .style('top', '0px')
            .transition()
            .duration(600)
            .style('top', '20px')
            .style('color', '#000000')
            .text(this.settings.annotations[this.notes_index].note);
    }

    // Make note disappear at the end.
    else if (true_minute === this.settings.annotations[this.notes_index].stop_minute) {
        this.annotations
            .transition()
            .duration(1000)
            .style('top', '300px')
            .style('color', '#ffffff');

        this.notes_index += 1;

        if (this.notes_index === this.settings.annotations.length) {
            this.notes_index = 0;
        }
    }

    this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
}
