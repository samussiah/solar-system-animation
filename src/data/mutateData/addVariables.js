export default function addVariables(has) {
    d3.nest()
        .key((d) => d.id)
        .rollup((group) => {
            group.forEach((d, i) => {
                // Define start and end timepoints when only duration exists.
                // This approach assumes data are already sorted chronologically.
                if (has.duration && !has.start_timepoint) {
                    if (i === 0) {
                        d.start_timepoint = 1;
                        d.end_timepoint = d.duration;
                    } else {
                        d.start_timepoint = group[i - 1].end_timepoint + 1;
                        d.end_timepoint = d.start_timepoint + d.duration - 1;
                    }
                }

                // Define end timepoint when only start timepoint exists.
                if (has.start_timepoint && !has.end_timepoint) {
                    d.end_timepoint =
                        i < group.length - 1
                            ? group[i + 1].start_timepoint - 1
                            : d.duration
                            ? d.start_timepoint + d.duration - 1
                            : d.start_timepoint;
                }

                // Define duration when only timepoints exist.
                if (!has.duration && has.start_timepoint && has.end_timepoint) {
                    d.duration = d.end_timepoint - d.start_timepoint + 1;
                }

                // Track transit time of node during each state.
                d.transitTime = 0;
            });

            // Define sequence
            group
                .sort((a, b) => {
                    const start_timepoint = a.start_timepoint - b.start_timepoint;
                    const end_timepoint = a.end_timepoint - b.end_timepoint;
                    const event_order = a.event_order - b.event_order;

                    // Realistically states should be unique and non-overlapping within
                    // start and end timepoint but if the library were to ever support
                    // concurrent states we include event order in the sort.
                    return start_timepoint || end_timepoint || event_order;
                })
                .forEach((d, i) => {
                    d.sequence = i;
                });
        })
        .entries(this.data);
}
