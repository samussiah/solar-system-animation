export default function countdown() {
    let counter = this.settings.resetDelay / 1000 - 1;
    this.containers.countdown
        .classed('fdg-invisible', false)
        .classed('fdg-hidden', (d) => d !== counter);
    const interval = d3.interval(() => {
        counter--;
        this.containers.countdown.classed('fdg-hidden', (d) => d !== counter);
    }, 1000);

    return interval;
}
