fetch('./data_1e3.csv')
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

        //const data_5000 = d3.merge([
        //    data.map(d => { const datum = Object.assign({}, d); datum.id = datum.id + data.length * 1; return datum; }),
        //    data.map(d => { const datum = Object.assign({}, d); datum.id = datum.id + data.length * 2; return datum; }),
        //    data.map(d => { const datum = Object.assign({}, d); datum.id = datum.id + data.length * 3; return datum; }),
        //    data.map(d => { const datum = Object.assign({}, d); datum.id = datum.id + data.length * 4; return datum; }),
        //    data.map(d => { const datum = Object.assign({}, d); datum.id = datum.id + data.length * 5; return datum; }),
        //]);

        //const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        //const header = Object.keys(data_5000[0])
        //let csv = data_5000.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        //csv.unshift(header.join(','))
        //csv = csv.join('\r\n')

        //console.log(csv)

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                //speed: 'fast',
            }
        );
    });
