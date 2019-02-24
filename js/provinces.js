var DATATYPE_RAIN = "rain";
var DATATYPE_TEMPERATURE = "temp";

/* province stucture */
var Province = function (id) 
{
  this.id = id;
  this.fullprovincetitle = "";
  this.region = "";
  this.capital = "";
  this.x_coord = 0;
  this.y_coord = 0;
  //avgrain
  this.avgr_fyear = 0;
  this.avgr_lyear = 0;
  //avgtemp
  this.avgt_fyear = 0;
  this.avgt_lyear = 0;
  //FOR STATISTICAL PURPOSES ONLY
  this.datastatisticaldeviation = [];
  //// -> rain
  this.avgrain = 0;
  this.variancerain = 0;
  this.stddevrain = 0;
  this.meandevrain = 0;
  this.totalrain = 0;
  this.totalrainrows = 0;
  this.rainymonths = [];
  this.driestmonths = [];
  //// -> rain
  this.avgtemp = 0;
  this.variancetemp = 0;
  this.stddevtemp = 0;
  this.meandevtemp = 0;
  this.totaltemp = 0;
  this.totaltemprows = 0;
  this.hottestmonths = [];
  this.coldestmonths = [];
  console.log('Province instantiated');
};

Province.prototype.addFullProvinceTitle = function(fullprovincetitle) 
{
  this.fullprovincetitle = fullprovincetitle;
};

Province.prototype.addRegion = function(region) 
{
  this.region = region;
};

Province.prototype.addCapital = function(capital) 
{
  this.capital = capital;
};

Province.prototype.setCoordinates = function(x_coord, y_coord) 
{
  this.x_coord = x_coord;
  this.y_coord = y_coord;
};

Province.prototype.setStatisticalDeviationForData = function(dataType, label, dataValue) 
{
  this.datastatisticaldeviation.push(new Stats(dataType, label, dataValue));
};

// RAIN - RAIN - RAIN - RAIN - RAIN - RAIN //
Province.prototype.setRainRangeData = function(avgr_fyear, avgr_lyear) 
{
  this.avgr_fyear = avgr_fyear;
  this.avgr_lyear = avgr_lyear;
};

Province.prototype.setAverageRain = function(avgrain) 
{
  this.avgrain = avgrain;
};

Province.prototype.setVarianceRain = function(variancerain) 
{
  this.variancerain = variancerain;
};

Province.prototype.setStandardDeviationRain = function(stddevrain)
{
  this.stddevrain = stddevrain;
};

Province.prototype.setMeanDeviationRain = function(meandevrain)
{
  this.meandevrain = meandevrain;
};

Province.prototype.setTotalRain = function(totalrain) 
{
  this.totalrain = totalrain;
};

Province.prototype.setTotalRainRows = function(totalrainrows) 
{
  this.totalrainrows = totalrainrows;
};

Province.prototype.setMostRainyMonths = function(rainymonths) 
{
  this.rainymonths = rainymonths;
};

Province.prototype.setMostDriestMonths = function(driestmonths) 
{
  this.driestmonths = driestmonths;
};

// TEMPERATURE - TEMPERATURE - TEMPERATURE //
Province.prototype.setTemperatureRangeData = function(avgt_fyear, avgt_lyear) 
{
  this.avgt_fyear = avgt_fyear;
  this.avgt_lyear = avgt_lyear;
};

Province.prototype.setAverageTemperature = function(avgtemp) 
{
  this.avgtemp = avgtemp;
};

Province.prototype.setVarianceTemp = function(variancetemp) 
{
  this.variancetemp = variancetemp;
};

Province.prototype.setStandardDeviationTemp = function(stddevtemp)
{
  this.stddevtemp = stddevtemp;
};

Province.prototype.setMeanDeviationTemp = function(meandevtemp)
{
  this.meandevtemp = meandevtemp;
};

