fetch('./data_4000.csv')
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

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                //playPause: 'play',
                //speed: 'fast',
                nFoci: 8,
            }
        );
    });
