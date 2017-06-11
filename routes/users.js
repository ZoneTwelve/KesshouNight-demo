const express = require('express')
const router = express.Router()
const request = require('request')
const cookie = require('cookie')
const generateCookieJar = (key, val) => {
	let cookieJar = request.jar()
	let cookies = request.cookie(`${key}=${val}`)
	cookieJar.setCookie(cookies, 'http://210.70.131.56')
	return cookieJar
}

var system = require('../module/spider')
var randomKey = require('../module/random')

router.get('/', function(req, res){
	if(!req.session.jar)
		return res.render('login')
	else if(req.query.get&&req.session.jar!=undefined){
		// console.log(req.session.jar.cookies[0].key, req.session.jar.cookies[0].value)
		var jar = generateCookieJar(req.session.jar.cookies[0].key, req.session.jar.cookies[0].value)
		// console.log(jar)
		switch(req.query.get){
			case 'fundamental':
				if(req.session.jar){
					system.fundamental(jar, function(result){
						if(result.code!=200)return res.send(result.msg)
						return res.send(JSON.stringify(result))
					})
				}else
					return res.send("have some error")
			break
			case 'results':
				if(req.query.year&&req.session.jar)
					system.yearesult(String(req.query.year), jar, function(result){
						if(result.code!=200)return res.send(result)
						return res.send(JSON.stringify(result))
					})
				else
					return res.send("缺少year")
			break
			default:
				return res.send("not found")
		}
	}
	else
		return res.send("what are you want")
})

router.post('/', function(req, res){
	if(req.body.acc&&req.body.pwd)
		system.login(req.body.acc, req.body.pwd, function(result){
			if(result.code!=200)return res.send(result.msg)
			else{
				req.session.jar = result.jar._jar
				req.session.id = req.body.acc
				req.session.key = randomKey(20)
				res.send('<meta http-equiv="refresh" content="1;url=/" /><h1>登入成功</h1>')
			}
		})
	else if(req.body.logout=='1'&&req.body.key === req.session.key){
		req.session.destroy();
		return res.send('<meta http-equiv="refresh" content="1;url=/" /><h1>登出成功</h1>')
	}else if((!req.body.acc||!req.body.pwd)&&req.body.logout!='1')
		return res.send("帳號或密碼缺少")
	else
		return res.send('不知名錯誤QQ')
})

function logout(msg){
	req.session.destroy();
	return msg
}

module.exports = router;