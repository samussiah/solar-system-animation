import resetAnimation from './animation';
import updateProgress from '../update/text/progress';
import startInterval from '../../startInterval';

export default function timeout(countdown) {
    const timeout = window.setTimeout(() => {
        resetAnimation.call(this);
        updateProgress.call(this);
        window.clearInterval(countdown);
        window.clearTimeout(timeout);
        this.containers.countdown
            .classed('fdg-invisible', (d) => d === this.settings.resetDelay / 1000 - 1)
            .classed('fdg-hidden', (d) => d !== this.settings.resetDelay / 1000 - 1);
        this.interval = startInterval.call(this);
    }, this.settings.resetDelay);

    return timeout;
}
