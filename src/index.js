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

    if (Array.isArray(fdg.settings.notes))
        fdg.settings.notesIndex = settings.notes.some((note) => note.startTimepoint === fdg.settings.timepoint)
            ? fdg.settings.notes.findIndex(
                (note) =>
                    note.startTimepoint <= settings.timepoint &&
                    fdg.settings.timepoint <= note.stopTimepoint
            )
            : 0;

    fdg.containers = layout.call(fdg); // add elements to DOM
    fdg.metadata = defineMetadata.call(fdg); // calculate characteristics of variables in data
    dataDrivenLayout.call(fdg); // update the DOM
    dataManipulation.call(fdg); // mutate and structure data
    init.call(fdg); // run the simulation

    return fdg;
}
