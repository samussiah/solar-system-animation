import updateData from './startInterval/updateData';
import pulseOrbits from './startInterval/pulseOrbits';
import updateText from './startInterval/updateText';
import resetAnimation from './startInterval/resetAnimation';

export const increment = function (arg) {
    // Increment the timepoint.
    this.settings.timepoint+=!!arg;
    this.containers.duration
        .style('width', `${Math.min(this.settings.timepoint/this.settings.duration*100, 100)}%`);

    if (this.settings.timepoint <= this.settings.duration) {
        // Update the node data.
        updateData.call(this);

        // Accentuate the orbits when an event occurs.
        pulseOrbits.call(this);

        // Update timer, focus labels, and annotations.
        updateText.call(this);
    } else {
        this.interval.stop();

        // Display a visual countdown to reset.
        let counter = this.settings.resetDelay/1000 - 1;
        this.containers.countdown.classed('fdg-hidden', d => d !== counter);
        const interval = window.setInterval(
            () => {
                counter--;
                this.containers.countdown.classed('fdg-hidden', d => d !== counter);
            },
            1000
        );

        // Set a timeout before resetting the animation.
        const timeout = window.setTimeout(
            () => {
                resetAnimation.call(this);
                window.clearInterval(interval);
                window.clearTimeout(timeout);
                this.containers.countdown.classed('fdg-hidden', true);
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
