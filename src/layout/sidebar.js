import addElement from './addElement';
import addTimer from './sidebar/addTimer';
import addCountdown from './sidebar/addCountdown';

export default function sidebar(main) {
    const sidebar = addElement('sidebar', main);
    const events = addElement('events', sidebar).html(this.settings.eventLabel);
    const legends = addElement('legends', sidebar);
    const progress = addElement('progress', sidebar);
    const timepoint = addElement('timepoint', progress)
        .classed('fdg-sidebar__label', true)
        .html(
            `${this.settings.timepoint} ${
                this.settings.timepoint !== 1
                    ? this.settings.timeUnit + 's'
                    : this.settings.timeUnit
            }`
        );
    const timeRelative = addElement('time-relative', progress)
        .classed('fdg-sidebar__sub-label', true)
        .html(this.settings.timeRelative);
    const timer = addTimer.call(this, progress);
    const countdown = addCountdown.call(this, progress);
    const freqTable = addElement('freq-table', sidebar);

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
