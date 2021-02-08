// Generates an alternative state progression by orbit, state, and ID.
export default function orderByState() {
    if (this.settings.stateChange === 'ordered') {

        // start timepoint
        // - first state: 1
        // - subsequent states: position of ID in ID list of previous state
        //
        // end timepoint
        // - first state: position of ID in ID list of current state
        // - subsequent states: start timepoint of current state + position of ID in ID list of current state

        d3.nest()
            .key(d => d.id)
            .rollup(group => {
                group
                    .sort((a,b) => (
                        (a.event_order - b.event_order) ||
                        (a.event_position - b.event_position) ||
                        (a.event < b.event ? -1 : 1)
                    ));

                group
                    .forEach((d,i) => {
                        const currState = this.metadata.event
                            .find(event => event.key === d.event);
                        const prevState = this.metadata.event
                            .find(event => event.key === group[i-1]?.event);

                        if (i === 0) {
                            d.start_timepoint = 1;
                            d.end_timepoint = d.start_timepoint + currState.allIds.findIndex(id => id === d.id);
                        } else {
                            d.start_timepoint = prevState.allIds
                                .findIndex(id => id === d.id) +
                                prevState.start_timepoint + 1;
                            d.end_timepoint = currState.allIds
                                .findIndex(id => id === d.id) +
                                currState.start_timepoint;
                            d.duration = d.end_timepoint - d.start_timepoint + 1;
                        }
                    });
            })
            .entries(this.data);

        // Redefine duration of animation.
        // TODO: duration of animation should be the sum of the number of IDs in each state or something
        this.settings.duration = this.metadata.id.length * this.metadata.orbit.length + 1;
        //d3.sum(
        //    this.metadata.event,
        //    event => event.allIds.length
        //);
    }
}
