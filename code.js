/* Logic */
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
    const start = keys[0];
    const finish = keys[keys.length-1];
    
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

    //If finish from trackedCosts is Infinity then that route doesn't exists
    const results = {
        distance: (trackedCosts[finish]===Infinity) ? `No such route` : trackedCosts[finish],
        path: optimalPath
    };

    return results.distance;
}


/* UI */
let inputAB = window.document.getElementById('inputAB');
let inputAD = window.document.getElementById('inputAD');
let inputAE = window.document.getElementById('inputAE');
let inputBC = window.document.getElementById('inputBC');
let inputCD = window.document.getElementById('inputCD');
let inputCE = window.document.getElementById('inputCE');
let inputDC = window.document.getElementById('inputDC');
let inputDE = window.document.getElementById('inputDE');
let inputEB = window.document.getElementById('inputEB');
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

    let AB = parseInt(inputAB.value);
    let AD = parseInt(inputAD.value);
    let AE = parseInt(inputAE.value);
    let BC = parseInt(inputBC.value);
    let CD = parseInt(inputCD.value);
    let CE = parseInt(inputCE.value);
    let DC = parseInt(inputDC.value);
    let DE = parseInt(inputDE.value);
    let EB = parseInt(inputEB.value);

    const graph01 = {
        A: {B: AB},
        B: {C: BC},
        C: { }
    };
    output01.value = dijkstra(graph01);

    const graph02 = {
        A: {D: AD},
        D: { }
    };
    output02.value = dijkstra(graph02);

    const graph03 = {
        A: {D: AD},
        D: {C: DC},
        C: { }
    };
    output03.value = dijkstra(graph03);

    const graph04 = {
        A: {E: AE},
        E: {B: EB},
        B: {C: BC},
        C: {D: CD},
        D: { }
    };
    output04.value = dijkstra(graph04);

    const graph05 = {
        A: {E: AE},
        E: { },
        D: { }
    }
    output05.value = dijkstra(graph05);

    output06.value = '';    //Not working
    output07.value = '';    //Not working

    const graph08 = {
        A: {B: AB, D: AD, E: AE},
        B: {C: BC},
        C: { }
    };
    output08.value = dijkstra(graph08);

    const graph09 = {
        B: {C: BC},
        C: {D: CD, E: CE},
        D: {C: DC, E: DE},
        E: {_B: EB},
        _B: { }
    };
    output09.value = dijkstra(graph09);

    output10.value = '';    //Not working
});