export default function defineIndividualEvents(group) {
    const events = this.metadata.event.map((event) => {
        return {
            value: event.value,
            order: event.order,
            count: 0,
            duration: 0,
            totalDuration: d3.sum(
                group.filter((d) => d.event === event.value),
                (d) => d.duration
            ),
        };
    });

    return events;
}
