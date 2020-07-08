import defaults from './settings';
import layout from './layout';
import init from './init';

export default function forceDirectedGraph(data, element = 'body', settings = {}) {
    const fdg = {
        data,
        element,
        settings: Object.assign(defaults, settings),
    };

    layout.call(fdg);
    init.call(fdg);

    return fdg;
}
