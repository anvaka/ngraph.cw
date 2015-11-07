var getColor = require('./getColor.js');

var graph = require('miserables');
var whisper = require('../')(graph);

function onStep(stepsCount) {
  for (var i = 0; i < stepsCount; ++i) {
    whisper.step();
  }
  // Once change rate is close to 0, the algorithm has converged.
  console.log(whisper.getChangeRate() + '% nodes received a new class');
  // Next iteration of renderNode() will use whisper.getClass(node.id) and
  // will render it on the screen.
}

// We use svg renderer, but this could be any renderer
renderGraph(graph);

function renderGraph(graph) {
  var render = require('ngraph.svg');
  var svg = render.svg;

  var renderer = render(graph, {
    physics: {
      springLength : 35,
      springCoeff : 0.00055,
      dragCoeff : 0.09,
      gravity : -1
    }
  });

  renderer.node(createNode).placeNode(renderNode);

  renderer.run();

  function renderNode(ui, pos, node) {
    var currentClass = whisper.getClass(node.id);
    if (ui.label !== currentClass) {
      ui.label = currentClass;
      ui.labelEl.text(currentClass);
      ui.circleEl.attr('fill', getColor(currentClass));
    }
    ui.attr('transform', 'translate(' + (pos.x ) + ',' + (pos.y) + ')');
  }

  function createNode(node) {
    var ui = svg('g');
        // Create SVG text element with user id as content
    var label = svg('text').attr('y', '-8px');
    var circle = svg('circle', {
      r: 7,
      stroke: '#fff',
      fill: '#ff00ef',
      'stroke-width': '1.5px'
    });
    ui.append(label);
    ui.append(circle);

    // yeah, ugly. Storing label dom element, so that we can update labels later
    ui.labelEl = label;
    ui.circleEl = circle;
    return ui;
  }
}

document.getElementById('step').addEventListener('click', function(e) {
  e.preventDefault();
  onStep(1);
});

