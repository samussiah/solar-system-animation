fetch('./data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        console.table(d3.nest().key(d => d.shape).rollup(group => group.length).entries(data));
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                eventChangeCount: ['Hospitalization', 'ICU'],
                eventChangeCountAesthetic: 'both',
            }
        );
    });
