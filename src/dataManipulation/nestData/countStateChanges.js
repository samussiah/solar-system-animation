export default function countStateChanges(group) {
    const nStateChanges = group
        .filter((d) => d.start_timepoint <= this.settings.timepoint)
        .filter((d) => this.settings.eventChangeCount.includes(d.event)).length;

    return nStateChanges;
}
