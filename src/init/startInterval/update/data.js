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
        d.value.state = getState.call(this, d.value.group);
        d.value.stateIndex = d.value.group.findIndex(di => di === d.value.state);
        const event = this.metadata.event
            .find((event) => event.value === d.value.state.event);

        // Count the number of ticks since previous state.
        //if (d.value.state.event === d.value.statePrevious.event)
        //    d.value.timeSincePreviousState++;
        //else if (d.value.timeSincePreviousState > 3)
        //    d.value.timeSincePreviousState = 0;
        // Calculate the length of time since previous state.
        d.value.timeSincePreviousState = this.settings.timepoint - d.value.state.start_timepoint;
        // update coordinates when:
        //   - state changes
        //   &&
        //   (
        //     - point has had enough time to reach its previous state
        //     ||
        //     - on first state change
        //   )

        // Update coordinates once time since previous state crosses some threshold.
        if (!(d.value.state.duration < 5 && d.value.timeSincePreviousState < 5 && d.value.statePrevious.event !== 'Home'))
            d.value.coordinates = { x: event.x, y: event.y };

        const datum = defineDatum.call(this, d.value.group, d.value.state, d.value.statePrevious);
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
