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
    fdg.metadata = defineMetadata.call(fdg); // calculate characteristics of variables in data
    fdg.layout.dataDriven.call(fdg); // update the DOM
    data.call(fdg); // mutate and structure data
    init.call(fdg); // run the simulation

    return fdg;
}
