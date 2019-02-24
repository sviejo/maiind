var width = 600,
    height = 600,
	radius = Math.min(width, height) / 2;
	
var svg, pie, arc, outerArc, legendRectSize, legendSpacing, pieTooltip, color;

function initializePie()
{
	d3.select("input[value=\"Oviedo\"]").property("checked", true);

	svg = d3.select("#d3PieChart")
			.append("svg")
			.attr("class", "pieSVG")
			.append("g")

	svg.append("g")
		.attr("class", "slices");
	svg.append("g")
		.attr("class", "sliceText");
	svg.append("g")
		.attr("class", "labelName");
	svg.append("g")
		.attr("class", "labelValue");
	svg.append("g")
		.attr("class", "lines");

	pie = d3.layout.pie()
		.sort(null)
		.value(function(d) 
		{
			return d.value;
		});

	arc = d3.svg.arc()
		.outerRadius(radius * 0.8)
		.innerRadius(radius * 0.5);

	outerArc = d3.svg.arc()
		.innerRadius(radius * 0.9)
		.outerRadius(radius * 0.9);

	legendRectSize = (radius * 0.05);
	legendSpacing = radius * 0.02;

	pieTooltip = d3.select("#d3PieChart").append("div").attr("class", "toolTip");

	svg.attr("transform", "translate(" + (width+150) / 2 + "," + height / 2 + ")");

	var colorRange = d3.scale.category20();
	color = d3.scale.ordinal()
				.range(colorRange.range());

	loadD3Pie("data/rain/Precip_Oviedo.csv");

	d3.selectAll("input").on("change", selectProvince);
}
	
	
function selectProvince()
{
	var value = this.value;
	if (value == "Oviedo")
	{
		loadD3Pie("data/rain/Precip_Oviedo.csv");
	}
	else if (value == "Albacete")
	{
		loadD3Pie("data/rain/Precip_Albacete.csv");
	}
	else if (value == "Bilbao")
	{
		loadD3Pie("data/rain/Precip_Bilbao.csv");
	}
	else if (value == "Almeria")
	{
		loadD3Pie("data/rain/Precip_Almeria.csv");
	}
	else if (value == "Madrid")
	{
		loadD3Pie("data/rain/Precip_Madrid.csv");
	}
	else if (value == "Malaga")
	{
		loadD3Pie("data/rain/Precip_Malaga.csv");
	}
}

function loadD3Pie(file) 
{
	d3.csv(file, function(data)
	{
		data.forEach(function(d)
		{
			d.month = d.month;
			d.value = +d.value;
		});
	
		// ------- PIE SLICES ------- //
		var slice = svg.select(".slices").selectAll("path.slice")
						.data(pie(data), function(d){ return d.data.month });

		slice.enter()
			.insert("path")
			.style("fill", function(d) { return color(d.data.month); })
			.attr("class", "slice");
		
		slice.transition().duration(1000)
			.attrTween("d", function(d) 
			{
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) { return arc(interpolate(t)); };
			});
    
		slice.on("mousemove", function(d)
		{
            pieTooltip.style("left", d3.event.pageX+10+"px");
            pieTooltip.style("top", d3.event.pageY-25+"px");
            pieTooltip.style("display", "inline-block");
            pieTooltip.html("Mes: " + (d.data.month) + "<br>" + (d.data.value) + "m<sup>3</sup>");
        });
    
		slice.on("mouseout", function(d)
		{
            pieTooltip.style("display", "none");
        });
				
		slice.exit().remove();

		// ------- PIE LEGEND ------- //
		var legend = svg.selectAll('.legend')
						.data(color.domain())
						.enter()
						.append('g')
						.attr('class', 'legend')
						.attr('transform', function(d, i) 
						{
							var height = legendRectSize + legendSpacing;
							var offset =  height * color.domain().length / 2;
							var horz = -3 * legendRectSize;
							var vert = i * height - offset;
							return 'translate(' + horz + ',' + vert + ')';
						});

		legend.append('rect')
				.attr('width', legendRectSize)
				.attr('height', legendRectSize)
				.style('fill', color)
				.style('stroke', color);

		legend.append('text')
				.attr('x', legendRectSize + legendSpacing)
				.attr('y', legendRectSize - legendSpacing)
				.text(function(d) { return d; });
				
		// ------- TEXT LABELS ------- //
		var text = svg.select(".labelName").selectAll("text")
						.data(pie(data), function(d){ return d.data.month });

		text.enter()
			.append("text")
			.attr("dy", ".35em")
			.attr('class', 'labeltext')
			.text(function(d) 
			{
				return (d.data.month+": "+d.value+"m\xB3");
			});

		function midAngle(d){ return d.startAngle + (d.endAngle - d.startAngle)/2; }

		text.transition().duration(1000)
			.attrTween("transform", function(d) 
			{
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) 
				{
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d)
			{
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) 
				{
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			})
			.text(function(d) 
			{
				return (d.data.month+": "+d.value+"m\xB3");
			});

		text.exit().remove();

		// ------- SLICE TO TEXT POLYLINES ------- //
		var polyline = svg.select(".lines").selectAll("polyline")
							.data(pie(data), function(d){ return d.data.month });

		polyline.enter()
			.append("polyline");

		polyline.transition().duration(1000)
				.attrTween("points", function(d)
				{
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) 
					{
						var d2 = interpolate(t);
						var pos = outerArc.centroid(d2);
						pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
						return [arc.centroid(d2), outerArc.centroid(d2), pos];
					};
				});

		polyline.exit().remove();
	});
};