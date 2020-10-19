import runModal from './init/runModal';
import addForceSimulation from './init/addForceSimulation';
import addStaticForceSimulation from './init/addStaticForceSimulation';
import startInterval from './init/startInterval';

export default function init() {
    runModal.call(this);

    this.staticForceSimulation = addStaticForceSimulation.call(this);

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

    //if (this.settings.playPause === 'play') this.interval = startInterval.call(this);
}
