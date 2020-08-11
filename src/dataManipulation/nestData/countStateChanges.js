export default function countStateChanges(events) {
    const stateChanges = d3.sum(
        events.filter((event) => this.settings.eventChangeCount.includes(event.label)),
        (event) => event.count
    );

    return stateChanges;
}
