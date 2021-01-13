import update from './startInterval/update';
import reset from './startInterval/reset';
import restartForceSimulation from './startInterval/restartForceSimulation';
import runSequence from './runSequence';

export const increment = function (data, increment) {
    // Increment the timepoint.
    this.settings.timepoint += !!increment;

    // Update animation if the current timepoint is less than duration of animation.
    if (this.settings.timepoint <= this.settings.duration) update.call(this, data);
    // Otherwise reset animation.
    else {
        if (this.settings.loop === true)
            reset.call(this, data);
        // Run next sequence.
        else if (this.sequence && this.settings.sequence_index < this.settings.sequences.length - 1) {
            if (this.interval)
                this.interval.stop();
            this.settings.sequence_index++;
            setTimeout(
                () => {
                    // Stop the current animation
                    this.sequence = this.settings.sequences[this.settings.sequence_index];
                    this.controls.sequences.inputs
                        .classed('current', d => d.label === this.sequence.label);
                    runSequence.call(this, this.sequence);
                },
                this.settings.modalSpeed
            );
        }
    }

    // Resume the force simulation.
    restartForceSimulation.call(this, data);
};
// TODO: 1. figure out why sequences aren't playing consecutively
// TODO: 2. once sequences are in an acceptable place, run events one at a time
// TODO: 3. add sequence-level modals

// Default returns an interval that runs increment() every time unit.
export default function startInterval(data) {
    const interval = d3.interval(
        increment.bind(this, data),
        this.settings.speeds[this.settings.speed]
    );

    return interval;
}
