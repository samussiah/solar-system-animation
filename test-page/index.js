fetch('./data/data_2000_fixed.csv')
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
                //playPause: 'pause',
                //delay: false,
            }
        );
    });
