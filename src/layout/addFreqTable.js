export default function addFreqTable() {
    const freqTable = {
        container: this.containers.freqTable,
    };

    freqTable.table = freqTable.container.append('table');
    freqTable.thead = freqTable.table.append('thead');
    freqTable.th = freqTable.thead
        .append('th')
        .attr('colspan', 2)
        .text('Cumulative Number of Events');
    freqTable.tbody = freqTable.table.append('tbody');
    freqTable.tr = freqTable.tbody.selectAll('tr').data(this.metadata.event.slice(1)).join('tr');
    freqTable.td = freqTable.tr
        .selectAll('td')
        .data((event) => [event.value, event.cumulative])
        .join('td')
        .text((d) => d);

    return freqTable;
}
