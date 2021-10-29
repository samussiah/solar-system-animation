import dataMapping from './settings/dataMapping';
import aesthetics from './settings/aesthetics';
import freqTable from './settings/freqTable';
import timing from './settings/timing';
import dimensions from './settings/dimensions';
import forceSimulation from './settings/forceSimulation';
import modal from './settings/modal';
import states from './settings/states';
import miscellaneous from './settings/miscellaneous';
import update from './settings/update';

const settings = {
    ...dataMapping(),
    ...aesthetics(),
    ...freqTable(),
    ...timing(),
    ...dimensions(),
    ...forceSimulation(),
    ...modal(),
    ...states(),
    ...miscellaneous(),
    update,
};

export default settings;
