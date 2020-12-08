fetch('../../data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                shapeBy: {
                    type: 'categorical',
                    variable: 'category',
                    label: 'Shape Stratum',
                },
            }
        );
    });
