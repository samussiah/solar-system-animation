import updateData from './addTimer/updateData';
import pulseOrbits from './addTimer/pulseOrbits';
import updateText from './addTimer/updateText';
import reset from './addTimer/reset';

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

    if (this.settings.timepoint <= this.settings.reset) {
        // Update the node data.
        updateData.call(this);

        // Accentuate the orbits when an event occurs.
        pulseOrbits.call(this);

        // Update timer, focus labels, and annotations.
        updateText.call(this);
    } else {
        reset.call(this);
    }

    this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
}
