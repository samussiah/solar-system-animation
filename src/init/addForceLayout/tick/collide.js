export default function collide(alpha) {
    const fdg = this;
    // Resolve collisions between nodes.
    var quadtree = d3.geom.quadtree(fdg.nodes);
    return function (d) {
        var r = d.radius + fdg.settings.maxRadius + fdg.settings.padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && quad.point !== d) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r =
                        d.radius +
                        quad.point.radius +
                        (d.act !== quad.point.act) * fdg.settings.padding;
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
