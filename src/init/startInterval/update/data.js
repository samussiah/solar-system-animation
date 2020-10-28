import getState from '../../../dataManipulation/nestData/getState';
import defineDatum from '../../../dataManipulation/nestData/defineDatum';

export default function data() {
    // Count the number of individuals at each focus at previous timepoint.
    this.metadata.event.forEach((event) => {
        event.prevCount = event.count;
    });

    this.data.nested.forEach((d) => {
        // Update individual to next event.
        d.value.statePrevious = d.value.state;
        const event = this.metadata.event.find((event) => event.value === d.value.state.event);
        d.value.coordinates = { x: event.x, y: event.y };

        // Calculate Euclidean distance between point and destination.
        d.value.distance = Math.sqrt((event.x - d.x) ** 2 + (event.y - d.y) ** 2);

        // calculate the Euclidean distance between a bubble and its destination and only until
        // that distance is below a certain threshold is the bubble allowed to progress to the next
        // destination.

        // Ensure point reaches a minimum distance from destination
        // before moving to next destination.
        if (d.value.distance < this.settings.orbitRadius / 4)
            d.value.state = getState.call(this, d.value.group);

        const datum = defineDatum.call(this, d.value.group, d.value.state, d.value.statePrevious);
        Object.assign(d.value, datum);
    });
    //console.table(d3.nest().key(d => d.value.state.event).rollup(group => d3.median(group, d => d.y)).entries(this.data.nested));
    //console.table(d3.nest().key(d => d.value.coordinates.x).rollup(group => group.length).entries(this.data.nested));

    // Record change in number of IDs at each focus at current timepoint.
    this.metadata.event.forEach((event) => {
        event.data = this.data.nested.filter((d, i) => d.value.state.event === event.value);
        event.count = event.data.length;
        event.cumulative = this.data.filter(
            (d) => d.event === event.value && d.start_timepoint <= this.settings.timepoint
        ).length;
        event.change = event.count - event.prevCount;
    });
}
