import getNextSequence from '../../init/startInterval/runNextSequence/getNextSequence';
import addForceSimulation from '../../init/addForceSimulation';
import runSequence from '../../init/startInterval/runNextSequence/runSequence';
import resetAnimation from '../../init/startInterval/reset/animation';
import startInterval from '../../init/startInterval';

export default function reset() {
    const main = this;

    const container = this.controls.container
        .append('div')
        .classed('fdg-control fdg-control--reset', true);
    const inputs = container
        .append('div')
        .classed(`fdg-button fdg-input`, true)
        .attr('title', `Reset animation.`)
        .html('&#x21ba;');

    inputs.on('click', () => {
        if (this.timeout)
            this.timeout.stop();

        if (this.interval)
            this.interval.stop();

        // TODO: why isn't this handled in resetAnimation?
        if (this.settings.runSequences) {
            this.settings.sequences.forEach(sequence => {
                sequence.eventIndex = 0;
            });
            this.settings.sequenceIndex = 0;
            this.sequence = getNextSequence.call(this, false);
        }

        resetAnimation.call(this, this.settings.animationTrack === 'sequence' ? this.sequence.data : this.data);

        if (this.forceSimulation) this.forceSimulation.stop();

        // Restart force simulation.
        this.forceSimulation = addForceSimulation.call(this, this.settings.animationTrack === 'sequence' ? this.sequence.data : this.data);

        // Start the animation.
        if (this.settings.playPause === 'play')
            this.timeout = d3.timeout(
                () => {
                    // Run first sequence.
                    if (this.settings.animationTrack === 'sequence')
                        runSequence.call(this); // calls startInterval
                    // Run full animation.
                    else
                        this.interval = startInterval.call(this, this.data);
                },
                1000 // this.settings.delay ? this.settings.modalSpeed : 0
            );
    });

    return {
        container,
        inputs,
    };
}
