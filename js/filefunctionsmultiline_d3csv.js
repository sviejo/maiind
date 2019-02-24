var currentLoadedFile01 = null;
var currentLoadedFile02 = null;

var width = 380;
var height = 400;
var mySVG = null;
var tooltip = null;

//COLOURS
var COLOURLINE_FILE01 = "#7F13C6";
var COLOURDOT_FILE01 = "#560989";
var COLOURLINE_FILE02 = "#B2AA0C";
var COLOURDOT_FILE02 = "#827C09";

function loadD3MultiLineGraph()
{
	console.log("Loading graph into prov01...");
	var prov01 = getProvinceIdFromComboBox(cbprovinces01);
	var capt01 = getCapitalNameFromComboBox(cbprovinces01);
	console.log("Loading graph into prov02...");
	var prov02 = getProvinceIdFromComboBox(cbprovinces02);
	var capt02 = getCapitalNameFromComboBox(cbprovinces02);
		
	if((prov01 != null) && (prov02 != null))
	{
		if((currentLoadedFile01 == null) && (currentLoadedFile02 == null))
		{
			currentLoadedFile01 = "data/temperature/Temp_" + prov01 + ".csv";
			currentLoadedFile02 = "data/temperature/Temp_" + prov02 + ".csv";
			selectMultiFile(currentLoadedFile01, currentLoadedFile02, capt01, capt02);
			document.getElementById("provinceTableComparison").innerHTML = loadProvincesTable(prov01, prov02);
		}
		else
		{
			currentLoadedFile01 = "data/temperature/Temp_" + prov01 + ".csv";
			currentLoadedFile02 = "data/temperature/Temp_" + prov02 + ".csv";
			updateMultiFile(currentLoadedFile01, currentLoadedFile02, capt01, capt02);
			document.getElementById("provinceTableComparison").innerHTML = loadProvincesTable(prov01, prov02);
		}
	}
	else
		alert("Debe seleccionar una provincia en cada uno de los listados");
}

function selectMultiFile(file01, file02, capt01, capt02)
{
	if(file01 != null)
	{
		d3.csv(file01, function(mydataf01)
		{
			d3.csv(file02, function(mydataf02)
			{
				//load data from file01
				mydataf01.forEach(function(d)
				{
					d.month = d.month;
					d.value = +d.value;
				});
				
				//verifying data loading f01
				console.log(mydataf01[0]);
				console.log(mydataf01[11]);
				
				//load data from file02
				mydataf02.forEach(function(d2)
				{
					d2.month = d2.month;
					d2.value = +d2.value;
				});
			
				//verifying data loading
				console.log(mydataf02[0]);
				console.log(mydataf02[11]);
								
				
				mySVG = d3.select("#d3LinesChartCSV")
							.append("svg")
							.attr("width", 450) 
							.attr("height", 450)
							.attr('class','fig');
			
				var x = d3.scaleBand()
							.domain(mydataf01.map(function (d) {return d.month; }))
							.range([0, width])
							.paddingOuter(1)
							.paddingInner(1);

				var y = d3.scaleLinear()
							.domain([0, 40])
							.rangeRound([height, 0]);
			
				var linef01 = d3.line()
									.x(function(d) { return x(d.month); })
									.y(function(d) { return y(d.value); });
							
				var linef02 = d3.line()
									.x(function(d2) { return x(d2.month); })
									.y(function(d2) { return y(d2.value); });
						
				var g = mySVG.append("g").attr("transform", "translate(" + 50 + "," + 20 + ")");
			
				g.append("g")
					.attr("class", "axis axis--x")
					.attr("transform", "translate(0," + height + ")")
					.call(d3.axisBottom(x).tickValues(x.domain().filter(function(d, i) { return !(i % 1); })));

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
					.datum(mydataf01)
					.attr("class", "line")
					.attr("stroke", COLOURLINE_FILE01)
					.attr("d", linef01);
				
				g.append("path")
					.datum(mydataf02)
					.attr("class", "line")
					.attr("stroke", COLOURLINE_FILE02)
					.attr("d", linef02);
					
				g.selectAll("dot")	
					.data(mydataf01)			
					.enter().append("circle")								
					.attr("r", 5)		
					.attr("cx", function(d) { return x(d.month); })
					.attr("cy", function(d) { return y(d.value); })
					.attr("fill", COLOURDOT_FILE01)
					.on("mouseover", function(d) 
					{		
						tooltip.html("[Información sobre " + capt01 + "]<br>Mes: " + (d.month) + "<br>Temperatura: " + (d.value) + "ºC");
						tooltip.style('background', COLOURDOT_FILE01);
						tooltip.transition().duration(300).style("opacity", .9);
					})
					.on("mouseout", function(d) 
					{ 
						tooltip.transition().duration(200).style("opacity", 0);
					});
				
				g.selectAll("dot")	
					.data(mydataf02)			
					.enter().append("circle")								
					.attr("r", 5)		
					.attr("cx", function(d) { return x(d.month); })
					.attr("cy", function(d) { return y(d.value); })
					.attr("fill", COLOURDOT_FILE02)
					.on("mouseover", function(d) 
					{		
						tooltip.html("[Información sobre " + capt02 + "]<br>Mes: " + (d.month) + "<br>Temperatura: " + (d.value) + "ºC");
						tooltip.style('background', COLOURDOT_FILE02);
						tooltip.transition().duration(300).style("opacity", .9);
					})
					.on("mouseout", function(d) 
					{ 
						tooltip.transition().duration(200).style("opacity", 0);
					});
				
				//tooltip (mouseover)
				tooltip = d3.select('#d3LinesChartCSV')
							.append('div')
							.attr('class', 'lineChartTooltip');
						
				tooltip.append('div')
						.attr('class', 'month');
					
				tooltip.append('div')
						.attr('class', 'value');
			});
		});
	}
}

