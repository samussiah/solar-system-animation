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
                //colorBy: {
                //    type: 'categorical',
                //    variable: 'category',
                //    label: 'Color Stratum',
                //    colorScheme: 'Tableau10',
                //    stratify: false,
                //},
                //sizeBy: {
                //    type: null,
                //},
                //shapeBy: {
                //    type: 'categorical',
                //    variable: 'shape',
                //    label: 'Shape Stratum',
                //},
                //freqTable: {
                //},
                //delay: false,
                //modalSpeed: 5000,
                //playPause: 'pause',
            }
        );
    });
