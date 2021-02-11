import fadeOut from './runSequence/fadeOut';

export default function fadeOutAll() {
    fadeOut.call(this, this.containers.sequenceOverlay.background.sequence);
    fadeOut.call(this, this.containers.sequenceOverlay.foreground.sequence);
    fadeOut.call(this, this.containers.sequenceOverlay.background.event);
    fadeOut.call(this, this.containers.sequenceOverlay.foreground.event);
}
