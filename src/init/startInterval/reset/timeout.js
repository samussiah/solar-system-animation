import resetAnimation from './animation';
import startInterval from '../../startInterval';

export default function timeout(countdown) {
    const timeout = window.setTimeout(() => {
        resetAnimation.call(this);
        this.containers.timer.text(`${this.settings.timepoint} ${this.settings.timeUnit}`);
        this.settings.progress = 0;
        this.containers.stopwatch.foreground
            .transition()
            .duration(this.settings.speed)
            .attrTween(
                'd',
                this.util.arcTween(
                    this.settings.progress * Math.PI * 2,
                    this.containers.stopwatch.arc
                )
            )
            .style('fill', d3.interpolateRdYlGn(1 - this.settings.progress));
        window.clearInterval(countdown);
        window.clearTimeout(timeout);
        this.containers.countdown
            .classed('fdg-invisible', (d) => d === this.settings.resetDelay / 1000 - 1)
            .classed('fdg-hidden', (d) => d !== this.settings.resetDelay / 1000 - 1);
        this.interval = startInterval.call(this);
    }, this.settings.resetDelay);

    return timeout;
}
