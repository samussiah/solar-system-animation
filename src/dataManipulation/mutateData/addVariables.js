export default function addVariables(has) {
    d3.nest()
        .key((d) => d.id)
        .rollup((group) => {
            group.forEach((d, i) => {
                // Define start and end timepoints when only duration exists.
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
                    d.duration = d.start_timepoint - d.end_timepoint + 1;
                }
            });

            // Define sequence
            if (!has.sequence) {
                group
                    .sort((a, b) => a.start_timepoint - b.start_timepoint)
                    .forEach((d, i) => {
                        d.seq = i;
                    });
            } else {
                group.sort((a, b) => a.seq - b.seq);
            }
        })
        .entries(this.data);
}
