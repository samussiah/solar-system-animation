import countStateChanges from './defineDatum/countStateChanges';
import defineRadius from './defineDatum/defineRadius';
import defineColor from './defineDatum/defineColor';

export default function defineDatum(group, state) {
    // Count state changes.
    const nStateChanges = countStateChanges.call(this, group);

    // Count state changes.
    const aesthetic =
        this.settings.colorBy.type === 'frequency'
            ? nStateChanges
            : state[this.settings.colorBy.variable];

    // Define radius.
    const r = defineRadius.call(this, nStateChanges);

    // Define color.
    const color = defineColor.call(this, aesthetic);

    return {
        nStateChanges, // number of state changes the indivdual has experienced a thus far
        aesthetic, // value that controls color
        r, // radius of bubble
        ...color, // color/fill/stroke of bubble
    };
}

/*
    // Define radius input.
    const rInput = this.settings.

    // Define radius.
    const r = defineRadius.call(this, rInput);

    // Define color input.
    const colorInput =
        this.settings.colorBy.type === 'frequency'
            ? nStateChanges
            : state[this.settings.colorBy.variable];

    // Define color.
    const color = defineColor.call(this, colorInput);
*/
