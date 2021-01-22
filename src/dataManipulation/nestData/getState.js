export default function getState(group, index) {
    const minTimepoint = d3.min(group, (d) => d.start_timepoint);
    const maxTimepoint = d3.max(group, (d) => d.end_timepoint);
    const state =
        index !== undefined
            ? group[index]
            : this.settings.timepoint >= maxTimepoint // last state
            ? group[group.length - 1]
            : this.settings.timepoint < minTimepoint // first state
            ? group[0]
            : group.find((d, i) =>
                    d.start_timepoint <= this.settings.timepoint &&
                    this.settings.timepoint <= d.end_timepoint
              ); // first (and hopefully only) state that overlaps the current timepoint

    return state;
}
