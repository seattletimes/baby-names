// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var d3 = require("d3/d3.min.js");

var diameter = 320,
    dropdown = document.querySelector("select");

var svg = d3.select(".bubbles").append('svg')
  .attr('width', diameter)
  .attr('height', diameter)

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5)
    .value(d => d.size);

// show tooltip

var tooltip = document.querySelector(".tooltip");

var looping = true;

var showTooltip = function(d, target) {
  if (!looping) {
    svg.selectAll('.node').selectAll("circle")
      .style("fill", function(d) { return d.sex == "F" ? "#fcc79b" : "#c1ceaf" })
    d3.select(target.querySelector("circle"))
      .style("fill", function(d) { return d.sex == "F" ? "#f47920" : "#528965" })

    d.label = d.sex == "F" ? "female" : "male";

    tooltip.classList.add("show");
    tooltip.innerHTML = `
      <div><strong>Rank: ${d.rank}</strong></div>
      <div>${d.perc}% of ${d.label} babies</div>
    `;
  }
}

var hideTooltip = function(d, target) {
  if (!looping) {
    svg.selectAll('.node').selectAll("circle")
      .style("fill", function(d) { return d.sex == "F" ? "#fcc79b" : "#c1ceaf" })
    tooltip.classList.remove("show");
  }
}

// draw bubbles

var drawBubbles = function(selectedYear) {
  var duration = 1000;

  var yearData = namesData.filter(function(name) { return name.year == selectedYear && name.total_perc < 10 });

  var nodes = bubble.nodes({children: yearData})
    .filter(d => !d.children); // filter out the outer bubble

  var node = svg.selectAll('.node')
    .data(nodes, d => d.name);

  var entering = node.enter()
    .append('g')
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
    .attr('class', 'node')
    .on("mouseenter", function(d) { 
      showTooltip(d, this);
    })
    .on("mouseleave", function(d) { 
      hideTooltip(d, this);
      tooltip.classList.remove("show");
    });
    
  entering.append("circle")
    .attr("r", d => 0)
    .style('opacity', 1)
    .style("fill", function(d) {
      if (d.sex == "F") { 
        return "#fcc79b";
      } else {
        return "#c1ceaf";
      }
    });


  entering.append("text")
    .style("opacity", 0)
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text(function(d) { if (d.name) { return d.name.substring(0, d.r / 2); } });

  var transition = node.transition()
    .duration(duration)
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
    
  transition.select("circle").attr("r", d => d.r);

  transition.select("text").style("opacity", 1);
  
  var exiting = node.exit()
    .transition()
    .duration(duration);
  
  exiting.select("circle").attr("r", d => 0);

  exiting.select("text").style("opacity", 0);
  
  exiting.remove();
}

var updateInfo = function(year) {
  document.querySelector(".info").innerHTML = `${year}`;
};

dropdown.addEventListener("change", function() { 
  looping = false;
  document.querySelector(".chart").classList.add("clickable");
  clearTimeout(loop);
  drawBubbles(dropdown.value);
  updateInfo(dropdown.value);
});

var years = [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2013];
var i = 0;

var loop = null;
var tick = function() {
  drawBubbles(years[i]);
  updateInfo(years[i]);
  i = (i + 1) % years.length;
  loop = setTimeout(tick, i == 0 ? 3000 : 2000);
};

tick();

// get tooltip to move with cursor

document.querySelector(".bubbles").addEventListener("mousemove", function(e) {
  var bounds = this.getBoundingClientRect();
  var x = e.clientX - bounds.left;
  var y = e.clientY - bounds.top;
  tooltip.style.left = x + 10 + "px";
  tooltip.style.top = y + 10 + "px";

  tooltip.classList.toggle("flip", x > bounds.width / 2);
});
