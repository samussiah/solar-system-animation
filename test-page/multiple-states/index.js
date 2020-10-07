fetch('../data/data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        // Define baseline state.
        const baseline = d3.nest()
            .key(d => d.id)
            .rollup(group => d3.sum(group, d => d.duration))
            .entries(data);

        baseline.forEach(d => {
            d.id = d.key + '-baseline';
            d.duration = d.value;
            d.event = 'Baseline';
            d.event_order = 0;
            d.seq = 0;
            d.event_position = 0;
        });
        console.table(baseline.slice(0,10));

        // Define treatment group state.
        const treatmentGroups = d3.nest()
            .key(d => d.id)
            .rollup(group => d3.sum(group, d => d.duration))
            .entries(data);

        treatmentGroups.forEach((d,i) => {
            d.id = d.key + '-treatment-group';
            d.duration = d.value;
            d.event = `Group ${i%2 + 1}`;
            d.event_order = 1;
            d.seq = 0;
            d.event_position = i%2 ? 45 : -45;
        });
        console.table(treatmentGroups.slice(0,10));

        data.forEach((d,i) => {
            d.duration = +d.duration;
            d.seq = +d.seq;
            d.event_order = +d.event_order;
            d.event_position = +d.event_position;
            delete d.outcome;
            delete d.category;
            const treatmentGroup = treatmentGroups.find(di => di.key === d.id);
            if (d.event === 'Home') {
                d.event = treatmentGroup.event;
                d.event_order = treatmentGroup.event_order;
                d.event_position = treatmentGroup.event_position;
            } else {
                d.event_order = d.event_order + 1;
            }
        });
        console.table(data.slice(0,10));

        const stacked = [
            ...baseline,
            ...treatmentGroups,
            ...data
        ];

        const fdg = forceDirectedGraph(
            stacked,
            '#container',
            {
            }
        );
    });
