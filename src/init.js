import runModal from './init/runModal';
import addStaticForceSimulation from './init/addStaticForceSimulation';
import addForceSimulation from './init/addForceSimulation';
import startInterval from './init/startInterval';

export default function init() {
    // Cycle through text that displays over animation.
    runModal.call(this);

    // Add a static force layout in the background for individuals that never change state.
    addStaticForceSimulation.call(this);

    // Add a dynamic force layout in the middleground.
    addForceSimulation.call(this);

    // Start the timer.
    if (this.settings.playPause === 'play') setTimeout(() => {
        this.interval = startInterval.call(this);
    }, this.settings.delay ? this.settings.modalSpeed : 0);
}
