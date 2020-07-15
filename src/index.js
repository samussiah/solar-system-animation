import defaults from './settings';
import layout from './layout';
import dataManipulation from './dataManipulation';
import addOrbits from './layout/addOrbits';
import init from './init';

export default function forceDirectedGraph(data, element = 'body', settings = {}) {
    const fdg = {
        data,
        element,
        settings: Object.assign(defaults, settings),
    };

    layout.call(fdg);
    dataManipulation.call(fdg);
    fdg.orbits = addOrbits.call(fdg); // TODO: move out of layout?
    init.call(fdg);

    return fdg;
}
