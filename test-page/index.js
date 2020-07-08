fetch('./a-day-in-the-life-of-americans.json')
    .then(response => response.json())
    .then(data => {
        const fdg = forceDirectedGraph(data, '#chart');
    });
