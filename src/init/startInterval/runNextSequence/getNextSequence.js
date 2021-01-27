import fadeOut from './runSequence/fadeOut';

export default function getNextSequence(increment = true) {
    if (increment)
        this.settings.sequenceIndex++;
    const sequence = this.settings.sequences[this.settings.sequenceIndex];
    const start_orbit = this.metadata.orbit
        .find((orbit) => +orbit.key === sequence.start_order);
    sequence.events = start_orbit.values;
    fadeOut.call(this, this.containers.sequenceOverlay.background.sequence);
    fadeOut.call(this, this.containers.sequenceOverlay.foreground.sequence);
    fadeOut.call(this, this.containers.sequenceOverlay.background.event);
    fadeOut.call(this, this.containers.sequenceOverlay.foreground.event);

    return sequence;
}
