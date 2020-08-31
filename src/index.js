import util from './util/index';
import defaults from './settings';
import layout from './layout';
import defineMetadata from './defineMetadata';
import dataDrivenLayout from './dataDrivenLayout';
import dataManipulation from './dataManipulation';
import init from './init';

export default function forceDirectedGraph(data, element = 'body', settings = {}) {
    const fdg = {
        data,
        element,
        settings: Object.assign(defaults, settings),
        util,
    };

    fdg.containers = layout.call(fdg); // add elements to DOM
    fdg.metadata = defineMetadata.call(fdg); // calculate characteristics of variables in data
    dataDrivenLayout.call(fdg); // update the DOM
    dataManipulation.call(fdg); // mutate and structure data
    init.call(fdg); // run the simulation

    return fdg;
}
