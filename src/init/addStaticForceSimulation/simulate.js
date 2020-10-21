import forceSimulationWorker from 'web-worker:./forceSimulationWorker';

export default function simulate(data) {
    const worker = new forceSimulationWorker();

    worker.postMessage({
        nodes: data,
        layout: this.settings.staticLayout,
        radius: this.settings.minRadius,
        x: this.settings.orbitRadius / 2,
        y: this.settings.height / 2,
        strength: this.settings.chargeStrength,
        orbitRadius: this.settings.orbitRadius,
    });

    return worker;
}
