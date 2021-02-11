import updateProgress from './text/progress';
import updateLegends from './text/legends';
import updateCounts from './text/counts';
import updateFreqTable from './text/freqTable';

export default function text(data) {
    const main = this;

    this.settings.progress =
        this.settings.stateChange === 'ordered'
            ? (this.settings.timepoint - 1) / (this.settings.duration - 1) // progress > 0 for first timepoint of first sequence - annoying
            : this.settings.timepoint / this.settings.duration;

    updateProgress.call(this);
    updateLegends.call(this, data);
    updateCounts.call(this);
    updateFreqTable.call(this);

    // Display timed annotations.
    if (this.settings.annotations && Array.isArray(this.settings.annotations))
        this.customAnnotations
            .filter(function (d) {
                return (
                    d.timepoint <= main.settings.timepoint && +d3.select(this).attr('opacity') === 0
                );
            })
            .transition()
            .duration(this.settings.modalSpeed / 2)
            .attr('opacity', 1);
}
