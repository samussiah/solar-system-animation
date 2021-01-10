fetch('./data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        data.forEach(d => {
        });

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                eventLabel: 'HFrEF events',
                timeRelative: 'since baseline',
                colorBy: {
                    type: 'categorical',
                    variable: 'category',
                    label: 'Color Stratum',
                    colorScheme: 'Tableau10',
                    //stratify: false,
                },
                sizeBy: {
                    type: 'frequency',
                },
                //shapeBy: {
                //    type: 'categorical',
                //    variable: 'shape',
                //    label: 'Shape Stratum <small><sup>2</sup></small>',
                //},
                freqTable: {
                    structure: 'horizontal',
                    countType: 'event',
                },
                eventCountType: 'current-id',
                stratificationPositioning: 'orbital',
                modalSpeed: 3000,
            }
        );
    });
