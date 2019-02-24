var currentLoadedFile = null;

var width = 380;
var height = 400;
var mySVG = null;
var tooltip = null;

function selectFile(file)
{
	if(file != null)
	{
		d3.csv(file, function(mydata)
		{
			mydata.forEach(function(d)
			{
				d.month = d.month;
				d.value = +d.value;
			});
			//verifying data loading
			console.log(mydata[0]);
			console.log(mydata[11]);
			
			var x = d3.scaleBand()
						.domain(mydata.map(function (d) {return d.month; }))
						.range([0, width])
						.paddingOuter(1)
						.paddingInner(1);

			var y = d3.scaleLinear()
						.domain([d3.min(mydata, function(d) { return d.value; }) - 4, d3.max(mydata, function(d) { return d.value; }) + 4])
						.rangeRound([height, 0]);

			var line = d3.line()
							.x(function(d) { return x(d.month); })
							.y(function(d) { return y(d.value); });
			
			var zoom = d3.zoom()
							.scaleExtent([1, 10])
							.on("zoom", zoomed);
								
			mySVG = d3.select("#d3LineChartCSV")
				.append("svg")
				.attr("width", 450) 
				.attr("height", 450)
				.attr('class','fig')
				.call(zoom);
			
			var g = mySVG.append("g").attr("transform", "translate(" + 50 + "," + 20 + ")");
			
			g.append("g")
				.attr("class", "axis axis--x")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x).tickValues(x.domain().filter(function(d, i) { return !(i % 2); })));

			g.append("g")
				.attr("class", "axis axis--y")
				.call(d3.axisLeft(y).ticks(6))
				.append("text")
				.attr("fill", "#000")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.style("text-anchor", "end")
				.text("Temperatura (ºC)");

			g.append("path")
				.datum(mydata)
				.attr("class", "line")
				.attr("stroke", "#F92C01")
				.attr("d", line);
				
			g.selectAll("dot")	
				.data(mydata)			
				.enter().append("circle")								
				.attr("r", 5)
				.attr("cx", function(d) { return x(d.month); })
				.attr("cy", function(d) { return y(d.value); })
				.attr("fill", "#681302")
				.on("mouseover", function(d) 
				{		
					tooltip.html("Mes: " + (d.month) + "<br>Temperatura: " + (d.value) + "ºC");
					tooltip.style('background', "#681302");
					tooltip.transition().duration(300).style("opacity", .9);
				})
				.on("mouseout", function(d) 
				{ 
					tooltip.transition().duration(200).style("opacity", 0);
				});
					
			//tooptip (mouseover)
			tooltip = d3.select('#d3LineChartCSV')
				.append('div')
				.attr('class', 'lineChartTooltip');
					
			tooltip.append('div')
				.attr('class', 'month');
				
			tooltip.append('div')
				.attr('class', 'value');
		});
	}
}

function updateData(file)
{
	d3.csv(file, function(mydata)
	{
		mydata.forEach(function(newDomain)
		{
			newDomain.month = newDomain.month;
			newDomain.value = +newDomain.value;
		});
		//verifying data loading
		console.log(mydata[0]);
		console.log(mydata[11]);
			
		//remove any previously drawn svg elements
		mySVG.selectAll('g').remove();
		
		var x = d3.scaleBand()
						.domain(mydata.map(function (d) {return d.month; }))
						.range([0, width])
						.paddingOuter(1)
						.paddingInner(1);

		var y = d3.scaleLinear()
						.domain([0, d3.max(mydata, function(d) { return d.value; })+10])
						.rangeRound([height, 0]);
			
		var line = d3.line()
						.x(function(d) { return x(d.month); })
						.y(function(d) { return y(d.value); });
						
		var g = mySVG.append("g").attr("transform", "translate(" + 50 + "," + 20 + ")");
			
		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).tickValues(x.domain().filter(function(d, i) { return !(i % 2); })));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y).ticks(6))
			.append("text")
			.attr("fill", "#000")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.style("text-anchor", "end")
			.text("Temperatura (ºC)");

		g.append("path")
			.datum(mydata)
			.attr("class", "line")
			.attr("stroke", "#F92C01")
			.attr("d", line);
				
		g.selectAll("dot")	
			.data(mydata)			
			.enter().append("circle")								
			.attr("r", 5)		
			.attr("cx", function(d) { return x(d.month); })
			.attr("cy", function(d) { return y(d.value); })
			.attr("fill", "#681302")
			.on("mouseover", function(d) 
			{		
				tooltip.html("Mes: " + (d.month) + "<br>Valor: " + (d.value) + "ºC");
				tooltip.transition().duration(300).style("opacity", .9);	
			})
			.on("mouseout", function(d) 
			{ 
				tooltip.transition().duration(200).style("opacity", 0);
			});
	});
}

function loadD3LineGraph()
{
	var i = 0;
	var found = false;
		
	for(i; i < arrProvinces.length; i++)
	{
		if(arrProvinces[i].capital == cbprovinces.options[cbprovinces.selectedIndex].text)
		{
			found = true;
			console.log("Loading graph from: " + arrProvinces[i].id);
			if(currentLoadedFile == null)
			{
				currentLoadedFile = "data/temperature/Temp_" + arrProvinces[i].id + ".csv";
				selectFile(currentLoadedFile);
				document.getElementById("d3LineChartCSV").style.border = "1px dashed #369";
				document.getElementById("resetButton").style.display = "block";
			}
			else
			{
				currentLoadedFile = "data/temperature/Temp_" + arrProvinces[i].id + ".csv";
				updateData(currentLoadedFile);
			}
			break;
		}
	}
	if(!found)
		alert("Debe seleccionar una provincia del listado");
}

function zoomed() 
{
	mySVG.select('g')
		.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
}

function resetZoom()
{
	mySVG.select("g")
		.attr("transform", "translate(" + 50 + "," + 20 + ")");
}