fetch('./a-day-in-the-life-of-americans.tsv')
    .then(response => response.text())
    .then(text => d3.csv.parse(text))
    .then(data => {
        console.log(data);
        const fdg = forceDirectedGraph(data, '#chart');
    });
//fetch('./a-day-in-the-life-of-americans.json')
//    .then(response => response.json())
//    .then(data => {
//        const fdg = forceDirectedGraph(data, '#chart');
//    });
