import addTimer from './sidebar/addTimer';
import addCountdown from './sidebar/addCountdown';

export default function sidebar(main) {
    const sidebar = this.util.addElement('sidebar', main);
    const events = this.util.addElement('events', sidebar).html(this.settings.eventLabel);
    const legends = this.util.addElement('legends', sidebar);
    const progress = this.util.addElement('progress', sidebar);
    const timepoint = this.util.addElement('timepoint', progress)
        .classed('fdg-sidebar__label', true)
        .html(
            `${this.settings.timepoint} ${
                this.settings.timepoint !== 1
                    ? this.settings.timeUnit + 's'
                    : this.settings.timeUnit
            }`
        );
    const timeRelative = this.util.addElement('time-relative', progress)
        .classed('fdg-sidebar__sub-label', true)
        .html(this.settings.timeRelative);
    const timer = addTimer.call(this, progress);
    const countdown = addCountdown.call(this, progress);
    const freqTable = this.util.addElement('freq-table', sidebar);

    return {
        sidebar,
        events,
        legends,
        progress,
        timepoint,
        timeRelative,
        timer,
        countdown,
        freqTable,
    };
}
