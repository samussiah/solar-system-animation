fetch('../../data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const fdg = solarSystemAnimation(
            data,
            '#container',
            {
                colorBy: {
                    type: 'frequency',
                },
                sizeBy: {
                    type: null,
                },
            }
        );
    });
