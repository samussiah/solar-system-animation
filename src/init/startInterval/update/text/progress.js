export default function progress() {
    // Update timepoint.
    this.layout.timepoint.text(
        `${this.settings.timepoint} ${
            this.settings.timepoint !== 1 ? this.settings.timeUnit + 's' : this.settings.timeUnit
        }`
    );

    // Update timer.
    this.layout.progress.attr(
        'title',
        `The animation is ${d3.format('.1%')(this.settings.progress)} complete with ${
            this.settings.duration - this.settings.timepoint
        } ${this.settings.timeUnit.split(' ')[0]} to go.`
    );
    this.layout.timer.foreground
        .transition()
        .duration(this.settings.speed)
        .attrTween(
            'd',
            this.util.arcTween(this.settings.progress * Math.PI * 2, this.layout.timer.arc)
        );
    this.layout.timer.percentComplete.text(
        this.settings.progress < 0.0095
            ? d3.format('.1%')(this.settings.progress)
            : d3.format('.0%')(this.settings.progress)
    );

    // Update timepoint control.
    this.controls.timepoint.inputs.property('value', this.settings.timepoint);
}
