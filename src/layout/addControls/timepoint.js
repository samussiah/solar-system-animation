import toggle from './playPause/toggle';
import { increment } from '../../init/startInterval';
import restartForceSimulation from '../../init/startInterval/restartForceSimulation';

/**
 * function:
 * 1. Pause the animation.
 * 2. Increment the timepoint by 1.
 * 3. Allow the points to reach their destination at the new timepoint.
 */

export default function timepoint() {
    const fdg = this;

    const container = this.controls.container
        .append('div')
        .classed('fdg-control fdg-control--timepoint', true);
    const inputs = container
        .append('div')
        .classed(`fdg-button fdg-input`, true)
        .append('input')
        .attr('type', 'number')
        .attr('title', `Choose a timepoint.`)
        .attr('value', +this.settings.timepoint)
        .attr('min', 1)
        .attr('max', this.settings.duration);

    inputs.on('click', () => {
        // Pause simulation.
        if (this.settings.playPause !== 'pause') toggle.call(this);
    });

    inputs.on('change', function () {
        // Pause simulation.
        if (fdg.settings.playPause !== 'pause') toggle.call(fdg);
        fdg.settings.timepoint = +this.value - 1;

        increment.call(fdg, true);
    });

    return {
        container,
        inputs,
    };
}
