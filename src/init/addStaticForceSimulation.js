import simulate from './addStaticForceSimulation/simulate';
import draw from './addStaticForceSimulation/draw';

// TODO: add one static force simulation per state rather than only at the central state
export default function addStaticForceSimulation() {
    if (this.settings.drawStaticSeparately) {
        this.layout.svgBackground.selectAll('.fdg-static').remove();

        // Capture individuals without state change.
        const noStateChange = this.data.nested
            .filter((d) => d.value.noStateChange)
            .map((d) => {
                return {
                    key: d.key,
                    colorValue: d.value.colorValue,
                    color: d.value.color,
                };
            });

        // Simulate and render force layout separately for individuals within each color stratum.
        if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
            this.metadata.event[0].foci.forEach((focus) => {
                const data = noStateChange.filter((d) => d.colorValue === focus.key);

                // Pass data, coordinates, and color to web worker.
                const worker = simulate.call(this, data, focus.x, focus.y, focus.key);

                // Pass web worker to draw function.
                draw.call(this, worker);
            });
        }
        // Simulate and render force layout for all individuals.
        else {
            // Pass data, coordinates, and color to web worker.
            const worker = simulate.call(
                this,
                noStateChange,
                this.settings.orbitRadius / 2,
                this.settings.height.main / 2,
                'main'
            );

            // Pass web worker to draw function.
            draw.call(this, worker);
        }
    }
}