Province.prototype.setTotalTemp = function(totaltemp) 
{
  this.totaltemp = totaltemp;
};

Province.prototype.setTotalTempRows = function(totaltemprows) 
{
  this.totaltemprows = totaltemprows;
};

Province.prototype.setMostHottestMonths = function(hottestmonths) 
{
  this.hottestmonths = hottestmonths;
};

Province.prototype.setMostColdestMonths = function(coldestmonths) 
{
  this.coldestmonths = coldestmonths;
};


/* data stucture */
var Stats = function (datatype, label, dvalue) 
{
  this.datatype = datatype;
  this.label = label;
  this.dvalue = dvalue;
  this.md = 0;
  console.log('Statistical data instantiated');
};

Stats.prototype.setMeanDeviation = function(md) 
{
  this.md = md;
};
/******************************************************************************************************************************/
/******************************************************************************************************************************/
/******************************************************************************************************************************/

/* collection */
var arrProvinces = [];

/* collection loading */
function loadProvincesData(xml)
{
	var xmlDoc = xml.responseXML;
	var provincesLoV = xmlDoc.getElementsByTagName('provinces');
	if(provincesLoV.length==1)
	{
		var provinces = provincesLoV[0].getElementsByTagName('province');

		for (i = 0; i < provinces.length; i++)
		{
			var atrProvince = provinces[i].attributes;
			
			var currprov = new Province(atrProvince.getNamedItem("id").nodeValue);
			
			var dataProvince = provinces[i].childNodes;
			var region = "";
			
			for(j = 0; j < dataProvince.length; j++)
			{
				if (dataProvince[j].nodeType == 1)
				{
					if(j==1)//region
						currprov.addRegion(dataProvince[j].textContent);
					if(j==3)//capital
						currprov.addCapital(dataProvince[j].textContent);
					if(j==5)//fullprovincetitle
						currprov.addFullProvinceTitle(dataProvince[j].textContent);
					if(j==7)//maplocation
					{
						var mlocatt = dataProvince[j].attributes;
						currprov.setCoordinates(mlocatt.getNamedItem("x").nodeValue, mlocatt.getNamedItem("y").nodeValue);
					}					
					if(j==9)//avgrain range
					{
						var arain = dataProvince[j].attributes;
						currprov.setRainRangeData(arain.getNamedItem("first_year").nodeValue, arain.getNamedItem("last_year").nodeValue);
					}
					if(j==11)//avgtemp range
					{
						var atemp = dataProvince[j].attributes;
						currprov.setTemperatureRangeData(atemp.getNamedItem("first_year").nodeValue, atemp.getNamedItem("last_year").nodeValue);
					}
				}
			}
			
			processMeasuresFileByDataType(currprov, "data/rain/Precip_"+atrProvince.getNamedItem("id").nodeValue+".csv", DATATYPE_RAIN);
			processMeasuresFileByDataType(currprov, "data/temperature/Temp_"+atrProvince.getNamedItem("id").nodeValue+".csv", DATATYPE_TEMPERATURE);
			
			arrProvinces.push(currprov);
		}
	}
}

function getProvinceById(provinceId)
{
	var rProv = null;
	for(var i=0; i < arrProvinces.length; i++)
	{
		if(arrProvinces[i].id == provinceId)
		{
			rProv = arrProvinces[i];
			break;
		}
	}
	return rProv;
}

/* extra functions */
function populateDropDownProvincesList(formSelectDropDown)
{
	for(var i = 0; i < arrProvinces.length; i++)
	{
		var option2Add = arrProvinces[i].capital;
		var optionHtmlElement = document.createElement("option");
		optionHtmlElement.textContent = option2Add;
		optionHtmlElement.value = i;
		formSelectDropDown.appendChild(optionHtmlElement);
	}
}

function processMeasuresFileByDataType(currentProvince, file, dataType)
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
				process_Measures_CSV_File(currentProvince, allText, dataType);
			}
		}
	};
	rawFile.send(null);
}

