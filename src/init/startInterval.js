import update from './startInterval/update';
import reset from './startInterval/reset';
import fadeOut from './runSequence/fadeOut';
import restartForceSimulation from './startInterval/restartForceSimulation';
import runSequence from './runSequence';

export const increment = function (data, increment) {
    // Increment timepoint.
    this.settings.timepoint += !!increment;

    // Update animation if current timepoint is less than full duration of animation.
    if (this.settings.timepoint <= this.settings.duration) update.call(this, data);
    // Otherwise restart animation.
    else {
        // Restart animation.
        if (this.settings.loop === true) reset.call(this, data);
        // Run next sequence.
        else if (this.sequence) {
            if (
                (
                    this.settings.sequence_index < this.settings.sequences.length - 1 ||
                    (
                            this.sequence.events && this.sequence.event_index < this.sequence.events.length - 1
                    )
                )
            ) {
                if (this.interval) this.interval.stop();

                // get next sequence
                if (this.sequence.event_index === this.sequence.events.length - 1) {
                    this.settings.sequence_index++;
                    fadeOut.call(this, this.containers.sequenceOverlay.background.sequence);
                    fadeOut.call(this, this.containers.sequenceOverlay.foreground.sequence);
                    fadeOut.call(this, this.containers.sequenceOverlay.background.event);
                    fadeOut.call(this, this.containers.sequenceOverlay.foreground.event);
                    this.sequence = this.settings.sequences[this.settings.sequence_index];
                }
                // get next event in sequence
                else {
                    this.sequence.event_index++;
                    fadeOut.call(this, this.containers.sequenceOverlay.background.event);
                    fadeOut.call(this, this.containers.sequenceOverlay.foreground.event);
                }

                setTimeout(() => {
                    this.controls.sequences.inputs.classed(
                        'current',
                        (d) => d.label === this.sequence.label
                    );
                    runSequence.call(this, this.sequence);
                }, this.settings.modalSpeed);
            } else {
                if (this.interval)
                    this.interval.stop();
                fadeOut.call(this, this.containers.sequenceOverlay.background.sequence);
                fadeOut.call(this, this.containers.sequenceOverlay.foreground.sequence);
                fadeOut.call(this, this.containers.sequenceOverlay.background.event);
                fadeOut.call(this, this.containers.sequenceOverlay.foreground.event);
            }
        }
    }

    // Resume the force simulation.
    restartForceSimulation.call(this);
};

// TODO: 3. add sequence-level modals

// Default returns an interval that runs increment() every time unit.
export default function startInterval(data) {
    const interval = d3.interval(
        increment.bind(this, data),
        this.settings.speeds[this.settings.speed]
    );

    return interval;
}
