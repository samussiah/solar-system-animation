import getState from '../../../dataManipulation/nestData/getState';
import countStateChanges from '../../../dataManipulation/nestData/countStateChanges';
import defineRadius from '../../../dataManipulation/nestData/defineRadius';
import defineColor from '../../../dataManipulation/nestData/defineColor';

export default function data() {
    // Count the number of individuals at each focus at previous timepoint.
    this.metadata.event.forEach((event) => {
        event.prevCount = event.count;
    });

    this.data.nested.forEach((d) => {
        // Update individual to next event.
        d.value.statePrevious = d.value.state;
        d.value.state = getState.call(this, d.value.group);

        // Count state changes.
        d.value.nStateChanges = countStateChanges.call(this, d.value.group);

        // Define radius.
        d.value.r = defineRadius.call(this, d.value.nStateChanges);

        // Define color.
        Object.assign(d.value, defineColor.call(this, d.value.nStateChanges));
    });

    // Record change in number of IDs at each focus at current timepoint.
    this.metadata.event.forEach((event) => {
        event.data = this.data.nested.filter((d) => d.value.state.event === event.value);
        event.count = event.data.length;
        event.cumulative = this.data.filter(
            (d) => d.event === event.value && d.start_timepoint <= this.settings.timepoint
        ).length;
        event.change = event.count - event.prevCount;
    });
}
