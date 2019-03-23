/* Logic */
const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

const generateEdges = (input, ...args) => {
    //Sort edges, routes goes from left to right as alphabetical order
    let edges = input.toUpperCase().replace(/\s/g,'').split(',').sort();
    let currentEdges = [];
    let finalEdges = [];

    //If ...args are not passed, return sorted edges
    if (args.length===0) {
      return edges;
    }

    //Get edges that include the given route, not sorted by given route
    for (let edge of edges) {
      args.reduce((prior, current) => {
        if(prior!==null) {
          if ( edge.includes(prior.concat(current)) ) {
            currentEdges.push(edge);
          }
        }
        return current;
      }, null);
    }

    //Sort edges by given route not alphabetical order, the previous one will be linked to the next one
    for (let arg of args) {
      for (let currentEdge of currentEdges) {
        if (currentEdge.charAt(0)===arg) {
            finalEdges.push(currentEdge);
        }
      }
    }

    //If finalEdges don't include any of the args that route doesn't exist
    for (let arg of args) {
      if (! finalEdges.join().includes(arg) ) {
        finalEdges = [];
      }
    }

    return finalEdges;
}

const generateGraph = (sortedEdges, actionType, ...args) => {
  let edges = [...sortedEdges];
  let type = actionType;
  let start = args[0];
  let finish = args[1];
  let routes = [];  //2D array

  edges.map(element => {
    let children = element.split("");
    routes.push(children);
  });

  //If sortedEdges is empty then that route doesn't exist
  if (edges.length===0) {
    return {};
  }

  let graph = {};
  routes.reduce((prior, current, index) => {
    //Build first node
    if (prior===null) {
        graph[ current[0] ] = { [ current[1] ]: Number(current[2]) };
    }

    //Build the other nodes
    if (prior!==null) {
      //If first node has more routes
      if (prior[0]==current[0]) {
        graph[ current[0] ] = { ...graph[ current[0] ], [ prior[1] ]: Number(prior[2]), [ current[1] ]: Number(current[2]) };
      } 

      //If the other nodes have more routes
      if (prior[0]!=current[0]) {
        graph[ current[0] ] = { ...graph[ current[0] ], [ current[1] ]: Number(current[2]) };
      }

      //Build the previous node before the last one
      if (type==='SHORT_ROUTE' && routes[routes.length-1]===current ) {
        if ( graph[ current[1] ] ) {
          graph[ current[0] ] = { ...graph[ current[0] ], [ `_${current[1]}` ]: Number(current[2]) };
          delete graph[ current[0] ][ current[1] ];
        }
      }
      
    }

    return current;
  }, null);

  //Build last node
  if (! graph[ routes[routes.length-1][1] ] ) {
    graph[ routes[routes.length-1][1] ] = { };
  } else {
    graph[ `_${routes[routes.length-1][1]}` ] = { };  
  }

  //Build last node for SHORT_ROUTE
  if (type==='SHORT_ROUTE') {
    if (start===finish) {
      finish = `_${finish}`;
    }

    //When tap true means still in the given route
    let tap = false;
    let keys = Object.keys(graph);
    for (let key of keys) {
      if (key===start) {
        tap = true;
      }
      if (tap===false) {
        delete graph[ key ];
      }
      if (key===finish) {
        tap = false;
      }
    }

    let currentKeys = Object.keys(graph);
    graph[ currentKeys[ currentKeys.length-1 ] ] = {}
  }

  return graph;
}

const findLowestCostNode = (costs, processed) => {
    const knownNodes = Object.keys(costs)

    //If lowest node is greater than current node, then it's not the lowest
    const lowestCostNode = knownNodes.reduce((lowest, node) => {
        if (lowest === null || costs[node] < costs[lowest]) {
            if (!processed.includes(node)) {
              lowest = node;
            }
        }

        return lowest;
    }, null);

    return lowestCostNode;
}

const dijkstra = (graph) => {
    //Where to start and finish
    const keys = Object.keys(graph);
    const values = Object.values(graph);
    const start = keys[0];
    let finish;
    for (let value of values) {
        if (Object.keys(value).length === 0 && value.constructor === Object) {
            finish = getKeyByValue(graph, value);
        }
    }
    
    //Initial trackedCosts
    const trackedCosts = Object.assign({ [finish]: Infinity }, graph[start]);

    //Initial trackedParents
    const trackedParents = { [finish]: null };
    for (let child in graph[start]) {
        trackedParents[child] = start;
    }

    //If it's processed will be in this array
    const processedNodes = [];
    let node = findLowestCostNode(trackedCosts, processedNodes);

    //Start the search
    while (node) {
        let costToReachNode = trackedCosts[node];
        let childrenOfNode = graph[node];

        for (let child in childrenOfNode) {
            //Cost from lowest node to his child
            let costFromNodetoChild = childrenOfNode[child]
            //Cost from start node to end node
            let costToChild = costToReachNode + costFromNodetoChild;

            if (!trackedCosts[child] || trackedCosts[child] > costToChild) {
                trackedCosts[child] = costToChild;
                trackedParents[child] = node;
            }
        }

        processedNodes.push(node);
        node = findLowestCostNode(trackedCosts, processedNodes);
    }

    let optimalPath = [ finish ];
    let parent = trackedParents[finish];
    while (parent) {
        optimalPath.push(parent);
        parent = trackedParents[parent];
    }
    optimalPath.reverse();

    //If finish from trackedCosts is Infinity then that route doesn't exist
    const results = {
        distance: (trackedCosts[finish]===Infinity) ? `No such route` : trackedCosts[finish],
        path: optimalPath
    };

    return results.distance;
}


