var all = []
var xhttp = new XMLHttpRequest()
//location.origin+"/user?get=results&year=1"
window.onload = function(){
	getAll(1)
	document.getElementById("selectYearResult").onchange = selectYear
}

var getAll = (year, callback) => {
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			all.push(JSON.parse(this.responseText))
			if(year<4)
				getAll(year+1)
			else{
				document.getElementById('resultview').style.display = 'inline'
				document.getElementById('load').style.display = 'none'
			}
		}
	}
	xhttp.open("GET", location.origin+"/user?get=results&year="+year, true);
	xhttp.send();
}

function selectYear(){
	if(this.value=='')return false
	var tag = document.getElementById('view')
	tag.innerHTML = ''
	var data = all[this.value-1].data
	var list = ['科目', '選/必 修', '學分', '成績', '選/必 修', '學分', '成績', '總成績']
	var tr = createTag('tr', '', "list-inline")
	for(var i=0;i<list.length;i++){
		tr.append(createTag('td', list[i], 'list-inline-item'))
	}
	tag.append(tr)
	for(var i=0;i<data.length;i++){
		tr = createTag('tr', '', "list-inline")
		tr.append(createTag('td', data[i][0], 'list-inline-item'))
		tr.append(createTag('td', data[i][1], 'list-inline-item'))
		tr.append(createTag('td', data[i][2], 'list-inline-item'))
		tr.append(createTag('td', data[i][3], 'list-inline-item'))
		tr.append(createTag('td', data[i][4], 'list-inline-item'))
		tr.append(createTag('td', data[i][5], 'list-inline-item'))
		tr.append(createTag('td', data[i][6], 'list-inline-item'))
		tr.append(createTag('td', data[i][7], 'list-inline-item'))
		tag.append(tr)
	}
	
}

function createTag(tag, content, Class){
	var tmp = document.createElement(tag)
	tmp.append(document.createTextNode(content))
	if(Class)
		tmp.className = Class
	return tmp
}