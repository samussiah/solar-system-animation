import addColorLegend from './addLegends/color';
import addSizeLegend from './addLegends/size';
import addShapeLegend from './addLegends/shape';

export default function addLegends() {
    this.legends = {
        container: this.layout.legends,
        svgWidth: 64,
    };
    this.legends.svgHeight = this.legends.svgWidth / 3;
    this.legends.radius = this.legends.svgHeight / 2 - 3;

    this.legends.color = addColorLegend.call(this);
    this.legends.size = addSizeLegend.call(this);
    this.legends.shape = addShapeLegend.call(this);

    //this.legends.container.selectAll('.fdg-legend__label')
    //    .style('padding-left', `${this.legends.svgWidth/2 - this.legends.radius}px`);
}
