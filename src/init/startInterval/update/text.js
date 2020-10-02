export default function text() {
    // Update timepoint control.
    this.controls.timepoint.inputs.property('value', this.settings.timepoint);

    // Update timer.
    this.containers.timer.text(`${this.settings.timepoint} ${this.settings.timeUnit}`);

    // Update progress bar.
    this.containers.progress.attr(
        'title',
        `The animation is ${d3.format('.1%')(
            this.settings.timepoint / this.settings.duration
        )} complete with ${this.settings.duration - this.settings.timepoint} ${
            this.settings.timeUnit.split(' ')[0]
        } to go.`
    );
    this.containers.progress.circle.animate(this.settings.timepoint / this.settings.duration);

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
        .text((d) => (typeof d === 'number' ? d3.format(',d')(d) : d));
}
