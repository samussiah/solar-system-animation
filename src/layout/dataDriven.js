import addControls from './dataDriven/addControls';
import addLegends from './dataDriven/addLegends';
import addFreqTable from './dataDriven/addFreqTable';
import addOrbits from './dataDriven/addOrbits';
import addFocusAnnotations from './dataDriven/addFocusAnnotations';
import addCustomAnnotations from './dataDriven/addCustomAnnotations';

export default function dataDriven() {
    // controls
    addControls.call(this);

    // sidebar
    addLegends.call(this);
    this.layout.freqTable = addFreqTable.call(this);

    // Draw concentric circles.
    this.orbits = addOrbits.call(this);

    // Annotate foci.
    this.focusAnnotations = addFocusAnnotations.call(this);

    // Add custom annotations.
    this.customAnnotations = addCustomAnnotations.call(this);
}
