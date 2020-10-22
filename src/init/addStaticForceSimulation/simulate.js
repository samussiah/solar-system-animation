import forceSimulationWorker from 'web-worker:./forceSimulationWorker';

export default function simulate(data, x, y, color) {
    const worker = new forceSimulationWorker();

    worker.postMessage({
        // data
        nodes: data,

        // force simulation settings
        layout: this.settings.staticLayout,
        strength: this.settings.chargeStrength,
        orbitRadius: this.settings.orbitRadius,

        // coordinates
        x,
        y,

        // aesthetics
        radius: this.settings.minRadius,
        color,
    });

    return worker;
}
