import addColorLegend from './addLegends/color';
import addSizeLegend from './addLegends/size';
import addShapeLegend from './addLegends/shape';

export default function addLegends() {
    this.legends = {
        container: this.containers.legends,
    };

    this.legends.color = addColorLegend.call(this);
    this.legends.size = addSizeLegend.call(this);
    this.legends.shape = addShapeLegend.call(this);
}
