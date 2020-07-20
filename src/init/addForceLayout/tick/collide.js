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

        // dimensions of current node expressed as the coordinates of the corners of a square
        const nx1 = d.x - r;
        const nx2 = d.x + r;
        const ny1 = d.y - r;
        const ny2 = d.y + r;

        quadtree.visit(function (quad, x1, y1, x2, y2) {
            // position and dimensions of other nodes in quad tree
            if (quad.point && quad.point !== d) {
                let xDiff = d.x - quad.point.x; // difference in x coordinate between current node and nearby node (horizontal difference)
                let yDiff = d.y - quad.point.y; // difference in y coordinate between current node and nearby node (vertical difference)
                let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff); // Euclidean distance between current node and nearby node (absolute difference)

                // minimum distance allowed between current node and nearby node in the quadtree:
                // radius of current node + radius of nearby node + (padding if nodes are at the same focus)
                const minDistance =
                    d.r +
                    quad.point.r +
                    (d.currentEvent.event !== quad.point.currentEvent.event) * fdg.settings.padding;

                // If the Euclidean distance is less than the minimum distance allowed:
                if (distance < minDistance) {
                    // update Euclidean distance
                    distance = ((distance - minDistance) / distance) * alpha;

                    // update horizontal difference (xDiff *= distance)
                    // subtract updated horizontal difference from current node
                    d.x -= xDiff *= distance;

                    // update vertical difference (yDiff *= distance)
                    // subtract updated vertical difference from current node
                    d.y -= yDiff *= distance;

                    // add updated horizontal and vertical difference to nearby node
                    quad.point.x += xDiff;
                    quad.point.y += yDiff;
                }
            }

            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}
