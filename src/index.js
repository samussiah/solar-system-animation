import './util/polyfills';
import util from './util/index';
import defaults from './settings';
import layout from './layout';
import defineMetadata from './defineMetadata';
import data from './data';
import init from './init';

export default function forceDirectedGraph(_data_, _element_ = 'body', _settings_ = {}) {
    const fdg = {
        data: _data_,
        element: _element_,
        settings: util.mergeDeep(defaults, _settings_),
        util,
    };

    defaults.update.call(fdg); // Update settings object.
    fdg.layout = layout.call(fdg); // add elements to DOM
    data.mutate.call(fdg); // mutate data
    fdg.metadata = defineMetadata.call(fdg); // calculate characteristics of variables in data
    fdg.data.nested = data.structure.call(fdg, fdg.data); // structure data
    fdg.layout.dataDriven.call(fdg); // update the DOM
    init.call(fdg); // run the simulation

    return fdg;
}
