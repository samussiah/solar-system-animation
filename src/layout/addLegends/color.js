import frequency from './color/frequency';
import categorical from './color/categorical';
import continuous from './color/continuous';

export default function color() {
    let container;

    if (this.settings.colorify) {
        switch (this.settings.colorBy.type) {
            case 'frequency':
                container = frequency.call(this);
                break;
            case 'categorical':
                container = categorical.call(this);
                break;
            case 'continuous':
                container = continuous.call(this);
                break;
            default:
                return;
        }
    }

    return container;
}
