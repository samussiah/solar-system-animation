import id from './defineMetadata/id';
import updateIdDependentSettings from './defineMetadata/updateIdDependentSettings';

import event from './defineMetadata/event';
import updateEventDependentSettings from './defineMetadata/updateEventDependentSettings';

import orbit from './defineMetadata/orbit';
import coordinates from './defineMetadata/coordinates';

import strata from './defineMetadata/strata';
import shape from './defineMetadata/shape';

import scales from './defineMetadata/scales';
import focus from './defineMetadata/focus';
import freqTable from './defineMetadata/freqTable';

// TODO: moves sets into their own function (id, event, orbit, strata (rename to colorStratum), shape (rename to shapeStratum)
export default function defineMetadata() {
    const metadata = {};

    // Define ID set and update settings that depend on the ID set.
    metadata.id = id.call(this);
    updateIdDependentSettings.call(this, metadata);

    // Define event set and update settings that depend on event set.
    metadata.event = event.call(this);
    updateEventDependentSettings.call(this, metadata);

    // Define orbit set.
    metadata.orbit = orbit.call(this, metadata);

    // Determine the dimensions of the canvas, the position of the foci, and the size of the orbits.
    coordinates.call(this, metadata);

    // Define strata set.
    metadata.strata = strata.call(this, metadata);

    // Define shape set.
    metadata.shape = shape.call(this, metadata);

    // Define color scale.
    this.scales = scales.call(this, metadata);

    // Define the offset of each stratum as function of the focus coordinates, the stratum
    // sequence, and theta.
    focus.call(this, metadata);

    // Calculate frequencies and percentages to populate annotation foci and frequency table.
    this.data.freqTable = freqTable.call(this, metadata);

    return metadata;
}
