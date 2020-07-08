export default function defineNodes() {
    // A node for each person's schedule
    const nodes = this.data.map((d) => {
        const act = d[0].act;
        this.settings.eventCounts[act] += 1;
        var init_x = this.settings.foci[act].x + Math.random();
        var init_y = this.settings.foci[act].y + Math.random();

        return {
            act: act,
            radius: 3,
            x: init_x,
            y: init_y,
            color: this.settings.color(act),
            moves: 0,
            next_move_time: d[0].duration,
            sched: d,
        };
    });

    return nodes;
}
