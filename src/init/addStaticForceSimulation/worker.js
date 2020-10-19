onmessage = function(event) {
  var nodes = event.data.nodes//,
      //links = event.data.links;

  var simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody())
      //.force("link", d3.forceLink(links).distance(20).strength(1))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .stop();
    //const simulation = d3
    //    .forceSimulation()
    //    .nodes(nodes)
    //    .force('center', d3.forceCenter(x, y))
    //    .force('x', d3.forceX(x).strength(0.3))
    //    .force('y', d3.forceY(y).strength(0.3))
    //    .force('charge', forceManyBodyReuse().strength(this.settings.chargeStrength))
    //    .force('collide', d3.forceCollide().radius(this.settings.minRadius + 0.5))
    //    .stop();

  for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    postMessage({type: "tick", progress: i / n});
    simulation.tick();
  }

  postMessage({type: "end", nodes: nodes});//, links: links});
};
