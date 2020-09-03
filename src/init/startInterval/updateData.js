import getState from '../../dataManipulation/nestData/getState';
//import updateEventCount from './updateData/updateEventCount';
import updateIndividual from './updateData/updateIndividual';
import updateFocus from './updateData/updateFocus';
import updateCumulative from './updateData/updateCumulative';
//import countStateChanges from './nestData/countStateChanges';
import defineRadius from '../../dataManipulation/nestData/defineRadius';
import defineColor from '../../dataManipulation/nestData/defineColor';

export default function updateData() {
    // Record number of IDs at each focus at previous timepoint.
    this.metadata.event.forEach((event) => {
        event.prevCount = event.count;
    });

    this.data.nested.forEach((d) => {
        const currEvent = d.value.state.event;
        d.value.currEvent = currEvent;
        d.movesSinceChange++;
        //if (d.movesSinceChange === 3) {
        //    d.fx = d.x;
        //    d.fy = d.y;
        //}

        // Move individual to next state when timepoint reaches cumulative duration of current state.
        if (
            d.value.nextStateChange === this.settings.timepoint &&
            this.settings.timepoint < d.value.duration
        ) {
            d.value.prevEvent = currEvent;
            d.movesSinceChange = 0;
            //delete d.fx;
            //delete d.fy;

            // Increment number of moves
            d.value.moves += 1;

            // Update individual to next event.
            d.value.state = getState.call(this, d.value.group, d.value.moves);

            // Update individual event count at current event.
            updateIndividual.call(this, d.value.events, d.value.state.event, d.value.prevEvent);

            // Update population count at previous and current events.
            updateFocus.call(this, this.metadata.event, d.value.state.event);
            updateCumulative.call(
                this,
                this.metadata.event,
                d.value.state.event,
                d.value.prevEvent
            );
            updateFocus.call(this, this.metadata.event, currEvent, false);

            // Update timepoint of next state change.
            d.value.nextStateChange += d.value.group[d.value.moves].duration;
        }

        // Add to new activity count
        d.value.stateChanges = d3.sum(
            d.value.events.filter((event) => this.settings.eventChangeCount.includes(event.value)),
            (event) => event.count
        );

        // Define radius.
        d.value.r = defineRadius.call(this, d.value.stateChanges);

        // Define color.
        Object.assign(d.value, defineColor.call(this, d.value.stateChanges));
    });

    // Record change in number of IDs at each focus at current timepoint.
    this.metadata.event.forEach((event) => {
        event.change = event.count - event.prevCount;
        event.data = this.data.nested.filter((d) => d.value.state.event === event.value);
        //.map(d => ({;
    });
}
