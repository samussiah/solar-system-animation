import id from './defineMetadata/id';
import updateIdDependentSettings from './defineMetadata/updateIdDependentSettings';
import event from './defineMetadata/event';
import updateEventDependentSettings from './defineMetadata/updateEventDependentSettings';
import orbit from './defineMetadata/orbit';
import coordinates from './defineMetadata/coordinates';
import strata from './defineMetadata/strata';
import colorScale from './defineMetadata/colorScale';

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

    // Define color scale.
    this.colorScale = colorScale.call(this, metadata);

    // Define the offset of each stratum as function of the focus coordinates, the stratum
    // sequence, and theta.
    if (this.settings.colorBy.type === 'categorical') {
        metadata.event.forEach((event, i) => {
            event.foci = metadata.strata.map((stratum, j) => {
                const focus = {
                    ...stratum,
                    x: event.x + 50 * Math.cos(stratum.angle),
                    dx: event.x + (i === 0 ? 75 : 50) * Math.cos(stratum.angle),
                    y: event.y + 50 * Math.sin(stratum.angle),
                    dy: event.y + (i === 0 ? 75 : 50) * Math.sin(stratum.angle),
                    count: 0,
                    cumulative: 0,
                };

                return focus;
            });
        });
    }

    return metadata;
}
