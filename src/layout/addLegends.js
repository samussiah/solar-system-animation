import makeLegend from './addLegends/makeLegend';
//import color from './addLegends/color';
//import size from './addLegends/size';
//import both from './addLegends/both';

export default function addLegends() {
    this.legends = {
        container: this.container.append('div').classed('fdg-legends', true),
    };

    this.legends.color = makeLegend.call(this, 'color');
    this.legends.size = makeLegend.call(this, 'size');
    this.legends.both = makeLegend.call(this, 'both');
}
