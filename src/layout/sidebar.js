import addElement from './addElement';
import addProgressCircle from './sidebar/addProgressCircle';
import addCountdown from './sidebar/addCountdown';

export default function sidebar(main) {
    const sidebar = addElement('sidebar', main);
    const legends = addElement('legends', sidebar);
    const progress = addElement('progress', sidebar);
    const timer = addElement('timer', progress).classed('fdg-sidebar__label', true);
    progress.circle = addProgressCircle.call(this, progress);
    const countdown = addCountdown.call(this, progress);
    const freqTable = addElement('freq-table', sidebar);

    return {
        sidebar,
        legends,
        progress,
        timer,
        countdown,
        freqTable,
    };
}
