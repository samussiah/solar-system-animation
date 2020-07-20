export default function collide(alpha) {
    const fdg = this;

    // Resolve collisions between nodes.
    const quadtree = d3.geom.quadtree(this.data.nested);

    return function (d) {
        // position of current node
        const r =
            fdg.settings.eventChangeCountAesthetic !== 'color'
                ? d.r + fdg.settings.maxRadius + fdg.settings.padding
                : d.r + fdg.settings.minRadius + fdg.settings.padding;

        // dimensions of current node expressed as a square
        const nx1 = d.x - r;
        const nx2 = d.x + r;
        const ny1 = d.y - r;
        const ny2 = d.y + r;

        quadtree.visit(function (quad, x1, y1, x2, y2) {
            // position and dimensions of other nodes in quad tree
            if (quad.point && quad.point !== d) {
                let x = d.x - quad.point.x; // difference in x coordinate between current node and nearby node
                let y = d.y - quad.point.y; // difference in y coordinate between current node and nearby node
                let l = Math.sqrt(x * x + y * y); // Euclidean distance between current node and nearby node
                const r =
                    d.r +
                    quad.point.r +
                    (d.currentEvent.event !== quad.point.currentEvent.event) * fdg.settings.padding; // minimum distance allowed between current node and nearby node in the quadtree

                // If Euclidean distance between current node and nearby node is less than the minimum distance allowed between those two nodes (radius of current node + radius of nearby node + (padding if nodes are at the same focus)
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
