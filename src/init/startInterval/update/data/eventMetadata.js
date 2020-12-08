// Record change in number of IDs at each focus at current timepoint.
export default function eventMetadata() {
    this.metadata.event.forEach((event) => {
        event.data = this.data.nested.filter((d, i) => d.value.state.event === event.value);
        event.count = event.data.length;
        event.proportion = event.count / event.denominator;
        event.proportionFmt = d3.format('.1%')(event.proportion);
        event.cumulative = this.data.filter(
            (d) => d.event === event.value && d.start_timepoint <= this.settings.timepoint
        ).length;
        event.countFmt = d3.format(',d')(event.count);
        event.countProportionFmt = `${event.countFmt} (${event.proportionFmt})`;
        event.cumulativeFmt = d3.format(',d')(event.cumulative);
        event.cells = [event.label, event.countProportionFmt, event.cumulativeFmt];
        event.change = event.count - event.prevCount;

        if (event.foci)
            event.foci.forEach((focus) => {
                focus.data = event.data.filter((d, i) => d.value.category === focus.key);
                focus.count = focus.data.length;
                focus.proportion = focus.count / focus.denominator;
                focus.proportionFmt = d3.format('.1%')(focus.proportion);
                focus.cumulative = this.data.filter(
                    (d) =>
                        d.event === event.value &&
                        d.category === focus.key &&
                        d.start_timepoint <= this.settings.timepoint
                ).length;
                focus.countFmt = d3.format(',d')(focus.count);
                focus.countProportionFmt = `${focus.countFmt} (${focus.proportionFmt})`;
                focus.cumulativeFmt = d3.format(',d')(focus.cumulative);
                focus.cells = [focus.label, focus.countProportionFmt, focus.cumulativeFmt];
                focus.change = focus.count - focus.prevCount;
            });
    });
}
