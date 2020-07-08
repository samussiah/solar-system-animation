fetch('./a-day-in-the-life-of-americans.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(d => {
            d[0].act = '0';
        });
        const fdg = forceDirectedGraph(data, '#chart');
    });
