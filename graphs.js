var nodesArray, edgesArray, nodes, edges, network, incNode, incEdge;
var forksArray, container, options;

function calculateForks() {
  for(var i = 0; i < edgesArray.length; i++) {
    
  }
}

function startNetwork() {
  nodesArray = [
    {id: 1, label: '1'},
    {id: 2, label: '2'},
    {id: 3, label: '3'},
    {id: 4, label: '4'},
    {id: 5, label: '5'},
    {id: 6, label: '6'}
  ];
  nodes = new vis.DataSet(nodesArray);
  incNode = 6;

  edgesArray = [
    {id: 1, from: 1, to: 3},
    {id: 2, from: 2, to: 3},
    {id: 3, from: 5, to: 2},
    {id: 4,from: 3, to: 3},
    {id: 5,from: 6, to: 1},
    {id: 6,from: 2, to: 6},
    {id: 7,from: 4, to: 1}
  ];
  incEdge = 7;

  forksArray = [
    {node: 1, fork: 3, color: -1},
    {node: 2, fork: 3, color: -1},
    {node: 3, fork: 3, color: -1},
    {node: 4, fork: 1, color: -1},
    {node: 5, fork: 1, color: -1},
    {node: 6, fork: 2, color: -1},
  ];

  edges = new vis.DataSet(edgesArray);
  
  container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
  
  options = {
    nodes: {shape: "dot", borderWidth: 2},
    manipulation: {
      enabled: true
    },
    manipulation: {
      addNode: function(data, callback) {
        console.log("Add node");
        incNode++;
        data.id = incNode;
        data.label = String(incNode);
        forksArray.push({node: incNode, fork: 0, color: 0})
        callback(data);
      },
      addEdge: function(data, callback) {
        console.log("Add Edge");
        forksArray = forksArray.map(function(x) {
          if(data.from == x.node || data.to == x.node)
            x.fork++;
          return x;
        })
        console.log(forksArray);
        incEdge++;
        edgesArray.push({id: incEdge,from: data.from, to: data.to});
        callback(data);
      },
      deleteNode: function(data, callback) {
        console.log("Delete node");
        
        
        edgesArray = edgesArray.filter(function(x) {
          if(x.from == data.nodes[0]) {
            forksArray.map(function(y) {
              if(y.node == x.to) {
                y.fork--;
              }
            })
          }

          if(x.to == data.nodes[0]) {
            forksArray.map(function(y) {
              if(y.node == x.from) {
                y.fork--;
              }
            })
          }
          return !(x.from == data.nodes[0] || x.to == data.nodes[0]);
        });

        forksArray = forksArray.filter(function(x) {
          return (x.node != data.nodes[0]);
        });

        callback(data);
      },
      deleteEdge: function(data, callback) {
        console.log("Delete edge");
        let from, to;
        edgesArray = edgesArray.filter(function(x) {
          if(x.id == data.edges[0]){
            from = x.from
            to = x.to
          } else {
            return true;
          }
        })
        
        forksArray = forksArray.map(function(x) {
          if(x.node == from || x.node == to)
            x.fork--;
          return x;
        })
      
        callback(data);
      },
      editEdge: function(data, callback) {
        console.log("Edit edge");
        edgesArray = edgesArray.map(function(x) {
          if(data.id == x.id) {
            let prev, curr
            if(x.from != data.from) {
              prev = x.from;
              curr = data.from;
              x.from = data.from
              
            } else {
              prev = x.to
              curr = data.to
              x.to = data.to
            }

            forksArray = forksArray.map(function(y) {
              if(y.node == prev)
                y.fork--
              if(y.node == curr)
                y.fork++
              return y;
            })
          }
          return x;
        })

        callback(data);
      }
    }
  };

  network = new vis.Network(container, data, options);
}


function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function greedyColor(vert) {
  //vert - posortowana tablica forkow
  console.log(vert)
  forksArray = forksArray.map(function(x) {
    x.color = -1;
    return x;
  })

  for(let i = 0; i < vert.length; i++) {
    let adjacentEdges = edgesArray.filter(function(x) {
      if(x.from == x.to)
        return false;
      if(x.from == vert[i].node || x.to == vert[i].node)
        return true;
    })

    let adjacentNodes = adjacentEdges.map(function(x) {
      let n;
      if(x.from == vert[i].node)
        n = x.to;
      else
        n = x.from;

      return n;
    })

    let kolor = 0;

    for(let j = 0; j < adjacentNodes.length; j++) {
      let n = forksArray.filter(function(x) {
        return (x.node == adjacentNodes[j]) 
      })[0]

      if(n.color == kolor) {
        j=-1;
        kolor++;
      } 
    }

    forksArray = forksArray.map(function(x) {
      if(x.node == vert[i].node)
        x.color = kolor;
      return x;
    })
    nodes.update([{id:vert[i].node, group: kolor}]);
    console.log("Node: " + vert[i].node + " -> Kolor: " + kolor);
  }
}

function colorLF() {
  decolor();
  var cp = JSON.parse(JSON.stringify(forksArray));
  cp.sort(function(a, b){
    if(b.fork != a.fork)
      return b.fork - a.fork;
    return a.node - b.node;
  })
  
  greedyColor(cp)
}

function colorGraph() {
  if(document.getElementById("lf").checked == true)
    colorLF();
  if(document.getElementById("sl").checked == true)
    colorSL();
}

function decolor() {
  for(var i = 0; i < forksArray.length; i++) {
    nodes.update([{id:forksArray[i].node, group: -1}]);
  }

  forksArray = forksArray.map(function(x){
    x.color = -1;
    return x;
  })
}

function colorSL() {
  //DEEP CLONING
  decolor();
  let copyForks = JSON.parse(JSON.stringify(forksArray));
  let copyEdges = JSON.parse(JSON.stringify(edgesArray));
  
  let kolor = [];
  let len = copyForks.length;
  
  for(let i = 0; i < len; i++) {
    copyForks.sort(function(a, b){
      if(a.fork != b.fork)
        return (a.fork - b.fork);
      return (a.node - b.node);
    });
    
    let curr = copyForks[0];

    copyForks = copyForks.filter(function(x) {
      return (x.node != curr.node);
    });

    copyForks = copyForks.map(function(x) {
      for(let j = 0; j < copyEdges.length; j++) {
        if(x.node == copyEdges[j].from && curr.node == copyEdges[j].to)
          x.fork--;
        if(x.node == copyEdges[j].to && curr.node == copyEdges[j].from)
          x.fork--;
      }
      return x;
    });


    kolor.push(curr);
  }

  greedyColor(kolor.reverse());
}

function randomize() {
  let rEdges = document.getElementById("rEdges").value;
  let rNodes = document.getElementById("rNodes").value;
  nodesArray = [];
  forksArray = [];
  for(let i = 1; i <= rNodes; i++) {
    nodesArray.push({id: i, label: String(i)});
    forksArray.push({node: i, fork: 0, color: -1})
  }
  
  nodes = new vis.DataSet(nodesArray);
  incNode = rNodes;

  edgesArray = []
  for(let i = 1; i <= rEdges; i++) {
    let to = Math.floor(Math.random() * (rNodes) + 1);
    let from = Math.floor(Math.random() * (rNodes) + 1);
    edgesArray.push({id: i, from: from, to: to});
    forksArray = forksArray.map(function(x) {
      if(x.node == from || x.node == to)
        x.fork++;
      return x;
    })
  }
  incEdge = rEdges;

  edges = new vis.DataSet(edgesArray);

  var data = {
    nodes: nodes,
    edges: edges
  };
  network = new vis.Network(container, data, options);
}