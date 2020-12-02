export default function addFreqTable() {
    const freqTable = {
        container: this.containers.freqTable,
    };

    freqTable.table = freqTable.container.append('table');
    freqTable.thead = freqTable.table.append('thead');
    freqTable.th = freqTable.thead
        .selectAll('th')
        .data(['Participants', 'Events'])
        .join('th')
        .attr('colspan', d => d === 'Participants' ? 2 : null)
        .style('text-align', 'right')
        //.style('font-weight', 'normal')
        .style('border-bottom', 'none')
        .text(d => d);
    freqTable.tbody = freqTable.table
        .append('tbody');
    this.data.freqTable = d3.merge(
        this.metadata.event.map(event => {
            const group = [event, ...event.foci];
            group.forEach(d => {
                d.group = event.value;
            });
            return group;
        })
    ).filter(d => d.group !== this.settings.eventCentral);
    freqTable.tr = freqTable.tbody
        .selectAll('tr')
        .data(this.data.freqTable)
        .join('tr')
        .style('font-size', d => d.group !== d.value ? '1rem' : '1.25rem');
    freqTable.tr.each(function(d,i) {
        console.log(d);
        const tr = d3.select(this);
        const td = tr
            .selectAll('td')
            .data((di) => [di.value, di.count, di.cumulative])
            .join('td')
            .style('white-space', 'nowrap')
            .style('overflow', 'hidden')
            .style('text-overflow', 'ellipsis')
            .style('border-top', d.group === d.value ? '1px solid #aaa' : null)
            .style('text-align', di => typeof di === 'number' ? 'right' : 'left')
            .style('padding-left', d.group !== d.value ? '2rem' : null)
            .text((di) => (typeof di === 'number' ? d3.format(',d')(di) : di));
    });

    return freqTable;
}
