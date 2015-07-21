// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var d3 = require("d3");

var diameter = 620,
    dropdown = document.querySelector("select");

var svg = d3.select("responsive-child").append('svg')
  .attr('width', diameter)
  .attr('height', diameter)

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5)
    .value(d => d.size);

var drawBubbles = function() {
  var duration = 1000;

  var selectedYear = dropdown.value;
  var yearData = namesData.filter(function(name) { return name.year == selectedYear && name.total_perc < 10 });


  var nodes = bubble.nodes({children: yearData})
    .filter(d => !d.children); // filter out the outer bubble

  var node = svg.selectAll('.node')
    .data(nodes, d => d.name);

  var entering = node.enter()
    .append('g')
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
    .attr('class', 'node')
    
  entering.append("circle")
    .attr("r", d => 0)
    .style('opacity', 1)
    .style("fill", function(d) {
      console.log("fill", d);
      if (d.sex == "F") { 
        return "#fcc79b";
      } else {
        return "#c1ceaf";
      }
    })
  
  entering.append("text")
    .style("opacity", 0)
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text(function(d) { if (d.name) { return d.name.substring(0, d.r / 3); } });

  var transition = node.transition()
    .duration(duration)
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
    
  transition.select("circle")
    .attr("r", d => d.r);

  transition.select("text")
    .style("opacity", 1)
  
  var exiting = node.exit()
    .transition()
    .duration(duration)
  
  exiting.select("circle")
    .attr("r", d => 0)

  exiting.select("text")
    .style("opacity", 0)
  
  exiting.remove()
}

drawBubbles();
document.addEventListener("change", function() { drawBubbles() });

