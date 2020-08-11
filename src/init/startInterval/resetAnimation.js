export default function resetAnimation() {
    this.settings.timepoint = 0;

    // Update the event object of the population.
    this.metadata.event.forEach((event) => {
        event.count = 0;
    });

    this.data.nested.forEach((d) => {
        // Initial event for the given individual.
        d.value.state = d.value.group[0];

        // Define an event object for the individual.
        d.value.events.forEach((event) => {
            event.count = 0;
            event.duration = 0;
        });
        d.value.events.find((event) => event.value === d.value.state.event).count += 1;

        const event = this.metadata.event.find((event) => event.value === d.value.state.event);
        event.count += 1;

        const stateChanges = d3.sum(
            d.value.events.filter((event) => this.settings.eventChangeCount.includes(event.value)),
            (event) => event.count
        );

        d.value.x = event.x + Math.random();
        d.value.y = event.y + Math.random();
        d.value.r =
            this.settings.eventChangeCountAesthetic !== 'color'
                ? Math.min(this.settings.minRadius + stateChanges, this.settings.maxRadius)
                : this.settings.minRadius;
        d.value.color =
            this.settings.eventChangeCountAesthetic !== 'size'
                ? this.settings.color(stateChanges)
                : '#aaa';
        d.value.fill = d.value.color.replace('rgb', 'rgba').replace(')', ', 0.5)');
        d.value.stroke = d.value.color.replace('rgb', 'rgba').replace(')', ', 1)');
        d.value.moves = 0;
        d.value.next_move_time = d.value.state.duration;
    });
}
