import getState from '../../../../data/nestData/getState';
import getAestheticValues from '../../../../data/nestData/getAestheticValues';
import getCoordinates from '../../../../data/nestData/getCoordinates';
import getColorScale from '../../../../data/nestData/getColorScale';
import getAesthetics from '../../../../data/nestData/getAesthetics';

export default function nestedData(data) {
    data.nested.forEach((d, i) => {
        // Update individual to next event.
        const currentState = getState.call(this, d.value.group);

        if (d.value.state !== currentState && !d.value.locked) {
            d.value.statePrevious = d.value.state;
            d.value.state = currentState;
        }

        const aestheticValues = getAestheticValues.call(this, d.value.group, d.value.state);
        d.value.coordinates = getCoordinates.call(this, d.value.state, aestheticValues.colorValue);
        d.value.distance = Math.sqrt(
            (d.x - this.settings.center.x) ** 2 + (d.y - this.settings.center.y) ** 2
        );
        d.value.colorScale = getColorScale.call(this, aestheticValues.colorValue);
        const aesthetics = getAesthetics.call(this, aestheticValues, d.value.colorScale);

        Object.assign(d.value, aestheticValues, aesthetics);
    });
}
