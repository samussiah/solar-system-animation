export default function countStateChanges(group) {
    const nStateChanges = group
        //.sort((a,b) => a.start_timepoint - b.start_timepoint)
        .filter((d, i, data) => {
            const eventPrevious = data[i - 1] ? data[i - 1].event : null;
            return (
                !this.settings.eventChangeCount.includes(eventPrevious) &&
                this.settings.eventChangeCount.includes(d.event)
            );
        })
        .filter((d) => d.start_timepoint <= this.settings.timepoint).length;

    return nStateChanges;
}
