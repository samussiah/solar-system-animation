export default function text() {
    // Update timepoint control.
    this.controls.timepoint.inputs.property('value', this.settings.timepoint);

    // Update timer.
    this.containers.timer.text(`${this.settings.timepoint} ${this.settings.timeUnit}`);

    // Update slider.
    this.containers.slider
        .attr('value', this.settings.timepoint)
        .attr(
            'title',
            `The animation is ${d3.format('.1%')(
                this.settings.timepoint / this.settings.duration
            )} complete with ${this.settings.duration - this.settings.timepoint} ${
                this.settings.timeUnit.split(' ')[0]
            } to go.`
        );

    // Update focus percentages
    if (this.settings.eventCount)
        this.focusAnnotations
            .selectAll('tspan.fdg-focus-annotation__event-count')
            .text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);

    // Update frequency table.
    this.freqTable.tr
        .selectAll('td')
        .data((event) => [event.value, event.cumulative])
        .join('td')
        .text((d) => d);

    // Update notes
    //if (Array.isArray(this.settings.notes)) {
    //    if (
    //        this.settings.timepoint === this.settings.notes[this.settings.notesIndex].startTimepoint
    //    ) {
    //        this.containers.info
    //            .style('opacity', 0)
    //            .transition()
    //            .duration(600)
    //            .style('opacity', 1)
    //            .text(this.settings.notes[this.settings.notesIndex].text);
    //    }

    //    // Make note disappear at the end.
    //    else if (
    //        this.settings.timepoint === this.settings.notes[this.settings.notesIndex].stopTimepoint
    //    ) {
    //        this.containers.info.transition().duration(1000).style('opacity', 0);

    //        this.settings.notesIndex += 1;

    //        if (this.settings.notesIndex === this.settings.notes.length) {
    //            this.settings.notesIndex = 0;
    //        }
    //    }
    //}
}
