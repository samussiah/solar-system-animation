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
                eventLabel: 'HFrEF events <small><sup>1</sup></small>',
                timeRelative: 'since baseline',
                colorBy: {
                    type: 'categorical',
                    variable: 'category',
                    label: 'Color Stratum',
                    colorScheme: 'Tableau10',
                    //stratify: false,
                },
                shapeBy: {
                    type: 'categorical',
                    variable: 'shape',
                    label: 'Shape Stratum <small><sup>2</sup></small>',
                },
                freqTable: {
                    //display: false,
                    //bars: false,
                    //structure: 'horizontal',
                    //includeEventCentral: true,
                    //countType: 'event',
                },
                delay: false,
                //eventCountType: 'cumulative-event',
                //displayProgressBar: false,
                //stratificationPositioning: 'orbital',
            }
        );
    });
