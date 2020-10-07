import radial from './addStaticForceSimulation/radial';
import circular from './addStaticForceSimulation/circular';

export default function addStaticForceSimulation() {
    if (this.settings.drawStaticSeparately) {
        const noStateChange = this.data.nested
            .filter((d) => d.value.noStateChange)
            .map((d) => {
                return {
                    key: d.key,
                };
            });

        const staticForceSimulation =
            this.settings.staticLayout === 'radial'
                ? radial.call(this, noStateChange)
                : circular.call(this, noStateChange);

        return staticForceSimulation;
    }
}