/* UI */
let input = window.document.getElementById('input');
let output01 = window.document.getElementById('output01');
let output02 = window.document.getElementById('output02');
let output03 = window.document.getElementById('output03');
let output04 = window.document.getElementById('output04');
let output05 = window.document.getElementById('output05');
let output06 = window.document.getElementById('output06');
let output07 = window.document.getElementById('output07');
let output08 = window.document.getElementById('output08');
let output09 = window.document.getElementById('output09');
let output10 = window.document.getElementById('output10');
let btnCalculate = window.document.getElementById('btnCalculate');

window.addEventListener('keyup', (event) => {
    event.preventDefault();

    if (event.keyCode===13) {
        btnCalculate.click();
    }
});

btnCalculate.addEventListener('click', (event) => {
    event.preventDefault();

    //Test input AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
    let mainEdges = generateEdges(input.value);
    let mainGraph = generateGraph(mainEdges);
    console.log('mnfc mainGraph ', mainGraph);

    //Output #01 - Distance of route A-B-C
    let edges01 = generateEdges(input.value, 'A', 'B', 'C');
    let graph01 = generateGraph(edges01, 'SINGLE_ROUTE');
    console.log('mnfc graph01 ', graph01);
    output01.value = dijkstra(graph01);
    output01.style.color = '#336df4';
    output01.style.fontWeight = 'bold';

    //Output #02 - Distance of route A-D
    let edges02 = generateEdges(input.value, 'A', 'D');
    let graph02 = generateGraph(edges02, 'SINGLE_ROUTE');
    console.log('mnfc graph02 ', graph02);
    output02.value = dijkstra(graph02);
    output02.style.color = '#336df4';
    output02.style.fontWeight = 'bold';

    //Output #03 - Distance of route A-D-C
    let edges03 = generateEdges(input.value, 'A', 'D', 'C');
    let graph03 = generateGraph(edges03, 'SINGLE_ROUTE');
    console.log('mnfc graph03 ', graph03);
    output03.value = dijkstra(graph03);
    output03.style.color = '#336df4';
    output03.style.fontWeight = 'bold';

    //Output #04 - Distance of route A-E-B-C-D
    let edges04 = generateEdges(input.value, 'A', 'E', 'B', 'C', 'D');
    let graph04 = generateGraph(edges04, 'SINGLE_ROUTE');
    console.log('mnfc graph04 ', graph04);
    output04.value = dijkstra(graph04);
    output04.style.color = '#336df4';
    output04.style.fontWeight = 'bold';

    //Output #05 - Distance of route A-E-D
    let edges05 = generateEdges(input.value, 'A', 'E', 'D');
    let graph05 = generateGraph(edges05, 'SINGLE_ROUTE');
    console.log('mnfc graph05 ', graph05);
    output05.value = dijkstra(graph05);
    output05.style.color = '#336df4';
    output05.style.fontWeight = 'bold';

    //Output #06 - Trips from C to C with 3 stops
    output06.value = '';    //Not working

    //Output #07 - Trips from A to C with 4 stops
    output07.value = '';    //Not working

    //Output #08 - Shortest route from A to C
    let edges08 = generateEdges(input.value);
    let graph08 = generateGraph(edges08, 'SHORT_ROUTE', 'A', 'C');
    console.log('mnfc graph08 ', graph08);
    output08.value = dijkstra(graph08);
    output08.style.color = '#336df4';
    output08.style.fontWeight = 'bold';

    //Output #09 - Shortest route from B to B
    let edges09 = generateEdges(input.value);
    let graph09 = generateGraph(edges09, 'SHORT_ROUTE', 'B', 'B');
    console.log('mnfc graph09 ', graph09);
    output09.value = dijkstra(graph09);
    output09.style.color = '#336df4';
    output09.style.fontWeight = 'bold';

    //Output #10 - Routes C to C distance<30
    output10.value = '';    //Not working
});