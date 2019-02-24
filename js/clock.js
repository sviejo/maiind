function setDate()
{
	var d = new Date();
	var date_string = "Fecha: "+(("0" + (d.getDate())).slice(-2))+"/"+(("0" + (d.getMonth() + 1)).slice(-2))+"/"+d.getFullYear()
	document.getElementById('fecha').innerHTML=date_string;
}

function startTime()
{
	today=new Date();
	h=today.getHours();
	m=today.getMinutes();
	s=today.getSeconds();
	m=checkTime(m);
	s=checkTime(s);
	document.getElementById('reloj').innerHTML=h+":"+m+":"+s;
	t=setTimeout('startTime()',500);
}
					
function checkTime(i)
{
	if (i<10) {i="0" + i;}return i;
}