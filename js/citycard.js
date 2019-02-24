var currentCityFullName = ""; //used for data searching
var currentCapitalFullName = ""; //used for titles

function loadProvincePicture(xml, selectedProvince) 
{	
	var div="";
	
	for(var i=0; i < arrProvinces.length; i++)
	{
		if(arrProvinces[i].id == selectedProvince)
		{
			div += "<h1>" + arrProvinces[i].fullprovincetitle + "</h1>" +
				"<div class=\"map_detail\">" +
					"<img src=\"img/provinces/" + arrProvinces[i].id + ".jpg\" />" +
				"</div>";
			break;
		}
	}
	return div;
}

function loadProvinceDetails(xml, selectedProvince) 
{	
	var div="";
	
	for(var i=0; i < arrProvinces.length; i++)
	{
		if(arrProvinces[i].id == selectedProvince)
		{
			currentCityFullName = arrProvinces[i].id;
			currentCapitalFullName = arrProvinces[i].capital;
			
			var label_rainymonths = "",  label_driestmonths = "", label_hottestmonths = "", label_coldestmonths = "";
			
			if(arrProvinces[i].rainymonths.length > 1) label_rainymonths = "Meses más lluviosos: "; else label_rainymonths = "Mes más lluvioso: ";			
			var txt_rainymonths = formatCollection4Showing(arrProvinces[i].rainymonths, " m<sup>3</sup>");
			
			if(arrProvinces[i].driestmonths.length > 1) label_driestmonths = "Meses más secos: "; else label_driestmonths = "Mes más seco: ";
			var txt_driestmonths = formatCollection4Showing(arrProvinces[i].driestmonths, " m<sup>3</sup>");
			
			if(arrProvinces[i].hottestmonths.length > 1) label_hottestmonths = "Meses más calurosos: "; else label_hottestmonths = "Mes más caluroso: ";
			var txt_hottestmonths = formatCollection4Showing(arrProvinces[i].hottestmonths, " ºC");
			
			if(arrProvinces[i].coldestmonths.length > 1) label_coldestmonths = "Meses más fríos: "; else label_coldestmonths = "Mes más frío: ";
			var txt_coldestmonths = formatCollection4Showing(arrProvinces[i].coldestmonths, " ºC");
			
			
			div += "<div id=\"detailtable_header\">" +
							"<h4><span class=\"bold_text\">Capital de provincia: " + "</span>" + arrProvinces[i].capital + "</h4>" +
							"<h4><span class=\"bold_text\">Comunidad Autónoma: " + "</span>" + arrProvinces[i].region + "</h4>" +
						"</div>" +
						"<hr />" +
						"<div id=\"detailtable_left\">" +
							"<p class=\"detailtable_bold_text\">Precipitaciones medias (" + arrProvinces[i].avgr_fyear + "-" + arrProvinces[i].avgr_lyear + "): " + "</p> <p class=\"detail_lov\">" + arrProvinces[i].avgrain + " m<sup>3</sup> </p>" +
							"<br>" +
							"<p class=\"detailtable_bold_text\">" + label_rainymonths + "</p>" + txt_rainymonths +
							"<br>" +
							"<p class=\"detailtable_bold_text\">" + label_driestmonths + "</p>" + txt_driestmonths +
						"</div>" +
						"<div id=\"detailtable_right\">" +
							"<p class=\"detailtable_bold_text\">Temperatura media (" + arrProvinces[i].avgt_fyear + "-" + arrProvinces[i].avgt_lyear + "): " + "</p> <p class=\"detail_lov\">" + arrProvinces[i].avgtemp + " ºC </p>" +
							"<br>" +
							"<p class=\"detailtable_bold_text\">" + label_hottestmonths + "</p>" + txt_hottestmonths +
							"<br>" +
							"<p class=\"detailtable_bold_text\">" + label_coldestmonths + "</p>" + txt_coldestmonths +
						"</div>";
			break;
		}
	}
	return div;
}

