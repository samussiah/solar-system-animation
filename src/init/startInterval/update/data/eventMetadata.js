// Record change in number of IDs at each focus at current timepoint.
export default function eventMetadata() {
    this.metadata.event.forEach((event) => {
        // Capture IDs in the given state.
        event.data = this.data.nested
            .filter((d, i) => d.value.state.event === event.value);

        // Maintain a set of any IDs that have existed in the given state.
        event.data.forEach(id => {
            event.cumulativeIds.add(id.key);
        });

        // Count the IDs in the given state.
        event.count = event.data.length;

        // Count the number of events, i.e. the number of times any ID has existed in the given state.
        event.cumulative = this.data.filter(
            (d) => d.event === event.value && d.start_timepoint <= this.settings.timepoint
        ).length;

        // Determine the numerator.
        event.numerator = this.settings.eventCountType === 'current-id'
            ? event.count
            : this.settings.eventCountType === 'cumulative-id'
            ? event.cumulativeIds.size
            : this.settings.eventCountType === 'cumulative-event'
            ? event.cumulative
            : console.warn('Unable to determine [ event.numerator ] in [ eventMetadata ].');

        // Calculate the proportion.
        event.proportion = event.numerator / event.denominator;

        // Format the counts and proportions.
        event.proportionFmt = d3.format('.1%')(event.proportion);
        event.numeratorFmt = d3.format(',d')(event.numerator);
        event.countProportionFmt = `${event.numeratorFmt} (${event.proportionFmt})`;
        event.cumulativeFmt = d3.format(',d')(event.cumulative);

        // Define an array for the frequency table.
        event.cells = [event.label, event.countProportionFmt, event.cumulativeFmt];

        // Calculate the change in IDs in the given state from the previous timepoint.
        event.change = event.count - event.prevCount;

        if (event.foci)
            event.foci.forEach((focus) => {
                focus.data = event.data.filter((d, i) => d.value.colorValue === focus.key);
                focus.count = focus.data.length;
                focus.cumulative = this.data.filter(
                    (d) =>
                        d.event === event.value &&
                        d.colorValue === focus.key &&
                        d.start_timepoint <= this.settings.timepoint
                ).length;
                focus.proportion = focus.count / focus.denominator;

                // fmt
                focus.proportionFmt = d3.format('.1%')(focus.proportion);
                focus.countFmt = d3.format(',d')(focus.count);
                focus.countProportionFmt = `${focus.countFmt} (${focus.proportionFmt})`;
                focus.cumulativeFmt = d3.format(',d')(focus.cumulative);

                // freq table
                focus.cells = [focus.label, focus.countProportionFmt, focus.cumulativeFmt];

                // change
                focus.change = focus.count - focus.prevCount;
            });
    });
}
