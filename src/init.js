import defineNodes from './init/defineNodes';
import addForceLayout from './init/addForceLayout';
import addCircles from './init/addCircles';
import addFociLabels from './init/addFociLabels';
import addTimer from './init/addTimer';

export default function init() {
    const fdg = this;

    this.nodes = defineNodes.call(this);
    this.force = addForceLayout.call(this);
    this.circles = addCircles.call(this);
    this.fociLabels = addFociLabels.call(this);
    this.timepoint = 0;
    this.notes_index = 0;
    setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
}
