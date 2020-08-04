import updateData from './startInterval/updateData';
import pulseOrbits from './startInterval/pulseOrbits';
import updateText from './startInterval/updateText';
import resetAnimation from './startInterval/resetAnimation';

export default function startInterval() {
    const interval = d3.interval(() => {
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
            resetAnimation.call(this);
        }

        // Resume the force simulation.
        this.metadata.event.forEach(event => {
            event.forceSimulation.nodes(event.data);
            event.forceSimulation.alpha(1).restart();
        });

        //this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
    }, this.settings.speeds[this.settings.speed]);

    return interval;
}
