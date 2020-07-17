export default function updateText() {
    // Update time
    this.timer.text(`${this.settings.timepoint} ${this.settings.timeUnit}`);

    // Update percentages
    if (this.settings.eventCount)
        this.fociLabels
            .selectAll('tspan.actpct')
            .text((d) => `${d.count} (${d3.format('%')(d.count / this.data.nested.length)})`);

    // Update notes
    if (this.settings.timepoint === this.settings.annotations[this.notes_index].start_minute) {
        this.annotations
            .style('top', '0px')
            .transition()
            .duration(600)
            .style('top', '20px')
            .style('color', '#000000')
            .text(this.settings.annotations[this.notes_index].note);
    }

    // Make note disappear at the end.
    else if (this.settings.timepoint === this.settings.annotations[this.notes_index].stop_minute) {
        this.annotations
            .transition()
            .duration(1000)
            .style('top', '300px')
            .style('color', '#ffffff');

        this.notes_index += 1;

        if (this.notes_index === this.settings.annotations.length) {
            this.notes_index = 0;
        }
    }
}
