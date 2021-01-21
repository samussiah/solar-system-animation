export default function getState(group, index) {
    const minTimepoint = d3.min(group, (d) => d.start_timepoint);
    const maxTimepoint = d3.max(group, (d) => d.end_timepoint);
    const state =
        index !== undefined
            ? group[index]
            : group.find(
                  (d, i) =>
                      (d.start_timepoint <= this.settings.timepoint &&
                          this.settings.timepoint <= d.end_timepoint) || // first (and hopefully only) state that overlaps the current timepoint
                      (this.settings.timepoint <= minTimepoint && i === 0) || // first state
                      (this.settings.timepoint >= maxTimepoint && i === group.length - 1) // last state
              );

    return state;
}
