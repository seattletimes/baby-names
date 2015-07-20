// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var d3 = require("d3");

var diameter = 620,
    format = d3.format(",d"),
    dropdown = document.querySelector("select");

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5)
    .value(function(d){
      return d.size;
    });

var drawBubbles = function() {
  var selectedYear = dropdown.value;
  var yearData = namesData.filter(function(name) { return name.year == selectedYear && name.total_perc < 10 });

  d3.select("svg").remove()

  var svg = d3.select("responsive-child").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

  var node = svg.selectAll(".node")
    .data(bubble.nodes({children: yearData}))
    // .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  // Get rid of the root
  node[0].shift();

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { 
        if (d.sex == "F") { 
          return "#d6bddb";
        } else {
          return "#bfd7d8";
        }
      });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { if (d.name) { return d.name.substring(0, d.r / 3); } });
}

drawBubbles();
document.addEventListener("change", function() { drawBubbles() });

