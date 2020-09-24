import runModal from './init/runModal';
import addForceSimulation from './init/addForceSimulation';
import addStaticForceSimulation from './init/addStaticForceSimulation';
import startInterval from './init/startInterval';

export default function init() {
    runModal.call(this);

    addStaticForceSimulation.call(this);

    this.metadata.event.forEach((event) => {
        event.forceSimulation = addForceSimulation.call(this, event);
    });

    if (this.settings.playPause === 'play') this.interval = startInterval.call(this);
}