function updateMultiFile(file01, file02, capt01, capt02)
{
	d3.csv(file01, function(mynewdataf01)
	{
		d3.csv(file02, function(mynewdataf02)
		{
			mynewdataf01.forEach(function(nd01)
			{
				nd01.month = nd01.month;
				nd01.value = +nd01.value;
			});
			//verifying data loading
			console.log(mynewdataf01[0]);
			console.log(mynewdataf01[11]);
			
			mynewdataf02.forEach(function(nd02)
			{
				nd02.month = nd02.month;
				nd02.value = +nd02.value;
			});
			//verifying data loading
			console.log(mynewdataf02[0]);
			console.log(mynewdataf02[11]);
			
			//remove any previously drawn svg elements
			mySVG.selectAll('g').remove();
			
			var x = d3.scaleBand()
							.domain(mynewdataf01.map(function (d) {return d.month; }))
							.range([0, width])
							.paddingOuter(1)
							.paddingInner(1);

			var y = d3.scaleLinear()
						.domain([0, 40])
						.rangeRound([height, 0]);
			
			var newlinef01 = d3.line()
								.x(function(nd1) { return x(nd1.month); })
								.y(function(nd1) { return y(nd1.value); });
							
			var newlinef02 = d3.line()
								.x(function(nd2) { return x(nd2.month); })
								.y(function(nd2) { return y(nd2.value); });
						
			var g = mySVG.append("g").attr("transform", "translate(" + 50 + "," + 20 + ")");
			
			g.append("g")
				.attr("class", "axis axis--x")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x).tickValues(x.domain().filter(function(d, i) { return !(i % 1); })));

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
				.datum(mynewdataf01)
				.attr("class", "line")
				.attr("stroke", COLOURLINE_FILE01)
				.attr("d", newlinef01);
			
			g.append("path")
				.datum(mynewdataf02)
				.attr("class", "line")
				.attr("stroke", COLOURLINE_FILE02)
				.attr("d", newlinef02);
					
			g.selectAll("dot")	
				.data(mynewdataf01)			
				.enter().append("circle")								
				.attr("r", 5)		
				.attr("cx", function(d) { return x(d.month); })
				.attr("cy", function(d) { return y(d.value); })
				.attr("fill", COLOURDOT_FILE01)
				.on("mouseover", function(d) 
				{		
					tooltip.html("[Información sobre " + capt01 + "]<br>Mes: " + (d.month) + "<br>Temperatura: " + (d.value) + "ºC");
					tooltip.style('background', COLOURDOT_FILE01);
					tooltip.transition().duration(300).style("opacity", .9);	
				})
				.on("mouseout", function(d) 
				{ 
					tooltip.transition().duration(200).style("opacity", 0);
				});
				
			g.selectAll("dot")	
				.data(mynewdataf02)			
				.enter().append("circle")								
				.attr("r", 5)		
				.attr("cx", function(d) { return x(d.month); })
				.attr("cy", function(d) { return y(d.value); })
				.attr("fill", COLOURDOT_FILE02)
				.on("mouseover", function(d) 
				{		
					tooltip.html("[Información sobre " + capt02 + "]<br>Mes: " + (d.month) + "<br>Temperatura: " + (d.value) + "ºC");
					tooltip.style('background', COLOURDOT_FILE02);
					tooltip.transition().duration(300).style("opacity", .9);
				})
				.on("mouseout", function(d) 
				{ 
					tooltip.transition().duration(200).style("opacity", 0);
				});
		});
	});
}

function loadProvincesTable(province01, province02) 
{	
	var table = "";
	var tableColumns = "";
	var header_included = false;
	var p1 = 0;
	var p2 = 0;
	
	var Prov01 = getProvinceById(province01);
	var Prov02 = getProvinceById(province02);
	
	table += "<div id=\"moreStats\">Tabla comparativa";
						
	tableColumns = "<tr>" +
						"<th>Mes</th>" +
						"<th>"+Prov01.capital.slice(0,4)+"</th>" +
						"<th>"+Prov02.capital.slice(0,4)+"</th>" +
						"<th>Dif</th>" +
					"</tr>";
						
	var dmd01 = Prov01.datastatisticaldeviation;
	var dmd02 = Prov02.datastatisticaldeviation;
						
	for(p1=0, p2=0, header_included=false; p1 < dmd01.length; p1++, p2++)
	{
		if(dmd01[p1].datatype == DATATYPE_TEMPERATURE)
		{
			if(!header_included)
			{			
				table += "<div id=\"tempComparisonDataTable\">" + 
							"<table id=\"compare\">";
				table += tableColumns;
				header_included = true;
			}
				
			table += "<tr>" +
						"<td>"+dmd01[p1].label+"</td>" +
						"<td>"+dmd01[p1].dvalue+"ºC</td>";
		}
		
		if(dmd02[p2].datatype == DATATYPE_TEMPERATURE)
		{			
			table +=	"<td>"+dmd02[p2].dvalue+"ºC</td>";
			
			var diff = parseFloat(dmd01[p1].dvalue-dmd02[p2].dvalue).toFixed(1);
			if(diff < 0)
				table += "<td class=\"negativeTempDiff\">"+diff+"ºC</td>";
			else
				table += "<td class=\"positiveTempDiff\">"+diff+"ºC</td>";
			table += "</tr>";
		}
	}
			//table [compare]
			table += "</table>";
			//table [tempComparisonDataTable]
			table += "</div>";
			//div [moreStats]
			table += "</div>";
	return table;
}