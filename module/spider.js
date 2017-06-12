const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')

function login(acc, pwd, callback){
	var jar = request.jar()
	var options = {
		url:'http://210.70.131.56/online/login.asp',
		jar:jar,
		encoding:null,
		form:{
			division:'senior',
			rdo:'1',
			Loginid:acc,
			LoginPwd:pwd,
			Uid:'',
			Enter:'LOGIN'
		},
	}
	request.post(options, function(e, r, d){
		let result = new Object()
		if(e||!d)return callback(setError(result, "can not connect to school's server", e, 404))

		var html = iconv.decode(d, "Big5")

		if(/線上系統查無您的帳號，請聯絡系統管理人員。/g.test(html))
			return callback(setError(result, "查無帳號", e, 401))
		else if(/帳號或密碼錯誤,請重新登入!/g.test(html))
			return callback(setError(result, "帳號或密碼錯誤", e, 401))
		else if(checkedLogin(html))
			return callback(setError(result, "登入失效", e, 401))

		result.jar = jar
		result = setResponse(result, "login done", 200)

		return callback(result)
	})
}

function fundamental(jar, callback){
	var options = {
		url:"http://210.70.131.56/online/selection_student/fundamental.asp",
		jar:jar,
		encoding:null,
	}
	request(options, function(e, r, d){
		let result = new Object()
		if(e||!d)return callback(setError(result, "GET fundamental error", e, 404))

		var html = iconv.decode(d, "Big5")

		if(checkedLogin(html))
			return callback(setError(result, "登入失效", e, 401))

		var $ = cheerio.load(html)
		var table = $("table tr td")

		result.data = {}
		result.data.no = table.eq(2).text()
		result.data.name = table.eq(4).text()
		result.data.englishName = table.eq(26).text()
		result.data.birthday = table.eq(6).text().replace(/\r|\n|\t/g, "")
		result.data.identity = table.eq(10).text().replace(/\r|\n|\t/g, "")
		result.data.sex = table.eq(12).text().replace(/\r|\n|\t/g, "")
		result.data.Class = table.eq(14).text().replace(/\r|\n|\t/g, "")
		result.data.imgSrc = "http://210.70.131.56/online/utility/file1.asp?"+$("img")[0].attribs.src.split("?")[1]

		result.all = result.data
		result = setResponse(result, "GET fundamental done", 200)
		return callback(result)
	})
}

function yearResultsList(jar, callback){
	var options = {
		url:"http://210.70.131.56/online/selection_student/year_accomplishment.asp?action=selection",
		jar:jar,
		encoding:null,
	}
	request(options, function(e, r, d){
		let result = new Object()
		if(e||!d)return callback(setError(result, "GET fundamental error", e, 404))

		var html = iconv.decode(d, "Big5")

		if(checkedLogin(html))
			return callback(setError(result, "登入失效", e, 401))

		result = setResponse(result, "GET yearResultList done", 200)

		return callback(result)
	})
}

function yearResult(year, jar, callback){
	var options = {
		jar:jar,
		encoding:null,
	}
	
	switch(year){
		case '1':options.url = "http://210.70.131.56/online/selection_student/year_accomplishment.asp?action=selection_underside_year&year_class=%A4%40&number=1"
		break
		case '2':options.url = "http://210.70.131.56/online/selection_student/year_accomplishment.asp?action=selection_underside_year&year_class=%A4G&number=2"
		break
		case '3':options.url = "http://210.70.131.56/online/selection_student/year_accomplishment.asp?action=selection_underside_year&year_class=%A4T&number=3"
		break
		case '4':options.url = "http://210.70.131.56/online/selection_student/year_accomplishment.asp?action=selection_underside_year&year_class=%A5%7C&number=4"
		break
		default:return callback(setError(new Object, "not found", undefined, 404))
	}

	request(options, function(e, r, d){
		let result = new Object()
		if(e||!d)return callback(setError(result, "GET fundamental error", e, 404))
		
		var html = iconv.decode(d, "Big5")
		
		if(checkedLogin(html))
			return callback(setError(result, "登入失效", e, 401))

		var $ = cheerio.load(html)
		var table = $("table tr td")
		result.data = []
		// for(var i=0;i<10;i++)
			// console.log(result.data.eq(i).text())
		var tmp = 0
		for(var i=11;i<table.length;i+=8)
			if(table.eq(i)[0].attribs.colspan!=10)
				result.data.push([table.eq(i).text(), table.eq(i+1).text(), table.eq(i+2).text(), table.eq(i+3).text(), table.eq(i+4).text(), table.eq(i+5).text(), table.eq(i+6).text(), table.eq(i+7).text(), ])
			else{
				tmp = i+5
				break
			}
		// console.log(table.eq(140))
		result.operation = []
		for(var i=tmp;i<table.length;i+=4)
			// if(!/\n/g.test(table.eq(i).text()))
			if(table.eq(i)[0].attribs.colspan!=8)
				result.operation.push([table.eq(i).text(), table.eq(i+1).text(), table.eq(i+2).text(), table.eq(i+3).text(), ])
			else{
				tmp = i+1
				break
			}
		result.comment = []
		for(var i=tmp;i<table.length;i+=14)
			if(tmp+28>i)
			result.comment.push([table.eq(i+9).text(), table.eq(i+10).text(), table.eq(i+11).text(), table.eq(i+12).text(), table.eq(i+13).text()])
		// for(var i=tmp;i<table.length;i++)
			// console.log(table.eq(i).text())
		result.all = [result.data, result.operation, result.comment]

		result = setResponse(result, "GET results done", 200)

		callback(result)
	})
}

function headshot(url, jar, callback){
	
}

function setError(obj, msg, error, code){
	obj.msg = msg
	obj.error = error
	obj.errorCode = code
	return obj
}

function setResponse(obj, msg, code){
	obj.msg = msg
	obj.code = code
	// obj.html = html
	return obj
}

function checkedLogin(html){
	if(/您尚未登入系統，或者工作階段逾時，請重新登入/g.test(html))
		return true
	else
		return false
}

exports.login = login
exports.fundamental = fundamental
// exports.yearlist = yearResultsList
exports.yearesult = yearResult
exports.headshot = headshot
