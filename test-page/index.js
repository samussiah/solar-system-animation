fetch('./flattened.csv')
    .then(response => response.text())
    .then(text => d3.csv.parse(text))
    .then(data => {
        const fdg = forceDirectedGraph(data, '#container', {reset: 100, playPause: 'play'});
    });
