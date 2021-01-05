fetch('./data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        data.forEach(d => {
            //if (d.category === 'Group 3')
            //    d.category = `Group ${Math.round(Math.random()) + 1}`;
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
                shapeBy: {
                    type: 'categorical',
                    variable: 'shape',
                    label: 'Shape Stratum',
                },
                freqTable: {
                    //display: false,
                    //bars: false,
                    //structure: 'horizontal',
                    //includeEventCentral: true,
                },
                delay: false,
                collisionPadding: 2,
                displayProgressBar: false,
            }
        );
    });
