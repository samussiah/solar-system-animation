import countStateChanges from './defineDatum/countStateChanges';
import defineRadius from './defineDatum/defineRadius';
import defineColor from './defineDatum/defineColor';

export default function defineDatum(group, state, statePrevious) {
    // Count state changes.
    const nStateChanges = countStateChanges.call(this, group, statePrevious);

    // Count state changes.
    const aesthetic = this.settings.colorBy.type === 'frequency'
        ? nStateChanges
        : state[this.settings.colorBy.variable];

    // Define radius.
    const r = defineRadius.call(this, aesthetic);

    // Define color.
    const color = defineColor.call(this, aesthetic);

    return {
        nStateChanges, // number of state changes the indivdual has experienced a thus far
        aesthetic, // value that controls color
        r, // radius of bubble
        ...color, // color/fill/stroke of bubble
    };
}
