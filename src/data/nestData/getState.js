export default function getState(group, index) {
    const minTimepoint = d3.min(group, (d) => d.start_timepoint);
    const maxTimepoint = d3.max(group, (d) => d.end_timepoint);

    let state = group.find(
        (d, i) =>
            d.start_timepoint <= this.settings.timepoint &&
            this.settings.timepoint <= d.end_timepoint
    ); // first (and hopefully only) state that overlaps the current timepoint

    switch (true) {
        case index !== undefined:
            state = group[index];
            break;
        case this.settings.timepoint >= maxTimepoint:
            state = group[group.length - 1];
            break;
        case this.settings.timepoint < minTimepoint:
            state = group[0];
            break;
        case state === undefined:
            state = group
                .slice()
                .sort((a, b) => b.start_timepoint - a.start_timepoint)
                .find((d) => d.start_timepoint <= this.settings.timepoint);
            break;
        default:
            break;
    }
    //const state =
    //    index !== undefined
    //        : this.settings.timepoint >= maxTimepoint // last state
    //        ? group[group.length - 1]
    //        : this.settings.timepoint < minTimepoint // first state
    //        ? group[0]
    //        : group.find((d, i) =>
    //                d.start_timepoint <= this.settings.timepoint &&
    //                this.settings.timepoint <= d.end_timepoint
    //          ); // first (and hopefully only) state that overlaps the current timepoint

    return state;
}
