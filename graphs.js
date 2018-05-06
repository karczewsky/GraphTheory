function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

function renderGraph (nodesNew, edgesNew) {
    var container = document.getElementById("mynetwork");
    var data = {
      nodes: nodesNew,
      edges: edgesNew
    };
    var options = {
      nodes: {
        shape: "dot",
        borderWidth: 2
      }
    };
    var network = new vis.Network(container, data, options);
  }
  

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}



var incidenceMatrix = [
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]
];

// var incidenceMatrix = [
//     [1, 0, 0, 0, 0, 0, 0, 0],
//     [1, 1, 0, 0, 0, 0, 0, 0],
//     [0, 1, 1, 0, 0, 0, 0, 0],
//     [0, 0, 1, 1, 0, 0, 0, 0],
//     [0, 0, 0, 1, 1, 0, 0, 0],
//     [0, 0, 0, 0, 1, 1, 0, 0],
//     [0, 0, 0, 0, 0, 1, 1, 0],
//     [0, 0, 0, 0, 0, 0, 1, 1],
//     [0, 0, 0, 0, 0, 0, 0, 1],
// ]

var neighborsMatrix = new Array(incidenceMatrix.length)
var nodesNew = new vis.DataSet()
var edgesNew = new vis.DataSet()
var chromatic = new Array(incidenceMatrix.length)
var chromaticMap = new Array(incidenceMatrix.length)

for(var i = 0; i < incidenceMatrix.length; i++) {
    nodesNew.update({id: i+1, label: String(i+1)});
    chromatic[i] = 0;
    neighborsMatrix[i] = Array(0)
}


for(var i = 0; i < incidenceMatrix[0].length; i++) {
    var from = 0, to = 0;
    for(var j = 0; j < incidenceMatrix.length; j++) {
        
        if(incidenceMatrix[j][i] == 1) {
            if(from == 0){
                from = j+1;
                chromatic[j]++;
            } else {
                to = j+1;
                chromatic[j]++;
            }   
        }
    }

    
    to = (to == 0) ? from : to    
    edgesNew.update({from: from, to: to})
    
    neighborsMatrix[from-1].push(to)
    neighborsMatrix[to-1].push(from)
}
console.log(neighborsMatrix)
for(var i = 0; i < incidenceMatrix.length; i++) {
    chromaticMap.push({id: i+1, val: chromatic[i]})
}

//Sort descending
chromaticMap.sort(function(a, b) {
    return b.val - a.val;
});

console.log(chromaticMap)
//coloring LF
var colors = new Array(0) //index: color_id, nodes:
for(var i = 0; i < (chromaticMap.length/2); i++) {
    var curentNode = chromaticMap[i]
    //colors indeksowane od 0
    if(colors.length == 0) {
        colors.push({id: colors.length, nodes: [curentNode.id]})
        nodesNew.update({id: curentNode.id, group: colors.length-1}) //grupy od 0

        console.log("ID: %s, GR_CREATED: %s", curentNode.id, colors.length)
        continue
    }


    for(var j = 0; j < colors.length; j++) {
        var intersection = intersect(colors[j].nodes, neighborsMatrix[chromaticMap[i].id - 1])

        if(intersection.length == 0) {
            colors[j].nodes.push(curentNode.id)
            nodesNew.update({id: curentNode.id, group: colors[j].id})
            console.log("ID: %s, GR_ADDED: %s", chromaticMap[i].id, colors[j].id + 1)
            
            break
        } else {
            if(j == colors.length-1) {
                colors.push({id: colors.length, nodes: [curentNode.id]})
                nodesNew.update({id: curentNode.id, group: colors.length})
                console.log("ID: %s, GR_CREATED: %s", chromaticMap[i].id, colors.length)
                break
            }
        }
    }
}
console.log(colors)
console.log(chromaticMap)
console.log(nodesNew)
renderGraph(nodesNew, edgesNew)

  // create a network
 
  
//   nodes.forEach(function(node) {
//     nodes.update({ id: node.id, label: "Dupa"});
//   });
    