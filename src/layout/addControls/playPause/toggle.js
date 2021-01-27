import startInterval from '../../../init/startInterval';

export const playPause = [
    { action: 'play', label: 'Play', html: '&#9658;' },
    { action: 'pause', label: 'Pause', html: '&#10074;&#10074;' },
];

export default function toggle() {
    // Toggle setting.
    this.settings.playPause = playPause.find(
        (value) => value.action !== this.settings.playPause
    ).action;

    // Update tooltip and display text.
    this.controls.playPause.inputs
        .attr(
            'title',
            `${playPause.find((value) => value.action !== this.settings.playPause).label} animation`
        )
        .html(playPause.find((value) => value.action !== this.settings.playPause).html);

    // Stop animation.
    if (this.interval)
        this.interval.stop();

    // Restart animation.
    if (this.settings.playPause === 'play')
        this.interval = startInterval.call(
            this,
            this.sequence
                ? this.sequence.data
                : this.data
        );
}
