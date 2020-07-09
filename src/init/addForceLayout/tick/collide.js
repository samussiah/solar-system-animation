export default function collide(alpha) {
    const fdg = this;

    // Resolve collisions between nodes.
    const quadtree = d3.geom.quadtree(this.data.nested);

    return function(d) {
        const r = d.r + fdg.settings.maxRadius + fdg.settings.padding;
        const nx1 = d.x - r;
        const nx2 = d.x + r;
        const ny1 = d.y - r;
        const ny2 = d.y + r;

        quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && quad.point !== d) {
                let x = d.x - quad.point.x;
                let y = d.y - quad.point.y;
                let l = Math.sqrt(x * x + y * y);
                const r = d.r + quad.point.r + (d.currentEvent.event !== quad.point.currentEvent.event) * fdg.settings.padding;

                if (l < r) {
                    l = ((l - r) / l) * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }

            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}
