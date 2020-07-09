import readablePercent from './addTimer/readablePercent';
import minutesToTime from './addTimer/minutesToTime';

export default function addTimer() {
    const fdg = this;

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

    this.force.resume();
    this.settings.timepoint += 1;

    // Update percentages
    this.fociLabels.selectAll('tspan.actpct').text((d) => readablePercent(d.count));

    // Update time
    const true_minute = this.settings.timepoint % 1440;
    this.timer.text(minutesToTime(true_minute));

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

    setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
}
