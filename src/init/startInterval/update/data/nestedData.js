import getState from '../../../../dataManipulation/nestData/getState';
import getAestheticValues from '../../../../dataManipulation/nestData/getAestheticValues';
import getCoordinates from '../../../../dataManipulation/nestData/getCoordinates';
import getColorScale from '../../../../dataManipulation/nestData/getColorScale';
import getAesthetics from '../../../../dataManipulation/nestData/getAesthetics';

export default function nestedData(data) {
    data.nested.forEach((d) => {
        // Update individual to next event.
        const currentState = getState.call(this, d.value.group);

        if (d.value.state !== currentState) {
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
