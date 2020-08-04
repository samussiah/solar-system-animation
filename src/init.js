import addForceSimulation from './init/addForceSimulation';
import startInterval from './init/startInterval';

export default function init() {
    this.forceSimulation = addForceSimulation.call(this);
    if (this.settings.playPause === 'play')
        this.interval = startInterval.call(this);
}
