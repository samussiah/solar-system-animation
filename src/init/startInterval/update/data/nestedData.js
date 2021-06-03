import getState from '../../../../data/nestData/getState';
import getAestheticValues from '../../../../data/nestData/getAestheticValues';
import getCoordinates from '../../../../data/nestData/getCoordinates';
import getColorScale from '../../../../data/nestData/getColorScale';
import getAesthetics from '../../../../data/nestData/getAesthetics';
import travelTime from './nestedData/travelTime';

export default function nestedData(data) {
    data.nested.forEach((d, i) => {
        // Capture next state.
        const currentState = getState.call(this, d.value.group);

        // On state change update current and previous state objects of individual.
        if (d.value.state !== currentState) {
            d.value.statePrevious = d.value.state;
            d.value.state = currentState;
        }

        // Get aesthetic values.
        const aestheticValues = getAestheticValues.call(this, d.value.group, d.value.state);
        d.value.colorScale = getColorScale.call(this, aestheticValues.colorValue);
        const aesthetics = getAesthetics.call(this, aestheticValues, d.value.colorScale);

        // Calcualate distance from origin and to destination.
        d.value.distance = Math.sqrt(
            (d.x - this.settings.center.x) ** 2 + (d.y - this.settings.center.y) ** 2
        );
        d.value.distanceFromFocus = Math.sqrt(
            (d.x - d.value.coordinates.x) ** 2 + (d.y - d.value.coordinates.y) ** 2
        );
        d.value.inVicinityOfFocus = d.value.distanceFromFocus < this.settings.orbitRadius / 16;

        // Update coordinates once node reaches vicinity of destination or when time since
        // previous state crosses some threshold.
        d.value.transitTime++;
        const transitThreshold =
            500 / Math.ceil(Math.sqrt(this.settings.speeds[this.settings.speed]));
        if (
            this.settings.enforceFocusVicinity === false ||
            d.value.inVicinityOfFocus ||
            d.value.statePrevious?.event === this.settings.eventCentral ||
            d.value.transitTime > transitThreshold
        ) {
            d.value.transitTime = 0;
            d.value.coordinates = getCoordinates.call(
                this,
                d.value.state,
                aestheticValues.colorValue
            );
        }

        Object.assign(d.value, aestheticValues, aesthetics);
    });
}
