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
            .text((d) => d.countProportionFmt);

    if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify)
        this.metadata.event.forEach((event) => {
            event.fociLabels.selectAll('text').text((d) => d.countProportionFmt);
        });

    // Update frequency table.
    this.freqTable.tr.each(function (d) {
        const tr = d3.select(this);
        tr.selectAll('td')
            .data(d.cells)
            .join('td')
            .style('background', (di, i) =>
                i === 1
                    ? `linear-gradient(to right, #bbb 0, #bbb ${d.proportionFmt}, transparent ${d.proportionFmt})`
                    : null
            )
            .text((d) => d);
    });
}
