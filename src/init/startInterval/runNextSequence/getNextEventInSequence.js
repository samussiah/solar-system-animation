import fadeOut from './runSequence/fadeOut';

export default function getNextEventInSequence() {
    this.sequence.eventIndex++;
    const event = this.sequence.events.find((event, i) => i === this.sequence.eventIndex);
    fadeOut.call(this, this.containers.sequenceOverlay.background.event);
    fadeOut.call(this, this.containers.sequenceOverlay.foreground.event);

    return event;
}
