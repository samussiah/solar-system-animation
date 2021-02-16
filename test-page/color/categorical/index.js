fetch('../../data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                colorBy: {
                    type: 'categorical',
                    variable: 'category',
                    label: 'Color Stratum',
                    colorScheme: 'Tableau10',
                    //stratify: false,
                },
                sizeBy: {
                    type: null,
                },
            }
        );
    });
