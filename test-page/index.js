fetch('./flattened.csv')
    .then(response => response.text())
    .then(text => d3.csv.parse(text))
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
        //const undead = data
        //    .filter(d => data.filter(di => di.event === 'Death').map(di => di.id).includes(d.id))
        //    .map(d => {
        //        const datum = Object.assign({}, d);
        //        datum.id = (datum.id + nest.length).toString();
        //        if (datum.event === 'Death') datum.event = 'unDeath';
        //        return datum;
        //    });

        const fdg = forceDirectedGraph(
            [
                ...data,
                //...undead,
                //...data.map(d => {const di = Object.assign({}, d); di.id = di.id + data.length*1; return di; }),
                //...data.map(d => {const di = Object.assign({}, d); di.id = di.id + data.length*2; return di; }),
            ],
            '#container',
            {
            }
        );
    });
