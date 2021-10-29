import toggle, { playPause as playPauseData } from './playPause/toggle';

export default function playPause() {
    const main = this;

    const container = this.controls.container
        .append('div')
        .classed('fdg-control fdg-control--play-pause', true);
    const inputs = container
        .append('div')
        .classed(`fdg-button fdg-input`, true)
        .attr(
            'title',
            `${
                playPauseData.find((value) => value.action !== this.settings.playPause).label
            } animation.`
        )
        .html(playPauseData.find((value) => value.action !== this.settings.playPause).html);

    inputs.on('click', () => {
        if (this.timeout) this.timeout.stop();
        toggle.call(this);
    });

    return {
        container,
        inputs,
    };
}
