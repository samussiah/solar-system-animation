import addElement from './addElement';
import ProgressBar from 'progressbar.js';

export default function sidebar(main) {
    const sidebar = addElement('sidebar', main);
    const legends = addElement('legends', sidebar);
    const progress = addElement('progress', sidebar);
    const timer = addElement('timer', progress);
    progress.circle = new ProgressBar.Circle(progress.node(), {
        color: '#555',
        trailColor: '#ccc',
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1,
        text: {
            autoStyleContainer: false,
        },
        from: {
            color: '#aaa',
            width: 1,
        },
        to: {
            color: '#333',
            width: 4,
        },
        step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            circle.setText(
                `${
                    circle.value() < 0.0095
                        ? d3.format('.1%')(circle.value())
                        : d3.format('.0%')(circle.value())
                } complete`
            );
        },
    });

    const resetDelay = this.settings.resetDelay / 1000;
    const countdown = addElement('countdown', progress)
        .selectAll('div')
        .data(d3.range(-1, resetDelay))
        .join('div')
        .text((d) => `Looping in ${d + 1} second${d === 0 ? '' : 's'}`)
        .classed('fdg-hidden', d => d !== resetDelay - 1)
        .classed('fdg-invisible', d => d === resetDelay - 1);
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
