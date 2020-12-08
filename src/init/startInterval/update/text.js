import updateProgress from './text/progress';
import updateCounts from './text/counts';
import updateFreqTable from './text/freqTable';

export default function text() {
    this.settings.progress = this.settings.timepoint / this.settings.duration;

    updateProgress.call(this);
    updateCounts.call(this);
    updateFreqTable.call(this);
}
