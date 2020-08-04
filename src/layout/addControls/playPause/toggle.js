import startInterval from '../../../init/startInterval';
import updateData from '../../../init/startInterval/updateData';

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
    if (this.settings.playPause === 'play') {
        if (this.pause_timeout !== undefined) clearTimeout(this.pause_timeout);
        this.timeout = setTimeout(addTimer.bind(this), this.settings.speeds[this.settings.speed]);
    } else if (this.settings.playPause === 'pause') {
        clearTimeout(this.timeout);
        updateData.call(this);
        const resume_for_a_while = function () {
            this.force.alpha(1);
            this.pause_timeout = setTimeout(
                resume_for_a_while.bind(this),
                this.settings.speeds[this.settings.speed]
            );
        };
        this.pause_timeout = setTimeout(
            resume_for_a_while.bind(this),
            this.settings.speeds[this.settings.speed]
        );
    }
}
