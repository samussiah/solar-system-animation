import filterData from './eventMetadata/filterData';
import updateIdSet from './eventMetadata/updateIdSet';
import countCumulative from './eventMetadata/countCumulative';
import getNumerator from './eventMetadata/getNumerator';

// Update states and strata at each timepoint.
export default function eventMetadata() {
    this.metadata.event.forEach((event) => {
        // Filter data.
        event.data = filterData(this.data.nested, ['value', 'state', 'event'], event.value);

        // Count.
        event.count = event.data.length;
        updateIdSet(event.data, event.cumulativeIds);
        event.cumulative = countCumulative(this.data, this.settings.timepoint, {
            key: 'event',
            value: event.value,
        });
        event.numerator = getNumerator(this.settings.eventCountType, {
            ids: event.count,
            cumulativeIds: event.cumulativeIds.size,
            events: event.cumulative,
        });

        // Calculate the proportion.
        event.proportion = event.numerator / event.denominator;

        // Format the counts and proportions.
        event.proportionFmt = d3.format('.1%')(event.proportion);
        event.numeratorFmt = d3.format(',d')(event.numerator);
        event.countProportionFmt = `${event.numeratorFmt} (${event.proportionFmt})`;
        event.cumulativeFmt = d3.format(',d')(event.cumulative);

        // Define an array for the frequency table.
        event.cells =
            this.settings.freqTable.structure === 'vertical'
                ? [event.label, event.countProportionFmt, event.cumulativeFmt]
                : [
                      event.label,
                      event.countProportionFmt,
                      ...(event.foci ? event.foci.map((focus) => focus.countProportionFmt) : []),
                  ];

        // Calculate the change in IDs in the given state from the previous timepoint.
        event.change = event.count - event.prevCount;

        if (event.foci)
            event.foci.forEach((focus) => {
                // Filter data.
                focus.data = filterData(event.data, ['value', 'colorValue'], focus.key);

                // Count.
                focus.count = focus.data.length;
                updateIdSet(focus.data, focus.cumulativeIds);
                focus.cumulative = countCumulative(
                    this.data,
                    this.settings.timepoint,
                    { key: 'event', value: event.value },
                    { key: this.settings.colorBy.variable, value: focus.key }
                );
                focus.numerator = getNumerator(this.settings.eventCountType, {
                    ids: focus.count,
                    cumulativeIds: focus.cumulativeIds.size,
                    events: focus.cumulative,
                });

                // Calculate the proportion.
                focus.proportion = focus.numerator / focus.denominator;

                // fmt
                focus.proportionFmt = d3.format('.1%')(focus.proportion);
                focus.countFmt = d3.format(',d')(focus.numerator);
                focus.countProportionFmt = `${focus.countFmt} (${focus.proportionFmt})`;
                focus.cumulativeFmt = d3.format(',d')(focus.cumulative);

                // freq table
                focus.cells =
                    this.settings.freqTable.structure === 'vertical'
                        ? [focus.label, focus.countProportionFmt, focus.cumulativeFmt]
                        : [
                              focus.label,
                              focus.countProportionFmt,
                              ...(focus.foci
                                  ? focus.foci.map((focus) => focus.countProportionFmt)
                                  : []),
                          ];

                // change
                focus.change = focus.count - focus.prevCount;
            });
    });
}
