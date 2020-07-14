import speed from './addControls/speed';
import playPause from './addControls/playPause';
import colorSizeToggle from './addControls/colorSizeToggle';

export default function addControls() {
    this.controls = this.container.append('div').classed('fdg-controls', true);
    speed.call(this);
    playPause.call(this);
    colorSizeToggle.call(this);
}
