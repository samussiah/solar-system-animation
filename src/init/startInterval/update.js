import updateData from './update/data';
import updateOrbits from './update/orbits';
import updateText from './update/text';

export default function update(data) {
    // Update the node data.
    updateData.call(this, data);

    // Gradually transition the radius of the orbits to match the median position of the nodes
    // along each orbit.  As the nodes at each focus influence the position of nodes at other foci,
    // nodes gradually congregate off their orbit.
    //updateOrbits.call(this);

    // Update timer, focus labels, and annotations.
    updateText.call(this);
}
