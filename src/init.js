import runModal from './init/runModal';
import addStaticForceSimulation from './init/addStaticForceSimulation';
import addForceSimulation from './init/addForceSimulation';
import { increment } from './init/startInterval';
import startInterval from './init/startInterval';
import runSequence from './init/runSequence';

export default function init() {
    this.settings_initial = { ...this.settings };

    // Cycle through text that displays over animation.
    runModal.call(this);

    // Add a static force layout in the background for individuals that never change state.
    addStaticForceSimulation.call(this);

    // Add a dynamic force layout in the middleground.
    this.forceSimulation = addForceSimulation.call(this, this.data);
    this.nodes = this.forceSimulation.nodes();
    increment.call(this, this.data, false);
    this.settings.removeCenterForce = true;

    // Start the timer.
    if (this.settings.playPause === 'play') {
        if (this.settings.runSequences === false)
            setTimeout(
                () => {
                    this.interval = startInterval.call(this, this.data);
                },
                this.settings.delay ? this.settings.modalSpeed : 0
            );
        else
            setTimeout(
                () => {
                    this.settings.sequence_index = 0;
                    this.sequence = this.settings.sequences[this.settings.sequence_index];
                    this.controls.sequences.inputs.classed(
                        'current',
                        (d) => d.label === this.sequence.label
                    );
                    runSequence.call(this, this.sequence);
                },
                this.settings.delay ? this.settings.modalSpeed : 0
            );
    }
}
