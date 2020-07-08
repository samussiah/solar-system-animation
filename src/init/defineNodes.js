export default function defineNodes() {
    // A node for each person's schedule
    const nodes = this.data.map(d => {
        const act = d[0].act;
        this.settings.eventCounts[act] += 1;
        const init_x = this.settings.foci[act].x + Math.random();
        const init_y = this.settings.foci[act].y + Math.random();
        const eventCounts = this.settings.eventTypes.reduce((eventCounts,eventType) => {
            eventCounts[eventType.index] = 0;
            return eventCounts;
        },{});
        eventCounts[act] += 1;

        return {
            act,
            eventCounts,
            x: init_x,
            y: init_y,
            radius: 2 + eventCounts['1'] + eventCounts['2'] + eventCounts['3'],
            color: this.settings.colorScale(eventCounts['1'] + eventCounts['2'] + eventCounts['3']),
            moves: 0,
            next_move_time: d[0].duration,
            sched: d,
        };
    });

    return nodes;
}
