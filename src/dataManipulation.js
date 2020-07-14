import defineEventTypes from './dataManipulation/defineEventTypes';
import nestData from './dataManipulation/nestData';

export default function dataManipulation() {
    this.data.forEach((d) => {
        d.duration = parseFloat(d.duration);
    });
    // TODO: sort ID alphanumerically - don't assume it's going to be numeric
    this.data.sort((a, b) => {
        const id_diff = a.id - b.id;
        const seq_diff = a.seq - b.seq;

        return id_diff || seq_diff;
    });
    this.eventTypes = defineEventTypes.call(this);
    this.data.nested = nestData.call(this);

    // TODO: move to settings.js
    this.settings.reset = this.settings.reset || d3.max(this.data.nested, d => d.duration);
}
