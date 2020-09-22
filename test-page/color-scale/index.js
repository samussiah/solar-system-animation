fetch('../data_1000.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        // Remove events after first instance of death.
        const nest = d3.nest()
            .key(d => d.id)
            .rollup(nest => {
                for (const d of nest) {
                    if (d.event === 'Death') {
                        nest.filter(di => +di.seq > +d.seq)
                            .forEach(di => {
                                data.splice(data.findIndex(dii => dii === di), 1);
                            });
                        break;
                    }
                }
            })
            .entries(data);

        data.forEach((d,i) => {
            if (d.event === 'Death')
                d.event = Math.random() < .75 ? 'Death (CV-related)' : 'Death (other)';
            d.outcome = Math.random();
            d.category = i%3;
            d.event_position = d.event === 'Home'
                ? 0
                : d.event === 'Hospitalization'
                ? -45
                : d.event === 'ICU'
                ? 30
                : d.event === 'Death (CV-related)'
                ? -10
                : d.event === 'Death (other)'
                ? 10
                : 0;
        });

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                //colorBy: {
                //    type: 'continuous',
                //    variable: 'outcome',
                //    label: 'Random number',
                //},
                colorBy: {
                    type: 'categorical',
                    variable: 'category',
                    label: 'Random category',
                },
            }
        );
    });
