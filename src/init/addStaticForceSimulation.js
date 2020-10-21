import simulate from './addStaticForceSimulation/simulate';
import draw from './addStaticForceSimulation/draw';

export default function addStaticForceSimulation() {
    if (this.settings.drawStaticSeparately) {
        this.containers.svgBackground.selectAll('.fdg-static').remove();

        // Capture individuals without state change.
        const noStateChange = this.data.nested
            .filter((d) => d.value.noStateChange)
            .map((d) => {
                return {
                    key: d.key,
                    category: d.value.category,
                };
            });

        // Simulate and render force layout separately for individuals within each category.
        if (this.settings.colorBy.type === 'categorical') {
            this.metadata.event[0].foci.forEach((focus) => {
                const data = noStateChange.filter((d) => d.category === focus.key);
                const worker = simulate.call(this, data);
                draw.call(this, worker);
            });
        }
        // Simulate and render force layout for all individuals.
        else {
            const worker = simulate.call(this, noStateChange);
            draw.call(this, worker);
        }
    }
}
