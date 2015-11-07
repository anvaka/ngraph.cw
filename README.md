# ngraph.cw [![Build Status](https://travis-ci.org/anvaka/ngraph.cw.svg)](https://travis-ci.org/anvaka/ngraph.cw)

[Chinese Whispers](http://wortschatz.uni-leipzig.de/~cbiemann/pub/2006/BiemannTextGraph06.pdf)
graph clustering for [`ngraph`](https://github.com/anvaka/ngraph.graph). The algorithm
is known for its speed (time-linear in the number of edges) and works best for
large graphs.

I got algorithm converged for a graph with `200,000` nodes `500,000` edges after
`8` iterations. Undirected graph with `2.2` million nodes, `4.5` million edges
converged after `47` iterations.

# usage

``` js
var createWhisper = require('ngraph.cw');

// Graph is intance of ngraph.graph
var whisper = createWhisper(graph);

// The algorithm is iterative. We should continue running it until change
// rate within clusters is large:

var requiredChangeRate = 0; // 0 is complete convergence
while (whisper.getChangeRate() > requiredChangeRate) {
  whisper.step();
}
// When change rate is 0 (or very close to 0) we are done.
// Now we can query "class" of each node:
graph.forEachNode(printClass);

function printClass(node) {
  console.log(nodeId + ' belongs to ' + whisper.getClass(node.id));
}
```

By default `ngraph.cw` treats graph as undirected. You can change this via
optional `kind` argument:

``` js
var createWhisper = require('ngraph.cw');

// Consider only neighbours with incoming edges:
var inDegreeWhisper = createWhisper(graph, 'in');

// Or outgoing edges:
var outDegreeWhisper = createWhisper(graph, 'out');
```

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.cw
```

# license

MIT
