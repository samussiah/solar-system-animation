import fadeOut from './runSequence/fadeOut';

export default function fadeOutAll() {
    fadeOut.call(this, this.layout.sequenceOverlay.background.sequence);
    fadeOut.call(this, this.layout.sequenceOverlay.foreground.sequence);
    fadeOut.call(this, this.layout.sequenceOverlay.background.event);
    fadeOut.call(this, this.layout.sequenceOverlay.foreground.event);
}
