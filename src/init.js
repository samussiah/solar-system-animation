import addForceSimulation from './init/addForceSimulation';
import addStaticForceSimulation from './init/addStaticForceSimulation';
import startInterval from './init/startInterval';

export default function init() {
    this.metadata.event.forEach((event) => {
        event.tick = 0;
        event.forceSimulation = addForceSimulation.call(this, event);
    });

    addStaticForceSimulation.call(this);

    if (this.settings.playPause === 'play') this.interval = startInterval.call(this);
}
