import getState from '../../../dataManipulation/nestData/getState';
import defineDatum from '../../../dataManipulation/nestData/defineDatum';

export default function data() {
    // Count the number of individuals at each focus at previous timepoint.
    this.metadata.event.forEach((event) => {
        event.prevCount = event.count;
    });

    this.data.nested.forEach((d) => {
        // Update individual to next event.
        const currentState = getState.call(this, d.value.group);

        if (d.value.state !== currentState) {
            d.value.statePrevious = d.value.state;
            d.value.state = currentState;
        }

        const event = this.metadata.event.find((event) => event.value === d.value.state.event);
        d.value.coordinates = { x: event.x, y: event.y };

        const datum = defineDatum.call(this, d.value.group, d.value.state);
        Object.assign(d.value, datum);
    });

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
