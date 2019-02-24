function getCityDataFromURL()
{
	var parameters = location.search.substring(1).split("&");
	var temp = parameters[0].split("=");
	l = unescape(temp[1]);
	return l;
}

function getProvinceIdFromComboBox(comboBoxID)
{
	var provinceId = null;
	
	for(var i=0; i < arrProvinces.length; i++)
	{
		if(arrProvinces[i].capital == comboBoxID.options[comboBoxID.selectedIndex].text)
		{
			provinceId = arrProvinces[i].id;
			break;
		}
	}
	return provinceId;
}

function getCapitalNameFromComboBox(comboBoxID)
{
	var capitalName = null;
	
	for(var i=0; i < arrProvinces.length; i++)
	{
		if(arrProvinces[i].capital == comboBoxID.options[comboBoxID.selectedIndex].text)
		{
			capitalName = arrProvinces[i].capital;
			break;
		}
	}
	return capitalName;
}