import runModal from './init/runModal';
import addStaticForceSimulation from './init/addStaticForceSimulation';
import addForceSimulation from './init/addForceSimulation';
import { increment } from './init/startInterval';
import getNextSequence from './init/startInterval/runNextSequence/getNextSequence';
import runSequence from './init/startInterval/runNextSequence/runSequence';
import startInterval from './init/startInterval';

export default function init() {
    this.settings_initial = { ...this.settings };

    // Update metadata.
    this.metadata.event.forEach((event) => {
        event.data = this.data.nested.filter((d) => d.value.state.event === event.key);
    });

    // Cycle through text that displays over animation.
    runModal.call(this);

    // Add a static force layout in the background for individuals that never change state (improves
    // performance by reducing the number of nodes in the simulation).
    addStaticForceSimulation.call(this);

    // Add a dynamic force layout in the middleground.
    this.forceSimulation = addForceSimulation.call(this, this.data);
    this.nodes = this.forceSimulation.nodes();

    // Reheat the force simulation after initialization to incorporate the centering force before
    // removing the force.
    //increment.call(this, this.data, false);
    this.settings.removeCenterForce = true;

    // Start the animation.
    if (this.settings.playPause === 'play')
        this.timeout = d3.timeout(() => {
            // Run first sequence.
            if (this.settings.runSequences === true) {
                this.sequence = getNextSequence.call(this, false);
                runSequence.call(this); // calls startInterval
            }
            // Run full animation.
            else this.interval = startInterval.call(this, this.data);
        }, this.settings.delay);
}