function process_Measures_CSV_File(currentProvince, file_content, dataType)
{	
	var allTextLines = file_content.split(/\r\n|\n/);
	var headers = allTextLines[0].split(',');
	var totalSum = 0; var totalData = 0;
	var max = []; currMax = 0;
	var min = []; currMin = Number.MAX_VALUE;

	for (var i=1; i<allTextLines.length; i++) 
	{
		var data = allTextLines[i].split(',');
		if (data.length == headers.length) 
		{
			//get values for later treatment
			currentProvince.setStatisticalDeviationForData(dataType, data[0], data[1]);
			
			//get max measures
			if(parseFloat(data[1]) >= currMax)
			{
				if(parseFloat(data[1]) > currMax)
				{
					max.pop();
					currMax = parseFloat(data[1]);
				}
				max.push(data[0] + ": " + currMax);
			}
			
			//get min measures
			if(parseFloat(data[1]) <= currMin)
			{
				if(parseFloat(data[1]) < currMin)
				{
					min.pop();
					currMin = parseFloat(data[1]);
				}
				min.push(data[0] + ": " + currMin);
			}
			
			//measure value in column index 1
			totalSum += parseFloat(data[1]);
			totalData ++;
		}
	}
	
	if(dataType == DATATYPE_RAIN)
	{
		currentProvince.setTotalRain(totalSum);
		currentProvince.setTotalRainRows(totalData);
		currentProvince.setAverageRain((totalSum/totalData).toFixed(2));
		currentProvince.setMostRainyMonths(max);
		currentProvince.setMostDriestMonths(min);
		//complete sd
		statisticalDeviationCalculation(currentProvince, DATATYPE_RAIN, currentProvince.avgrain, totalData);
	}
	if(dataType == DATATYPE_TEMPERATURE)
	{
		currentProvince.setTotalTemp(totalSum);
		currentProvince.setTotalTempRows(totalData);
		currentProvince.setAverageTemperature((totalSum/totalData).toFixed(2));
		currentProvince.setMostHottestMonths(max);
		currentProvince.setMostColdestMonths(min);
		//complete sd
		statisticalDeviationCalculation(currentProvince, DATATYPE_TEMPERATURE, currentProvince.avgtemp, totalData);
	}
}

function statisticalDeviationCalculation(currentProvince, dataType, mean, totalData)
{
	var psum = 0; var dev = 0; var devsum = 0;
	var variance = 0; var standarddev = 0;
	var i = 0; var dsd_length = 0;
	
	if(dataType == DATATYPE_RAIN) { i = 0; dsd_length = totalData; }
	if(dataType == DATATYPE_TEMPERATURE) { i = totalData; dsd_length = currentProvince.datastatisticaldeviation.length; }
		
	for(i; i < dsd_length; i++)
	{
		dev = parseFloat(currentProvince.datastatisticaldeviation[i].dvalue - mean);
		currentProvince.datastatisticaldeviation[i].setMeanDeviation(dev.toFixed(2));
		devsum += Math.abs(dev);
		psum += parseFloat(Math.pow(dev, 2).toFixed(2));
	}
	
	if(dataType == DATATYPE_RAIN)
	{
		variance = parseFloat(psum/totalData);
		currentProvince.setVarianceRain(variance.toFixed(2));
		currentProvince.setStandardDeviationRain(Math.sqrt(variance).toFixed(2));
		currentProvince.setMeanDeviationRain(parseFloat(devsum/totalData).toFixed(2));
	}
	
	if(dataType == DATATYPE_TEMPERATURE)
	{
		variance = parseFloat(psum/totalData);
		currentProvince.setVarianceTemp(variance.toFixed(2));
		currentProvince.setStandardDeviationTemp(Math.sqrt(variance).toFixed(2));
		currentProvince.setMeanDeviationTemp(parseFloat(devsum/totalData).toFixed(2));
	}
}