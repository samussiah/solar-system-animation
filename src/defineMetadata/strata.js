export default function strata(metadata) {
    let nest;

    if (this.settings.stratify) {
        nest = d3
            .nest()
            .key((d) => d[this.settings.colorBy.variable])
            .entries(this.data)
            .sort((a, b) => {
                const aOrder = Array.isArray(this.settings.colorBy.order)
                    ? this.settings.colorBy.order.indexOf(a.key)
                    : null;
                const bOrder = Array.isArray(this.settings.colorBy.order)
                    ? this.settings.colorBy.order.indexOf(b.key)
                    : null;
                const orderSort = aOrder - bOrder;
                const alphaSort = a.key < b.key ? -1 : 1;

                return orderSort ? orderSort : alphaSort;
            });

        this.settings.colorBy.nStrata = nest.length;
        this.settings.colorBy.theta = (2 * Math.PI) / this.settings.colorBy.nStrata;

        nest.forEach((stratum, i) => {
            //ids: new Set(), // individuals in the state currently
            //nIds: 0, // number of individuals in the state currently
            //idsCumulative: new Set(), // individuals that have ever been in the state
            //nIdsCumulative: 0, // number of individuals that have ever been in the state
            //nEvents: 0, // number of times any individual has been in the state up to the current timepoint, i.e. the total number of events that have occurred so far
            //nEventsTotal: group.length, // total number of events

            const colorScheme = this.settings.colorBy.colorSchemes[i];
            stratum.colorScheme =
                d3[
                    `scheme${colorScheme.substring(0, 1).toUpperCase()}${colorScheme.substring(1)}s`
                ];

            // domain: number of recurrent events
            //  range: sequential, single-hue color scheme of the same length
            stratum.colorScale = d3
                .scaleLinear()
                .domain(d3.range(this.settings.nColors))
                .range(stratum.colorScheme[9].reverse().slice(0, this.settings.nColors).reverse())
                .clamp(true);
            stratum.individuals = metadata.id.filter((d) => d.colorStratum === stratum.key);
            stratum.duration = d3.max(stratum.individuals, (d) => d.duration);
            stratum.nIndividuals = stratum.individuals.length;
            stratum.nEvents = stratum.values.length;

            // TODO: figure out how to shift the foci to match the order in the legend
            stratum.angle =
                this.settings.colorBy.nStrata % 2
                    ? (this.settings.colorBy.nStrata - i - 1) * this.settings.colorBy.theta
                    : (this.settings.colorBy.nStrata - i - 1) * this.settings.colorBy.theta +
                      Math.PI / this.settings.colorBy.nStrata;
        });
    }

    return nest;
}
