fetch('../../data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const fdg = solarSystemAnimation(
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
                freqTable: {
                    structure: 'horizontal',
                },
                individualUnit: 'participant',
                individualLabel: 'Participants',
            }
        );
    });