function formatCollection4Showing(collection2Show, measureComplement)
{
	var retString = "<p class=\"detail_lov\">";
	if(collection2Show.length == 1)
		retString += collection2Show[0] + measureComplement;
	else
	{
		for(var i=0; i<collection2Show.length; i++)
		{
			retString += collection2Show[i] + measureComplement;
			if(i+1 < collection2Show.length)
				retString += "<br>";
		}
	}
	retString += "</p>";
	return retString;
}

function loadProvinceDeepStats(selectedProvince) 
{	
	var table = "";
	var tableColumns = "";
	var j = 0;
	var header_included = false;
	for(var i=0; i < arrProvinces.length; i++)
	{
		if(arrProvinces[i].id == selectedProvince)
		{
			table += "<div id=\"moreStats\">Tabla de estadísticas";
						
			tableColumns = "<tr>" +
								"<th>Mes</th>" +
								"<th>Valor</th>" +
								"<th>Desviación</th>" +
							"</tr>";
						
			var dmd = arrProvinces[i].datastatisticaldeviation;
			
			for(j=0, header_included=false; j < dmd.length; j++)
			{
				if(dmd[j].datatype == DATATYPE_RAIN)
				{
					if(!header_included)
					{
						table += "<div id=\"rainStatsTable\">" + 
									"<table id=\"stats\">";					
						table += tableColumns;					
						header_included = true;
					}

					table += "<tr>" +
								"<td>"+dmd[j].label+"</td>" +
								"<td>"+dmd[j].dvalue+"</td>" +
								"<td>"+dmd[j].md+"</td>" +
							"</tr>";
				}
			}
			//table [stats]
			table += "</table>";
			//button [evenmorestats]
			table += "<button class=\"button_evenmorestats\"><span>Más estadísticas </span></button>";
			//div [evenmorestats]
			table += "<div class=\"div_evenmorestats\">" +
						"<p class=\"small_text\"><span class=\"evenmorestats_boldrain\">Desviación media: </span>" + arrProvinces[i].meandevrain + "</p>" +
						"<p class=\"small_text\"><span class=\"evenmorestats_boldrain\">Varianza: </span>" + arrProvinces[i].variancerain + "</p>" +
						"<p class=\"small_text\"><span class=\"evenmorestats_boldrain\">Desviación estándar: </span>" + arrProvinces[i].stddevrain + "</p>" +
					 "</div>";
			//table [tempStatsTable]
			table += "</div>";
			
			for(j=0, header_included=false; j < dmd.length; j++)
			{
				if(dmd[j].datatype == DATATYPE_TEMPERATURE)
				{
					if(!header_included)
					{			
						table += "<div id=\"tempStatsTable\">" + 
									"<table id=\"stats\">";
						table += tableColumns;
						header_included = true;
					}
				
					table += "<tr>" +
								"<td>"+dmd[j].label+"</td>" +
								"<td>"+dmd[j].dvalue+"</td>" +
								"<td>"+dmd[j].md+"</td>" +
							"</tr>";
				}
			}
			//table [stats]
			table += "</table>";
			//button [evenmorestats]
			table += "<button class=\"button_evenmorestats\"><span>Más estadísticas </span></button>";
			//div [evenmorestats]
			table += "<div class=\"div_evenmorestats\">" +
						"<p class=\"small_text\"><span class=\"evenmorestats_boldtemp\">Desviación media: </span>" + arrProvinces[i].meandevtemp + "</p>" +
						"<p class=\"small_text\"><span class=\"evenmorestats_boldtemp\">Varianza: </span>" + arrProvinces[i].variancetemp + "</p>" +
						"<p class=\"small_text\"><span class=\"evenmorestats_boldtemp\">Desviación estándar: </span>" + arrProvinces[i].stddevtemp + "</p>" +
					 "</div>";
			//table [tempStatsTable]
			table += "</div>";
			//div [moreStats]
			table += "</div>";
			break;
		}
	}
	return table;
}