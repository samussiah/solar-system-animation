//import addExplanation from './layout/addExplanation';
import addControls from './layout/addControls';
import addLegends from './layout/addLegends';
import addFreqTable from './layout/addFreqTable';
import drawOrbits from './layout/drawOrbits';
import annotateFoci from './layout/annotateFoci';

export default function dataDrivenLayout() {
    // controls
    addControls.call(this);

    // sidebar
    this.containers.timer.text(`${this.settings.timepoint} ${this.settings.timeUnit}`);
    addLegends.call(this);
    this.freqTable = addFreqTable.call(this);

    // Draw concentric circles.
    this.orbits = drawOrbits.call(this);

    // Annotate foci.
    this.focusAnnotations = annotateFoci.call(this);

    this.containers.duration.attr('title', `Duration of animation: ${this.settings.duration} ${this.settings.timeUnit}`);
}
