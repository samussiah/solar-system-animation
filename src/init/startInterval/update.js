import updateData from './update/data';
import pulseOrbits from './update/pulseOrbits';
import updateText from './update/text';

export default function update() {
    // Update the node data.
    updateData.call(this);

    // Accentuate the orbits when an event occurs.
    pulseOrbits.call(this);

    // Update timer, focus labels, and annotations.
    updateText.call(this);
}
