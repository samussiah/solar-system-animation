import countStateChanges from './getAestheticValues/countStateChanges';

export default function getAestheticValues(group, state) {
    const colorValue = this.settings.colorBy.type === 'frequency'
        ? countStateChanges.call(this, group)
        : this.settings.colorBy.variable !== null
        ? state[this.settings.colorBy.variable]
        : null;
    const sizeValue = this.settings.sizeBy.type === 'frequency'
        ? countStateChanges.call(this, group)
        : this.settings.sizeBy.variable !== null
        ? state[this.settings.sizeBy.variable]
        : null;
    const shapeValue = this.settings.shapeBy.type === 'frequency'
        ? countStateChanges.call(this, group)
        : this.settings.shapeBy.variable !== null
        ? state[this.settings.shapeBy.variable]
        : null;

    return {
        colorValue,
        sizeValue,
        shapeValue,
    };
}
