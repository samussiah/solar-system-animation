export default function shape(metadata) {
    let nest;

    if (this.settings.shapify) {
        nest = d3
            .nest()
            .key((d) => d[this.settings.shapeBy.variable])
            .entries(this.data)
            .sort((a, b) => {
                const aOrder = Array.isArray(this.settings.shapeBy.order)
                    ? this.settings.shapeBy.order.indexOf(a.key)
                    : null;
                const bOrder = Array.isArray(this.settings.shapeBy.order)
                    ? this.settings.shapeBy.order.indexOf(b.key)
                    : null;
                const orderSort = aOrder - bOrder;
                const alphaSort = a.key < b.key ? -1 : 1;

                return orderSort ? orderSort : alphaSort;
            });
    }

    return nest;
}
