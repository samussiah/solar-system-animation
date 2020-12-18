import updateNestedData from './data/nestedData';
import updateEventMetadata from './data/eventMetadata';

export default function data() {
    // Count the number of individuals at each focus at previous timepoint.
    this.metadata.event.forEach((event) => {
        event.prevCount = event.count;

        if (event.foci)
            event.foci.forEach((focus) => {
                focus.prevCount = focus.count;
            });
    });

    updateNestedData.call(this);
    updateEventMetadata.call(this);
}
