import pulseOrbits from './addTimer/pulseOrbits';
import updateData from './addTimer/updateData';
import reset from './addTimer/reset';
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
    // Increment the timepoint.
    this.settings.timepoint += 1;

    // Resume the force simulation.
    this.force.resume();

    if (this.settings.timepoint > this.settings.reset) {
        reset.call(this);
        //clearTimeout(this.timeout);
        //setTimeout(() => reset.call(this), 1000);
    } else {
        // Update the node data.
        updateData.call(this);

        // Accentuate the orbits when an event occurs.
        pulseOrbits.call(this);

        // Update percentages
        if (this.settings.eventCount)
            this.fociLabels.selectAll('tspan.actpct').text((d) => readablePercent(d.count));

        // Update time
        this.timer.text(minutesToTime.call(this, this.settings.timepoint));

        // Update notes
        if (this.settings.timepoint === this.settings.annotations[this.notes_index].start_minute) {
            this.annotations
                .style('top', '0px')
                .transition()
                .duration(600)
                .style('top', '20px')
                .style('color', '#000000')
                .text(this.settings.annotations[this.notes_index].note);
        }

        // Make note disappear at the end.
        else if (this.settings.timepoint === this.settings.annotations[this.notes_index].stop_minute) {
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
    }

    this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
}
