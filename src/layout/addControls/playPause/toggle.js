import startInterval from '../../../init/startInterval';

export const playPause = [
    { action: 'play', label: 'Play', html: '&#9658;' },
    { action: 'pause', label: 'Pause', html: '&#10074;&#10074;' },
];

export default function toggle() {
    // Update setting.
    this.settings.playPause = playPause.find(
        (value) => value.action !== this.settings.playPause
    ).action; // toggle playPause setting

    // Update tooltip and display text.
    this.controls.playPause.inputs
        .attr(
            'title',
            `${playPause.find((value) => value.action !== this.settings.playPause).label} animation`
        )
        .html(playPause.find((value) => value.action !== this.settings.playPause).html);

    // Pause or play animation.
    if (this.settings.playPause === 'play')
        this.interval = startInterval.call(this, this.sequence ? this.sequence.data : this.data);
    else this.interval.stop();
}
