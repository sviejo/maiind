var currentLoadedFile = null;

/*COLOUR TYPES*/
var PRIMARY_COLOUR = 0;
var HOVER_COLOUR = 1;

var mySVG = null;
var heightScale = null;
var tooltip = null;

function selectFile(file, primaryColour, hoverColour)
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
		
			mySVG = d3.select("#d3BarsChartCSV")
				.append("svg")
				.attr("width", 450) 
				.attr("height", 450)
				.attr('class','fig');
			
			heightScale = d3.scale.linear()
				.domain([0, d3.max(mydata,function(d) { return d.value;})])
				.range([0, 250]);
					
			mySVG.selectAll(".xLabel")
				.data(mydata)
				.enter().append("svg:text")
				.attr("x", function(d,i) {return 113 + (i * 22);})
				.attr("y", 435)
				.attr("text-anchor", "middle") 
				.text(function(d,i) {return d.month;})
				.attr('transform',function(d,i) {return 'rotate(-90,' + (113 + (i * 22)) + ',435)';}); 
					
			var yLabel = mySVG.selectAll(".yLabel")
				.data(heightScale.ticks(10));
			
			yLabel.enter().append("svg:text")
				.attr('x',80)
				.attr('y',function(d) {return 400 - heightScale(d);})
				.attr("text-anchor", "end") 
				.text(function(d) {return d;}); 
					
			var yTicks = mySVG.selectAll(".yTicks")
				.data(heightScale.ticks(10));
			
			yTicks.enter().append("svg:line")
				.attr('x1','90')
				.attr('y1',function(d) {return 400 - heightScale(d);})
				.attr('x2',370)
				.attr('y2',function(d) {return 400 - heightScale(d);})
				.style('stroke','lightgray');
		
			var content = mySVG.selectAll('rect')
				.data(mydata);
		
			var myBars = content.enter().append('svg:rect')
				.attr('width',20)
				.attr("height", 0)
				//.attr('height',function(d,i) {return heightScale(d.value);})
				.attr('x',function(d,i) {return (i * 22) + 100;})
				.attr('y',function(d,i) {return 400 - heightScale(d.value);})
				.on("mouseover", function(d) 
				{ 
					d3.select(this).style("fill", hoverColour);
					tooltip.html("Mes: " + (d.month) + "<br>Valor: " + (d.value) + "m<sup>3</sup>");
					tooltip.style('display', 'block');
				})
				.on("mouseout", function(d) 
				{ 
					d3.select(this).style("fill", primaryColour); 
					tooltip.style('display', 'none');
				})
				.style('fill', primaryColour);
			
			myBars.transition()
				.delay(function(d,i) {return i*80;})
				.attr('height',function(d,i) {return heightScale(d.value);})
					
			//legend (mouseover)
			tooltip = d3.select('#d3BarsChartCSV')
				.append('div')
				.attr('class', 'chartTooltip');
					
			tooltip.append('div')
				.attr('class', 'month');
				
			tooltip.append('div')
				.attr('class', 'value');
		});
	}
}

function updateData(file, primaryColour, hoverColour)
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
		
		heightScale = d3.scale.linear()
			.domain([0, d3.max(mydata,function(newDomain) { return newDomain.value;})])
			.range([0, 250]);
			
		//remove any previously drawn svg elements
		mySVG.selectAll('rect').remove();
		mySVG.selectAll('text').remove();
		mySVG.selectAll('line').remove();
		
		mySVG.selectAll(".xLabel")
			.data(mydata)
			.enter().append("svg:text")
			.attr("x", function(newDomain,i) {return 113 + (i * 22);})
			.attr("y", 435)
			.attr("text-anchor", "middle") 
			.text(function(newDomain,i) {return newDomain.month;})
			.attr('transform',function(newDomain,i) {return 'rotate(-90,' + (113 + (i * 22)) + ',435)';}); 	
		
		var yLabel = mySVG.selectAll(".yLabel")
			.data(heightScale.ticks(10));
			
		yLabel.enter().append("svg:text")
				.attr('x',80)
				.attr('y',function(newDomain) {return 400 - heightScale(newDomain);})
				.attr("text-anchor", "end") 
				.text(function(newDomain) {return newDomain;}); 
					
		var yTicks = mySVG.selectAll(".yTicks")
			.data(heightScale.ticks(10));
			
		yTicks.enter().append("svg:line")
				.attr('x1','90')
				.attr('y1',function(newDomain) {return 400 - heightScale(newDomain);})
				.attr('x2',370)
				.attr('y2',function(newDomain) {return 400 - heightScale(newDomain);})
				.style('stroke','lightgray');
		
		var newContent = mySVG.selectAll("rect")
						.data(mydata, function(newDomain) { return newDomain.month; });
														
		var myUpdatedBars =	newContent.enter().append('svg:rect')
							.attr('width',20)
							.attr("height", 0)
							.attr('x',function(newDomain,i) {return (i * 22) + 100;})
							.attr('y',function(newDomain,i) {return 400 - heightScale(newDomain.value);})
							.on("mouseover", function(newDomain) 
							{ 
								d3.select(this).style("fill", hoverColour);
								tooltip.html("Mes: " + (newDomain.month) + "<br>Valor: " + (newDomain.value) + "m<sup>3</sup>");
								tooltip.style('display', 'block');
							})
							.on("mouseout", function(newDomain) 
							{ 
								d3.select(this).style("fill", primaryColour); 
								tooltip.style('display', 'none');
							})
							.style('fill', primaryColour);
		
		myUpdatedBars.transition()
					.delay(function(newDomain,i) {return i*30;})
					.attr('height',function(newDomain,i) {return heightScale(newDomain.value);})
	

	});
}

function loadD3BarsGraph()
{
	var i = 0;
	var found = false;
	var primaryColour = getColour(PRIMARY_COLOUR);
	var hoverColour = getColour(HOVER_COLOUR);
		
	for(i; i < arrProvinces.length; i++)
	{
		if(arrProvinces[i].capital == cbprovinces.options[cbprovinces.selectedIndex].text)
		{
			found = true;
			console.log("Loading graph from: " + arrProvinces[i].id);
			if(currentLoadedFile == null)
			{
				currentLoadedFile = "data/rain/Precip_" + arrProvinces[i].id + ".csv";
				selectFile(currentLoadedFile, primaryColour, hoverColour);
			}
			else
			{
				currentLoadedFile = "data/rain/Precip_" + arrProvinces[i].id + ".csv";
				updateData(currentLoadedFile, primaryColour, hoverColour);
			}
			break;
		}
	}
	if(!found)
		alert("Debe seleccionar una provincia del listado");
}

function getColour(colourType)
{
	switch(colourType)
	{
		case PRIMARY_COLOUR:
		{
			if(document.getElementById("b").checked)
				return "#A3CEDC";
			if(document.getElementById("g").checked)
				return "#66FF33";
			if(document.getElementById("r").checked)
				return "#FF0000";
		}
		
		case HOVER_COLOUR:
		{
			if(document.getElementById("b").checked)
				return "#5D8896";
			if(document.getElementById("g").checked)
				return "#208000";
			if(document.getElementById("r").checked)
				return "#F78181";
		}
	}
}