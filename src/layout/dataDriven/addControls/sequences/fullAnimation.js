import addForceSimulation from '../../../../init/addForceSimulation';
import startInterval from '../../../../init/startInterval';
import resetAnimation from '../../../../init/startInterval/reset/animation';
import toggle from '../../addControls/playPause/toggle';

export default function fullAnimation(d) {
    console.log('full animation');
    this.settings.animationTrack = 'full';
    // Update settings.
    this.settings.duration = this.settings_initial.duration;
    this.settings.loop = this.settings_initial.loop;

    // Update text.
    this.layout.sequenceOverlay.classed('fdg-hidden', true);
    this.layout.timeRelative.html(this.settings_initial.timeRelative);

    // Stop current interval and force simulation.
    if (this.interval) this.interval.stop();
    if (this.forceSimulation) this.forceSimulation.stop();

    // Restart force simulation.
    this.forceSimulation = addForceSimulation.call(this, this.data);

    // Reset animation.
    resetAnimation.call(this, this.data);

    // Restart interval.
    this.timeout = d3.timeout(() => {
        this.interval = startInterval.call(this, this.data);
    }, 1000);

    // Play animation.
    if (this.settings.playPause !== 'play') toggle.call(this);
}
