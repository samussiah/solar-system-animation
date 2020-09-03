import radial from './addStaticForceSimulation/radial';
import circular from './addStaticForceSimulation/circular';

export default function addStaticForceSimulation() {
    const noStateChange = this.data.nested
        .filter((d) => d.value.noStateChange)
        .map((d) => {
            return {
                key: d.key,
            };
        });

    if (noStateChange.length) {
        //radial.call(this, noStateChange);
        //circular.call(this, noStateChange);
    }
}
