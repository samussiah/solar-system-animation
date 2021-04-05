// TODO: add focus vicinity back in
// TODO: revisit performance
fetch('./data/1e5.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                eventLabel: 'HFrEF events',
                timeRelative: 'since baseline',
                drawStaticSeparately: true,
                shapeBy: {
                    type: 'categorical',
                    label: 'Arm',
                    variable: 'arm'
                },
                minRadius: 2,
                fill: true,
                //playPause: 'pause',
                //delay: false,
            }
        );
    });
