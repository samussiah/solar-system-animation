import runModal from './init/runModal';
import addStaticForceSimulation from './init/addStaticForceSimulation';
import addForceSimulation from './init/addForceSimulation';
import { forceManyBodySampled } from 'd3-force-sampled';
import tick from './init/addForceSimulation/tick';
import simulate from './init/addForceSimulation/simulate';
import draw from './init/addForceSimulation/draw';
import startInterval from './init/startInterval';

export default function init() {
    runModal.call(this);

    addStaticForceSimulation.call(this);

    //this.metadata.event.forEach((event) => {
    //    if (event.foci === undefined) {
    //        const forceSimulation = addForceSimulation.call(
    //            this,
    //            event.data.filter((d) => !d.value.noStateChange), // data
    //            event.x, // x-coordinate
    //            event.y // y-coordinate
    //        );
    //        forceSimulation.category = null;
    //        forceSimulation.coordinates = [event.x, event.y];

    //        event.forceSimulation = [forceSimulation];
    //    } else {
    //        event.forceSimulation = event.foci.map((focus) => {
    //            const forceSimulation = addForceSimulation.call(
    //                this,
    //                event.data.filter(
    //                    (d) => !d.value.noStateChange && d.value.category === focus.key
    //                ), // data
    //                focus.x, // x-coordinate
    //                focus.y // y-coordinate
    //            );
    //            forceSimulation.category = focus.key;
    //            forceSimulation.coordinates = [focus.x, focus.y];

    //            return forceSimulation;
    //        });
    //    }
    //});

    this.forceSimulation = d3
        .forceSimulation()
        .nodes(this.data.nested.filter(d => !d.value.noStateChange))
        .alphaDecay(0.01)
        .velocityDecay(0.9)
        .force('center', d3.forceCenter(this.settings.orbitRadius / 2, this.settings.height / 2))
        .force('x', d3.forceX().x(d => d.value.coordinates.x).strength(0.3))
        .force('y', d3.forceY().y(d => d.value.coordinates.y).strength(0.3))
        //.force('charge', d3.forceManyBody().strength(this.settings.chargeStrength))
        //.force('charge', forceManyBodyReuse().strength(this.settings.chargeStrength))
        .force('charge', forceManyBodySampled().strength(this.settings.chargeStrength*10))
        .force(
            'collide',
            //d3.forceCollide().radius((d) => d.value.r + 0.5)
            d3.forceCollide().radius(this.settings.minRadius + 1)
        )
        .on('tick', tick.bind(this));

    //this.worker = simulate.call(this);
    //draw.call(this);

    if (this.settings.playPause === 'play') this.interval = startInterval.call(this);
}
