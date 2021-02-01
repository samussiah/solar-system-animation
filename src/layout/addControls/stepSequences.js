import getNextSequence from '../../init/startInterval/runNextSequence/getNextSequence';
import runSequence from '../../init/startInterval/runNextSequence/runSequence';
import addForceSimulation from '../../init/addForceSimulation';
import startInterval from '../../init/startInterval';
import resetAnimation from '../../init/startInterval/reset/animation';
import toggle from '../addControls/playPause/toggle';

export default function stepSequences() {
    if (!!this.settings.sequences) {
        const main = this;

        const container = this.util
            .addElement('sequences', this.containers.controls)
            .classed('fdg-control fdg-control--step-sequences', true);

        const inputs = container
            .selectAll('div')
            .data(['<<', '>>'])
            .join('div')
            .classed('fdg-button fdg-button--step-sequence', true)
            .attr('title', (d) => d === '<<' ? 'View previous sequence.' : 'View next sequence.')
            .style('width', '35%')
            .style('float', (d,i) => i === 0 ? 'left' : 'right')
            .text((d, i) => d);

        inputs.on('click', function (d) {
        });

        return {
            container,
            inputs,
        };
    }
}
