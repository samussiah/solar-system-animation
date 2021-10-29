import resetAnimation from './animation';
import updateProgress from '../update/text/progress';
import startInterval from '../../startInterval';

export default function timeout(data, countdown) {
    if (this.timeout) this.timeout.stop();

    const timeout = d3.timeout(() => {
        resetAnimation.call(this, data);
        updateProgress.call(this);
        countdown.stop();
        timeout.stop();
        this.layout.countdown
            .classed('fdg-invisible', (d) => d === this.settings.resetDelay / 1000 - 1)
            .classed('fdg-hidden', (d) => d !== this.settings.resetDelay / 1000 - 1);
        this.interval = startInterval.call(this, data);
    }, this.settings.resetDelay);

    return timeout;
}
