import addElement from '../addElement';

export default function addCountdown(progress) {
    const resetDelay = this.settings.resetDelay / 1000;

    return addElement('countdown', progress)
        .classed('fdg-sidebar__label', true)
        .selectAll('div')
        .data(d3.range(-1, resetDelay))
        .join('div')
        .text((d) => `Looping in ${d + 1} second${d === 0 ? '' : 's'}`)
        .classed('fdg-hidden', (d) => d !== resetDelay - 1)
        .classed('fdg-invisible', (d) => d === resetDelay - 1);
}
