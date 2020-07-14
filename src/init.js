import addForceLayout from './init/addForceLayout';
import addCircles from './init/addCircles';
import addFociLabels from './init/addFociLabels';
import addTimer from './init/addTimer';

export default function init() {
    this.force = addForceLayout.call(this);
    this.circles = addCircles.call(this);
    this.fociLabels = addFociLabels.call(this);
    this.notes_index = 0;
    if (this.settings.playPause === 'play')
        this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
}
