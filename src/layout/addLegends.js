import continuous from './addLegends/makeLegend/continuous';
import categorical from './addLegends/makeLegend/categorical';
import makeLegend from './addLegends/makeLegend';

export default function addLegends() {
    this.legends = {
        container: this.containers.legends,
    };

    if (this.settings.colorBy.type === 'continuous') {
        const container = this.legends.container
            .append('div')
            .classed('fdg-legend fdg-legend--continuous', true);
        container.node().appendChild(
            continuous({
                color: this.colorScale,
                title: this.settings.colorBy.label,
                width: 200,
                height: 50,
                tickValues: [.25, .5, .75].reverse(),
            })
        );
    } else if (this.settings.colorBy.type === 'categorical') {
        const container = this.legends.container
            .append('div')
            .classed('fdg-legend fdg-legend--categorical', true);
        // TODO: implement categorical legend
        //container.node().appendChild(
        //    categorical({
        //        color: this.colorScale,
        //        title: this.settings.colorBy.label,
        //        columns: '200px',
        //        //width: 200,
        //        //height: 50,
        //    })
        //);
    } else if (this.settings.colorBy.type === 'frequency') {
        this.legends.color = makeLegend.call(this, 'color');
        this.legends.size = makeLegend.call(this, 'size');
        this.legends.both = makeLegend.call(this, 'both');
    }
}
