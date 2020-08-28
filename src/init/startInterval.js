import updateData from './startInterval/updateData';
import pulseOrbits from './startInterval/pulseOrbits';
import updateText from './startInterval/updateText';
import resetAnimation from './startInterval/resetAnimation';

export const increment = function (arg) {
    // Increment the timepoint.
    this.settings.timepoint+=!!arg;

    if (this.settings.timepoint <= this.settings.reset) {
        // Update the node data.
        updateData.call(this);

        // Accentuate the orbits when an event occurs.
        pulseOrbits.call(this);

        // Update timer, focus labels, and annotations.
        updateText.call(this);
    } else {
        this.interval.stop();
        // TODO: make visual countdown to reset
        //let counter = 0;
        //const interval = d3.interval(() => {
        const timeout = window.setTimeout(
            () => {
                resetAnimation.call(this);
                window.clearTimeout(timeout);
                this.interval = startInterval.call(this)
            },
            this.settings.resetDelay
        );
    }

    // Update frequency table.
    this.freqTable.tr
        .selectAll('td')
        .data((event) => [event.value, event.cumulative])
        .join('td')
        .text((d) => d);

    // Resume the force simulation.
    this.metadata.event.forEach((event) => {
        // Center points initially then remove centering force.
        if (this.settings.timepoint === 1) event.forceSimulation.force('center', null);
        event.forceSimulation.nodes(event.data);
        event.forceSimulation.alpha(1).restart();
    });
};

export default function startInterval() {
    const interval = d3.interval(increment.bind(this), this.settings.speeds[this.settings.speed]);

    return interval;
}
