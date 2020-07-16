import toggle from './playPause/toggle';
import addTimer from '../../init/addTimer';

/**
 * function:
 * 1. Pause the animation.
 * 2. Increment the timepoint by 1.
 * 3. Allow the points to reach their destination at the new timepoint.
 */

export default function step() {
    const fdg = this;

    const container = this.controls.container
        .append('div')
        .classed('fdg-control fdg-control--step', true);
    const inputs = container
        .append('button')
        .classed(`togglebutton fdg-input`, true)
        .attr('title', `Advance animation by one time unit`)
        .text('Step');

    inputs.on('click', () => {
        if (this.settings.playPause !== 'pause') toggle.call(this);

        // Update time
        this.timer.text(`${this.settings.timepoint + 1} ${this.settings.timeUnit}`);

        this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
        setTimeout(() => {
            clearTimeout(this.timeout);
        }, this.settings.speeds[this.settings.speed]);
    });

    return {
        container,
        inputs,
    };
}
