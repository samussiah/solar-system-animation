export default function countdown() {
    let counter = this.settings.resetDelay / 1000 - 1;
    this.containers.countdown.classed('fdg-hidden', (d) => d !== counter);
    const interval = window.setInterval(() => {
        counter--;
        this.containers.countdown.classed('fdg-hidden', (d) => d !== counter);
    }, 1000);

    return interval;
}
