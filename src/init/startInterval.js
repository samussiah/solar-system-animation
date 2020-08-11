import updateData from './startInterval/updateData';
import pulseOrbits from './startInterval/pulseOrbits';
import updateText from './startInterval/updateText';
import resetAnimation from './startInterval/resetAnimation';

export const increment = function () {
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
    this.metadata.event.forEach((event) => {
        event.forceSimulation.nodes(event.data);
        event.forceSimulation.alpha(1).restart();
    });
};

export default function startInterval() {
    const interval = d3.interval(increment.bind(this), this.settings.speeds[this.settings.speed]);

    return interval;
}
