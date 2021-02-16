fetch('./data/data_1000.csv')
    .then(function(response) { console.log(response); return response.text(); })
    .then(function(text) { console.log(text); return d3.csvParse(text); })
    .then(function(data) {
        console.log(data);
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                eventLabel: 'HFrEF events',
                timeRelative: 'since baseline',
                //playPause: 'pause',
                //delay: false,
            }
        );
        console.log(fdg);
    });
