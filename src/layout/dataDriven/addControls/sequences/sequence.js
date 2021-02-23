import getNextSequence from '../../../../init/startInterval/runNextSequence/getNextSequence';
import runSequence from '../../../../init/startInterval/runNextSequence/runSequence';

export default function sequence(d) {
    this.settings.animationTrack = 'sequence';
    this.layout.sequenceOverlay.classed('fdg-hidden', false);
    this.settings.sequenceIndex = this.settings.sequences.findIndex((sequence) => sequence === d);
    this.sequence = getNextSequence.call(this, false);
    this.sequence.eventIndex = 0;
    this.timeout = d3.timeout(() => {
        runSequence.call(this);
    }, 1000);
}
