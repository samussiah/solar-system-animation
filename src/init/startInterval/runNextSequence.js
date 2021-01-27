import getNextSequence from './runNextSequence/getNextSequence';
import getNextEventInSequence from './runNextSequence/getNextEventInSequence';
import runSequence from './runNextSequence/runSequence';
import fadeOutAll from './runNextSequence/fadeOutAll';

// TODO: add sequence-level modals
export default function runNextSequence() {
    // Stop interval.
    if (this.interval)
        this.interval.stop();

    // While sequences remain run next sequence.
    if (
        (
            this.settings.sequenceIndex < this.settings.sequences.length - 1 ||
            (
                    this.sequence.events && this.sequence.eventIndex < this.sequence.events.length - 1
            )
        )
    ) {
        // Get sequence.
        if (this.sequence.eventIndex === this.sequence.events.length - 1)
            this.sequence = getNextSequence.call(this);
        else
            this.sequence.event = getNextEventInSequence.call(this);

        // Run sequence.
        this.timeout = runSequence.call(this);
    }
    // Otherwise clear sequence text.
    else
        fadeOutAll.call(this);
}
