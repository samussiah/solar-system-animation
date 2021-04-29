import getState from '../../../../data/nestData/getState';
import getAestheticValues from '../../../../data/nestData/getAestheticValues';
import getCoordinates from '../../../../data/nestData/getCoordinates';
import getColorScale from '../../../../data/nestData/getColorScale';
import getAesthetics from '../../../../data/nestData/getAesthetics';

export default function nestedData(data) {
    data.nested.forEach((d, i) => {
        // Capture next state.
        const currentState = getState.call(this, d.value.group);

        // When state changes update current and previous state objects of individual.
        if (
            d.value.state !== currentState &&
            (this.settings.enforceFocusVicinity === false ||
                d.value.inVicinityOfFocus === true ||
                d.value.state.event === this.settings.eventCentral)
        ) {
            d.value.statePrevious = d.value.state;
            d.value.state = currentState;
        }

        const aestheticValues = getAestheticValues.call(this, d.value.group, d.value.state);
        d.value.coordinates = getCoordinates.call(this, d.value.state, aestheticValues.colorValue);
        d.value.distance = Math.sqrt(
            (d.x - this.settings.center.x) ** 2 + (d.y - this.settings.center.y) ** 2
        );
        d.value.distanceFromFocus = Math.sqrt(
            (d.x - d.value.coordinates.x) ** 2 + (d.y - d.value.coordinates.y) ** 2
        );
        d.value.inVicinityOfFocus = d.value.distanceFromFocus < this.settings.orbitRadius / 8;
        d.value.colorScale = getColorScale.call(this, aestheticValues.colorValue);
        const aesthetics = getAesthetics.call(this, aestheticValues, d.value.colorScale);

        Object.assign(d.value, aestheticValues, aesthetics);
    });
}
