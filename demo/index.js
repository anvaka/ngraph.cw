var render = require('ngraph.svg');
var getColor = require('./getColor.js');
var createWhisper = require('../');
var fromdot = require('ngraph.fromdot');

var defaultGraph = require('miserables');
var currentApp = app(defaultGraph);

function app(graph) {
  var whisper = createWhisper(graph);
  var renderer = render(graph, {
    physics: {
      springLength : 35,
      springCoeff : 0.00055,
      dragCoeff : 0.09,
      gravity : -1
    }
  });

  var api = {
    step: step,
    dispose: dispose
  };

  renderGraph();

  return api;

  function dispose() {
    renderer.dispose();
    renderer.svgRoot.parentNode.removeChild(renderer.svgRoot);
  }

  function step() {
    whisper.step();
    // Once change rate is close to 0, the algorithm has converged.
    console.log(whisper.getChangeRate() + '% nodes received a new class');
    // Next iteration of renderNode() will use whisper.getClass(node.id) and
    // will render it on the screen.
  }

  function renderGraph() {
    var svg = render.svg;

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
}



document.getElementById('step').addEventListener('click', function(e) {
  e.preventDefault();
  currentApp.step();
});

document.getElementById('loaddot').addEventListener('click', function(e) {
  e.preventDefault();
  currentApp.dispose();

  var dot = document.getElementById('custom-dot').value;
  var graph = fromdot(dot)
  currentApp = app(graph);
});

