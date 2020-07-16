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

    // Add additional metadata to event set.
    event.call(this);

    // Update settings that depend on data.
    dataDrivenSettings.call(this);
}
