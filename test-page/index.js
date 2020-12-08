fetch('./data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                colorBy: {
                    type: 'frequency',
                },
                sizeBy: {
                    type: 'frequency',
                },
                shapeBy: {
                    type: 'categorical',
                    variable: 'shape',
                    label: 'Shape',
                },
                collisionPadding: 2,
            }
        );
    });
