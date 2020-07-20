import set from './defineMetadata/set';
import id from './defineMetadata/id';
import event from './defineMetadata/event';
import dataDrivenSettings from './defineMetadata/dataDrivenSettings';

export default function defineMetadata() {
    // Define sets.
    this.metadata = {
        id: set.call(this, 'id'),
        event: set.call(this, 'event'),
    };

    // Add additional metadata to ID set.
    id.call(this);

    // Update settings that depend on data.
    dataDrivenSettings.call(this);

    // Add additional metadata to event set.
    event.call(this);

    // Define orbits.
    this.metadata.orbits = d3
        .nest()
        .key((d) => d.order)
        .entries(this.metadata.event.filter((event) => event.value !== this.settings.eventCentral))
        .map((d, i) => {
            d.cx = 380;
            d.cy = 365;
            d.r = (i + 1) * 100 + 50;
            return d;
        });
}
