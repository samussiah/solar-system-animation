import addTimer from './sidebar/addTimer';
import addCountdown from './sidebar/addCountdown';

export default function sidebar(main) {
    const container = this.util.addElement('sidebar', main);
    this.settings.width.sidebar = container.node().clientWidth;
    const events = this.util.addElement('events', container).html(this.settings.eventLabel);
    const legends = this.util.addElement('legends', container);
    const progress = this.util
        .addElement('progress', container)
        .classed('fdg-hidden', !this.settings.displayProgress);
    const timepoint = this.util
        .addElement('timepoint', progress)
        .classed('fdg-sidebar__label', true)
        .html(
            `${this.settings.timepoint} ${
                this.settings.timepoint !== 1
                    ? this.settings.timeUnit + 's'
                    : this.settings.timeUnit
            }`
        );
    const timeRelative = this.util
        .addElement('time-relative', progress)
        .classed('fdg-sidebar__sub-label', true)
        .html(this.settings.timeRelative);
    const timer = addTimer.call(this, progress);
    const countdown = addCountdown.call(this, progress);
    const freqTable = this.util.addElement('freq-table', container);

    return {
        sidebarContainer: container,
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
