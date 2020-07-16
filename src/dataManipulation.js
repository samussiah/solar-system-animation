import defineEventTypes from './dataManipulation/defineEventTypes';
import nestData from './dataManipulation/nestData';

export default function dataManipulation() {
    this.data.forEach((d) => {
        d.seq = parseInt(d.seq);
        d.duration = parseFloat(d.duration);
    });

    const numericId = this.data.every(
        (d) => /^-?\d+\.?\d*$/.test(d.id) || /^-?\d*\.?\d+$/.test(d.id)
    );

    this.data.sort((a, b) => {
        const id_diff = numericId ? +a.id - +b.id : a.id < b.id ? -1 : b.id < a.id ? 1 : 0;
        const seq_diff = a.seq - b.seq;

        return id_diff || seq_diff;
    });
    this.eventTypes = defineEventTypes.call(this);
    this.data.nested = nestData.call(this);

    // TODO: move to settings.js
    this.settings.reset = this.settings.reset || d3.max(this.data.nested, (d) => d.duration);
}
