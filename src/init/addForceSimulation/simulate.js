import forceSimulationWorker from 'web-worker:./forceSimulationWorker';

export default function simulate() {
    const worker = new forceSimulationWorker();

    worker.postMessage({
        type: 'initialize',
        nodes: this.data.nested.filter((d) => !d.value.noStateChange),
        centerX: this.settings.orbitRadius / 2,
        centerY: this.settings.height / 2,
        chargeStrength: this.settings.chargeStrength,
        minRadius: this.settings.minRadius,
    });

    return worker;
}
