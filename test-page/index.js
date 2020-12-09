fetch('./data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                //colorBy: null,
                //colorBy: {
                //    type: 'frequency',
                //},
                colorBy: {
                    type: 'categorical',
                    variable: 'category',
                    label: 'Color Stratum',
                    colorScheme: 'Tableau10',
                    stratify: false,
                },
                //colorBy: {
                //    type: 'continuous',
                //    variable: 'outcome',
                //    label: 'Outcome',
                //    //mirror: false,
                //},
                //sizeBy: null,
                //sizeBy: {
                //    type: 'frequency',
                //},
                //sizeBy: {
                //    type: 'continuous',
                //    variable: 'outcome',
                //    label: 'Outcome',
                //},
                //shapeBy: null,
                shapeBy: {
                    type: 'categorical',
                    variable: 'shape',
                    label: 'Shape Stratum',
                },
                collisionPadding: 2,
                //hideFreqTable: true,
                //eventCentralInFreqTable: true,
            }
        );
    });
