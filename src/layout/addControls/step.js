import toggle from './playPause/toggle';
import updateData from '../../init/addTimer/updateData';
import pulseOrbits from '../../init/addTimer/pulseOrbits';
import updateText from '../../init/addTimer/updateText';

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
        .classed(`togglebutton fdg-input`, true)
        .attr('title', `Advance animation by one time unit`)
        .text('Step');

    inputs.on('click', () => {
        // Pause simulation.
        if (this.settings.playPause !== 'pause') toggle.call(this);

        // Increment the timepoint.
        this.settings.timepoint++;

        if (this.settings.timepoint <= this.settings.reset) {
            // Update the node data.
            updateData.call(this);

            // Accentuate the orbits when an event occurs.
            pulseOrbits.call(this);

            // Update timer, focus labels, and annotations.
            updateText.call(this);
        } else {
            reset.call(this);
        }

        // Continue running the simulation, at the current timepoint only.
        const resume_for_a_while = function () {
            this.force.resume();
            this.pause_timeout = setTimeout(
                resume_for_a_while.bind(this),
                this.settings.speeds[this.settings.speed]
            );
        };
        this.pause_timeout = setTimeout(
            resume_for_a_while.bind(this),
            this.settings.speeds[this.settings.speed]
        );
    });

    return {
        container,
        inputs,
    };
}
