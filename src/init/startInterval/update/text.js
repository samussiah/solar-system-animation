export default function text() {
    this.settings.progress = this.settings.timepoint / this.settings.duration;

    // Update timepoint control.
    this.controls.timepoint.inputs.property('value', this.settings.timepoint);

    // Update timer.
    this.containers.timer.text(`${this.settings.timepoint} ${this.settings.timeUnit}`);

    // Update progress bar.
    this.containers.progress.attr(
        'title',
        `The animation is ${d3.format('.1%')(this.settings.progress)} complete with ${
            this.settings.duration - this.settings.timepoint
        } ${this.settings.timeUnit.split(' ')[0]} to go.`
    );
    this.containers.stopwatch.foreground
        .transition()
        .duration(this.settings.speed)
        .attrTween(
            'd',
            this.util.arcTween(this.settings.progress * Math.PI * 2, this.containers.stopwatch.arc)
        )
        .style('fill', d3.interpolateRdYlGn(1 - this.settings.progress));
    this.containers.stopwatch.percentBackground.text(
        this.settings.progress < 0.0095
            ? d3.format('.1%')(this.settings.progress)
            : d3.format('.0%')(this.settings.progress)
    );
    this.containers.stopwatch.percentForeground.text(
        this.settings.progress < 0.0095
            ? d3.format('.1%')(this.settings.progress)
            : d3.format('.0%')(this.settings.progress)
    );

    // Update focus percentages
    if (this.settings.eventCount)
        this.focusAnnotations
            .selectAll('tspan.fdg-focus-annotation__event-count')
            .text((d) => `${d.count} (${d3.format('.1%')(d.count / this.data.nested.length)})`);

    if (this.settings.colorBy.type === 'categorical')
        this.metadata.event.forEach((event) => {
            event.fociLabels
                .selectAll('text')
                .text((d) => `${d.count} (${d3.format('.1%')(d.count / d.n)})`);
        });

    // Update frequency table.
    this.freqTable.tr
        .selectAll('td')
        .data((event) => [event.value, event.cumulative])
        .join('td')
        .text((d) => (typeof d === 'number' ? d3.format(',d')(d) : d));
}
