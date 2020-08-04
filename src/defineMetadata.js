import id from './defineMetadata/id';
import event from './defineMetadata/event';
import orbit from './defineMetadata/orbit';

export default function defineMetadata() {
    // Define sets.
    const metadata = {};

    // Add additional metadata to ID set.
    metadata.id = id.call(this);

    // Settings dependent on the ID set.
    this.settings.minRadius =
        this.settings.minRadius || 3;//Math.min(3000 / metadata.id.length, 3);
    this.settings.maxRadius =
        this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
    this.settings.reset = this.settings.reset || d3.max(metadata.id, (id) => id.duration);

    // Add additional metadata to event set.
    metadata.event = event.call(this);

    // Update settings that depend on event set.
    this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].value;
    this.settings.nFoci =
        this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral; // number of event types minus one
    this.settings.eventChangeCount =
        this.settings.eventChangeCount || metadata.event.slice(1).map((event) => event.value);

    // Define orbits.
    metadata.orbit = orbit.call(this, metadata.event);

    return metadata;
}
