var RADIUS = 5;

function loadMapPointsFromProvinces()
{
	var mySVG = d3.select("#layer01")
						.append("svg")
						.attr("width", 550) 
						.attr("height", 350);
						
	var mpoint = mySVG.selectAll('circle')
						.data(arrProvinces)
						.enter().append("a")
						.attr("xlink:href", function(d) { return "citycard.html?prov=" + d.id; })
						.append('svg:circle')
						.attr('class','pointBlink')
						.attr('r', RADIUS)
						.attr('cx', function(d) { return d.x_coord; })
						.attr('cy', function(d) { return d.y_coord; })
						.attr('opacity', 0.9)
						.on("mouseover", function(d)
						{
							d3.select(this).attr("r", RADIUS*2)
											.style("fill", "#FCB501")
											.style("stroke", "#E0EDE3");
						})
						.on("mouseout", function(d)
						{
							d3.select(this).attr("r", RADIUS)
											.style("fill", "#E0EDE3")
											.style("stroke", "#FCB501");
						})
						.style("fill", "#E0EDE3")
						.style("stroke", "#FCB501")
						.style("stroke-width", 2);
						
	var provName = mySVG.selectAll('circle')
						.append("svg:title")
						.text(function(d) { return d.capital; });
}