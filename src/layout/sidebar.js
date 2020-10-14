import addElement from './addElement';
import addStopwatch from './sidebar/addStopwatch';
import addCountdown from './sidebar/addCountdown';

export default function sidebar(main) {
    const sidebar = addElement('sidebar', main);
    const legends = addElement('legends', sidebar);
    const progress = addElement('progress', sidebar);
    const timer = addElement('timer', progress).classed('fdg-sidebar__label', true);
    const stopwatch = addStopwatch.call(this, progress);
    const countdown = addCountdown.call(this, progress);
    const freqTable = addElement('freq-table', sidebar);

    return {
        sidebar,
        legends,
        stopwatch,
        progress,
        timer,
        countdown,
        freqTable,
    };
}
