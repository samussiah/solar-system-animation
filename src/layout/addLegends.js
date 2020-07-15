import color from './addLegends/color';
import size from './addLegends/size';
import both from './addLegends/both';

export default function addLegends() {
    this.legends = this.canvas.append('div').classed('fdg-legends', true);
    color.call(this);
    size.call(this);
    both.call(this);
}
