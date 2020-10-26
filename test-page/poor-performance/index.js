fetch('../data/data_10000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                eventChangeCount: ['Hospitalization', 'ICU'],
                eventChangeCountAesthetic: 'both',
            }
        );
    });
