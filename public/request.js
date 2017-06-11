window.onload = function(){
	request(location.origin+"/user?get=fundamental", function(res){
		var data = JSON.parse(res).data
		console.log(data)
		document.getElementById('name').textContent = data.name
		document.getElementById('ename').textContent = data.englishName
		document.getElementById('class').textContent = data.Class.substr(1, 4)
		document.getElementById('icon').textContent = selectClass(data.Class)
	})
}

const request = (url, callback) => {
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {
		return callback(this.responseText)
	}
	xhttp.open("GET", url, true)
	xhttp.send()
}

function selectClass(name){
	switch(true){
		case /電機/g.test(name):
			return '電'
		case /電子/g.test(name):
			return '子'
		case /圖傳/g.test(name):
			return '圖'
		case /建築/g.test(name):
			return '建'
		case /汽車/g.test(name):
			return '汽'
	}
}