export default function getState(group, index) {
    const state = index
        ? group[index]
        : group.find(
              (d, i) =>
                  (d.start_timepoint <= this.settings.timepoint &&
                      this.settings.timepoint <= d.end_timepoint) ||
                  i === group.length - 1
          );

    return state;
}
