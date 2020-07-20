import util from './util/index';
import defaults from './settings';
import defineMetadata from './defineMetadata';
import layout from './layout';
import dataManipulation from './dataManipulation';
import init from './init';

export default function forceDirectedGraph(data, element = 'body', settings = {}) {
    const fdg = {
        data,
        element,
        settings: Object.assign(defaults, settings),
        util,
    };

    defineMetadata.call(fdg); // calculate characteristics of variables in data
    layout.call(fdg); // update the DOM
    dataManipulation.call(fdg); // mutate and structure data
    init.call(fdg); // run the simulation
    d3.range(10).forEach(i => console.log(fdg.settings.color(i)));
    console.log(fdg.settings.colorScale().domain());
    console.log(fdg.settings.colorScale().range());
    return fdg;
}
