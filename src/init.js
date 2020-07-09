import addForceLayout from './init/addForceLayout';
import addCircles from './init/addCircles';
import addFociLabels from './init/addFociLabels';
import addTimer from './init/addTimer';

export default function init() {
    console.log(this.data.nested);
    console.log(this.data.nested[0]);

    this.force = addForceLayout.call(this);
    this.circles = addCircles.call(this);
    this.fociLabels = addFociLabels.call(this);
    this.notes_index = 0;
    setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
}
