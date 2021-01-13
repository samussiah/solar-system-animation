import toggle from './playPause/toggle';
import { increment } from '../../init/startInterval';

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
        .append('div')
        .classed(`fdg-button fdg-input`, true)
        .attr('title', `Advance animation by one time unit.`)
        .text('Step');

    inputs.on('click', () => {
        // Pause simulation.
        if (this.settings.playPause !== 'pause') toggle.call(this);

        increment.call(this, this.data, true);
    });

    return {
        container,
        inputs,
    };
}
