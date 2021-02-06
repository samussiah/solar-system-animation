// Generates an alternative state progression by orbit, state, and ID.
export default function orderByState() {
    if (this.settings.stateChange === 'ordered') {
        const ordered = this.data
            .map((d,i) => {
                const event = this.metadata.event.find(event => event.key === d.event);

                return {
                    event: d.event,
                    orbit: event.order,
                    event_order: event.position,
                    id: d.id,
                    id_order: this.metadata.id.findIndex(id => id.key === d.id),
                };
            });

        // TODO: within each state start timepoint should be the same for all IDs - only
        // end timepoint changes - nest by event and calculate start and endtimepoints.
        ordered
            .sort((a,b) => {
                const orbit = a.orbit - b.orbit;
                const event_order = a.event_order - b.event_order;
                const id_order = a.id_order - b.id_order;

                return orbit || event_order || id_order;
            })
            .forEach((d,i) => {
                d.start_timepoint = i;
                d.end_timepoint = i;
                d.duration = 1;
            });

        this.data.forEach(d => {
            const order = ordered.find(di => di.id === d.id && di.event === d.event);
            d.start_timepoint = order.start_timepoint;
            d.end_timepoint = order.end_timepoint;
            d.duration = 1;
        });
    }
}
