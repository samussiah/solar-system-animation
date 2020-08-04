import addForceSimulation from './init/addForceSimulation';
import startInterval from './init/startInterval';

export default function init() {
    this.metadata.event.forEach(event => {
        event.forceSimulation = addForceSimulation.call(this, event);
    });

    if (this.settings.playPause === 'play')
        this.interval = startInterval.call(this);
}
