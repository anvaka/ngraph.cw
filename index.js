var createRandomIterator = require('ngraph.random').randomIterator;
var createRandom = require('ngraph.random').random;

module.exports = createChineseWhisper;

function createChineseWhisper(graph, kind) {
  var api = {
    step: step,
    getClass: getClass,
    getChangeRate: getChangeRate
  };

  var changeRate = 1;
  var classChangesCount = 0;
  var random = createRandom(42);
  var iterator;
  var classMap = new Map();
  var nodeIds = [];

  initInternalStructures();

  return api;

  function step() {
    classChangesCount = 0;
    iterator.forEach(assignHighestClass);
    changeRate = classChangesCount/nodeIds.length;
  }

  function getChangeRate() {
    return changeRate;
  }

  function getClass(nodeId) {
    return classMap.get(nodeId);
  }

  function initInternalStructures() {
    graph.forEachNode(initNodeClass);
    iterator = createRandomIterator(nodeIds, random);

    function initNodeClass(node) {
      classMap.set(node.id, nodeIds.length);
      nodeIds.push(node.id);
    }
  }

  function assignHighestClass(nodeId) {
    var newLevel = getHighestClassInTheNeighborhoodOf(nodeId);
    var currentLevel = classMap.get(nodeId);
    if (newLevel !== currentLevel) {
      classMap.set(nodeId, newLevel);
      classChangesCount += 1;
    }
  }

  function getHighestClassInTheNeighborhoodOf(nodeId) {
    var seenClasses = new Map();
    var maxClassValue = 0;
    var maxClassName = -1;

    graph.forEachLinkedNode(nodeId, visitNeighbour);

    if (maxClassName === -1) {
      // the node didn't have any neighbours
      return classMap.get(nodeId);
    }

    return maxClassName;

    function visitNeighbour(otherNode, link) {
      if (shouldUpdate(link.toId === nodeId)) {
        var otherNodeClass = classMap.get(otherNode.id);
        var counter = seenClasses.get(otherNodeClass) || 0;
        counter += 1;
        if (counter > maxClassValue) {
          maxClassValue = counter;
          maxClassName = otherNodeClass;
        }

        seenClasses.set(otherNodeClass, counter);
      }
    }
  }

  function shouldUpdate(isInLink) {
    if (kind === 'in') return isInLink;
    if (kind === 'out') return !isInLink;
    return true;
  }
}
