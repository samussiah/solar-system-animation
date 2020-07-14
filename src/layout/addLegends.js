import color from './addLegends/color';
import size from './addLegends/size';

export default function addLegends() {
    this.legends = this.canvas.append('div').classed('fdg-legends', true);
    color.call(this);
    size.call(this);
}
