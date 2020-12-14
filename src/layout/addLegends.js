import continuous from './addLegends/continuous';
import categorical from './addLegends/categorical';
import frequency from './addLegends/frequency';
import shape from './addLegends/shape';

export default function addLegends() {
    this.legends = {
        container: this.containers.legends,
    };

    // Color legend
    switch (this.settings.colorBy.type) {
        case 'frequency':
            frequency.call(this);
            break;
        case 'categorical':
            categorical.call(this);
            break;
        case 'continuous':
            continuous.call(this);
            break;
        default:
            return;
    }

    // TODO: size legend

    // Shape legend
    if (this.settings.shapify) shape.call(this);
}
