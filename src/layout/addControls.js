import addSequences from './addControls/sequences';
import addSpeed from './addControls/speed';
import addPlayPause from './addControls/playPause';
import addTimepoint from './addControls/timepoint';
import addReset from './addControls/reset';
import addEventList from './addControls/eventList';

export default function addControls() {
    this.controls = {
        container: this.containers.controls,
    };

    this.controls.sequences = addSequences.call(this);
    this.controls.speed = addSpeed.call(this);
    this.controls.playPause = addPlayPause.call(this);
    this.controls.timepoint = addTimepoint.call(this);
    this.controls.reset = addReset.call(this);
    this.controls.eventList = addEventList.call(this);

    this.controls.container
        .selectAll('.fdg-button')
        .on('mousedown', function () {
            this.classList.toggle('clicked');
        })
        .on('mouseup', function () {
            this.classList.toggle('clicked');
        })
        .on('mouseout', function () {
            if (this.classList.contains('clicked')) this.classList.toggle('clicked');
        });
}
