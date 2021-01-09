import filterData from './eventMetadata/filterData';
import updateIdSet from './eventMetadata/updateIdSet';
import countCumulative from './eventMetadata/countCumulative';
import getNumerator from './eventMetadata/getNumerator';

// Update states and strata at each timepoint.
export default function eventMetadata() {
    this.metadata.event.forEach((event) => {
        // Subset data on individuals in the given state.
        event.data = filterData(this.data.nested, ['value', 'state', 'event'], event.key);

        // Update current set of individuals.
        event.ids = updateIdSet(event.data, event.ids);
        event.nIds = event.ids.size;

        // Update cumulative set of individuals.
        updateIdSet(event.data, event.idsCumulative, true);
        event.nIdsCumulative = event.idsCumulative.size;

        // Update cumulative number of events.
        event.nEvents = countCumulative(this.data, this.settings.timepoint, event.key);

        // Determine numerator that appears at each focus.
        event.numerator = getNumerator(this.settings.eventCountType, {
            nIds: event.nIds,
            nIdsCumulative: event.nIdsCumulative,
            nEvents: event.nEvents,
        });

        // Calculate the proportion.
        event.proportion = event.numerator / event.denominator;

        // Format the counts and proportions.
        event.fmt = {
            numerator: d3.format(',d')(event.numerator),
            percent: d3.format('.1%')(event.proportion),
            nEvents: d3.format(',d')(event.nEvents),
        };
        event.fmt.numeratorPercent = `${event.fmt.numerator} (${event.fmt.percent})`;
        event.displayValue = this.settings.freqTable.countType === 'event'
            ? event.fmt.nEvents
            : event.fmt.numeratorPercent;

        // Calculate the change in IDs in the given state from the previous timepoint.
        event.change = event.nIds - event.nIdsPrevious;

        if (event.foci)
            event.foci.forEach((focus) => {
                // Subset data on individuals in the given state and stratum.
                focus.data = filterData(event.data, ['value', 'colorValue'], focus.key);

                // Update current set of individuals.
                focus.ids = updateIdSet(focus.data, focus.ids);
                focus.nIds = focus.ids.size;

                // Update cumulative set of individuals.
                updateIdSet(focus.data, focus.idsCumulative, true);
                focus.nIdsCumulative = focus.idsCumulative.size;

                // Update cumulative number of events.
                focus.nEvents = countCumulative(
                    this.data,
                    this.settings.timepoint,
                    event.key,
                    { key: this.settings.colorBy.variable, value: focus.key }
                );

                // Determine numerator that appears at each focus.
                focus.numerator = getNumerator(this.settings.eventCountType, {
                    nIds: focus.nIds,
                    nIdsCumulative: focus.nIdsCumulative,
                    nEvents: focus.nEvents,
                });

                // Calculate the proportion.
                focus.proportion = focus.numerator / focus.denominator;

                // fmt
                focus.fmt = {
                    numerator: d3.format(',d')(focus.numerator),
                    percent: d3.format('.1%')(focus.proportion),
                    nEvents: d3.format(',d')(focus.nEvents),
                };
                focus.fmt.numeratorPercent = `${focus.fmt.numerator} (${focus.fmt.percent})`;
                focus.displayValue = this.settings.countType === 'event'
                    ? focus.fmt.nEvents
                    : focus.fmt.numeratorPercent;

                // freq table
                focus.cells =
                    this.settings.freqTable.structure === 'vertical'
                        ? [focus.key, focus.fmt.numeratorPercent, focus.fmt.nEvents]
                        : [
                              focus.key,
                              focus.displayValue,
                              ...(focus.foci
                                  ? focus.foci.map((focus) => focus.displayValue)
                                  : []),
                          ];

                // change
                focus.change = focus.nIds - focus.nIdsPrevious;
            });

        // Define an array for the frequency table.
        event.cells =
            this.settings.freqTable.structure === 'vertical'
                ? [event.key, event.fmt.numeratorPercent, event.fmt.nEvents]
                : [
                      event.key,
                        this.settings.freqTable.countType === 'id' ? event.displayValue : event.nEvents,
                      ...(event.foci ? event.foci.map((focus) => focus.displayValue) : []),
                  ];
    });
}
