import resetAnimation from './animation';
import startInterval from '../../startInterval';

export default function timeout(countdown) {
    const timeout = window.setTimeout(() => {
        resetAnimation.call(this);
        this.containers.timer.text(`${this.settings.timepoint} ${this.settings.timeUnit}`);
        this.containers.progress.circle.animate(this.settings.timepoint / this.settings.duration);
        window.clearInterval(countdown);
        window.clearTimeout(timeout);
        this.containers.countdown
            .classed('fdg-invisible', d => d === this.settings.resetDelay / 1000 - 1)
            .classed('fdg-hidden', d => d !== this.settings.resetDelay / 1000 - 1);
        this.interval = startInterval.call(this);
    }, this.settings.resetDelay);

    return timeout;
}
