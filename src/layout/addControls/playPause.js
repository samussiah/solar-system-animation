import toggle, { playPause as playPauseData } from './playPause/toggle';

export default function playPause() {
    const fdg = this;

    const container = this.controls.container
        .append('div')
        .classed('fdg-control fdg-control--play-pause', true);
    const inputs = container
        .append('div')
        .classed(`togglebutton fdg-input`, true)
        .attr(
            'title',
            `${
                playPauseData.find((value) => value.action !== this.settings.playPause).label
            } animation`
        )
        .html(playPauseData.find((value) => value.action !== this.settings.playPause).html);

    inputs.on('click', () => {
        toggle.call(this);
    });

    return {
        container,
        inputs,
    };
}
