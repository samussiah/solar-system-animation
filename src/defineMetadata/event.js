import getPosition from './event/position';

export default function event() {
    // Group data by event.
    const nest = d3
        .nest()
        .key((d) => d.event)
        .rollup((group) => {
            const datum = group[0];
            const order = parseInt(datum.event_order);
            const position = datum.hasOwnProperty('event_position')
                ? parseInt(datum.event_position)
                : null;

            return {
                order,
                position,
                ids: new Set(), // individuals in the state currently
                nIds: 0, // number of individuals in the state currently
                nIdsPrevious: 0,
                idsCumulative: new Set(), // individuals that have ever been in the state
                nIdsCumulative: 0, // number of individuals that have ever been in the state
                nEvents: 0, // number of times any individual has been in the state up to the current timepoint, i.e. the total number of events that have occurred so far
                nEventsTotal: group.length, // total number of events
            };
        })
        .entries(this.data)
        .map((event) => {
            Object.assign(event, event.value); // remove nesting
            delete event.value;
            return event;
        })
        .sort(
            (a, b) => a.order - b.order || b.nEventsTotal - a.nEventsTotal // ensure events plot in order
        );

    return nest;
}
