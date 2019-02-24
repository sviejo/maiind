function readTextFile(file, rot, chart)
{
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function ()
	{
		if(rawFile.readyState === 4)
		{
			if(rawFile.status === 200 || rawFile.status == 0)
			{
				var allText = rawFile.responseText;
				processCSVFile(allText, rot, chart);
			}
		}
	}
	rawFile.send(null);
}
	
function processCSVFile(file_content, rot, chart)
{	
	var allLinesArray = file_content.split('\n');
	if (allLinesArray.length > 0) 
	{
		var dataPoints = [];
		//skip column titles
		for (var i = 1; i <= allLinesArray.length - 1; i++) 
		{
			var rowData = allLinesArray[i].split(',');
			if(rowData && rowData.length > 1)
				dataPoints.push({ label: rowData[0], y: parseInt(rowData[1]) });
		}
		chart.options.data[0].dataPoints = dataPoints;
					
		//dependant chart type properties
		var chartText = "";
		if(rot == 0)//rain
		{
			chartText+= "Precipitaciones anuales de ";
			chart.options.title.fontColor="#109199";
			chart.options.title.backgroundColor="#9FE5E9";
			chart.options.data[0].type="column";
			chart.options.data[0].color="#B0D0B0";
		}
		if(rot == 1)//temperature
		{
			chartText+= "Temperatura anual de ";
			chart.options.title.fontColor="#DD864E";
			chart.options.title.backgroundColor="#FFFFE0";
			chart.options.data[0].type="line";
			chart.options.data[0].color="#E80B01";
		}
					
		chart.options.title.text = chartText + currentCapitalFullName;					
		chart.render();
	}
}