export default function updateText() {
    // Update time
    this.containers.timer.text(`${this.settings.timepoint} ${this.settings.timeUnit}`);

    // Update percentages
    if (this.settings.eventCount)
        this.focusAnnotations
            .selectAll('tspan.fdg-focus-annotation__event-count')
            .text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);

    // Update notes
    if (this.settings.timepoint === this.settings.notes[this.settings.notesIndex].startTimepoint) {
        this.containers.info
            .style('opacity', 0)
            .transition()
            .duration(600)
            .style('opacity', 1)
            .text(this.settings.notes[this.settings.notesIndex].text);
    }

    // Make note disappear at the end.
    else if (
        this.settings.timepoint === this.settings.notes[this.settings.notesIndex].stopTimepoint
    ) {
        this.containers.info.transition().duration(1000).style('opacity', 0);

        this.settings.notesIndex += 1;

        if (this.settings.notesIndex === this.settings.notes.length) {
            this.settings.notesIndex = 0;
        }
    }
}
