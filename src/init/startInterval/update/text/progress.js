export default function progress() {
    // Update progress bar.
    this.containers.progressBar.style('width', `${this.settings.progress * 100}%`);
    this.containers.progressDay
        .style('right', `${100 - this.settings.progress * 100}%`)
        .text(`Day ${this.settings.timepoint}`);

    // Update timer.
    this.containers.timer.text(`${this.settings.timepoint} ${this.settings.timeUnit}`);

    // Update progress pie.
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

    // Update timepoint control.
    this.controls.timepoint.inputs.property('value', this.settings.timepoint);
}