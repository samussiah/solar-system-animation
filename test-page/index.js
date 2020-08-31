fetch('./data_1000.csv')
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
        });

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                eventChangeCount: ['Hospitalization', 'ICU'],
                eventChangeCountAesthetic: 'both',
                //translate: true,
                //playPause: 'play',
                //speed: 'fast',
                nFoci: 16,
                //duration: 5,
            }
        );
    });
