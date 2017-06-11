var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	if(req.session.jar&&req.session.key&&!req.query.get)
		res.render('index', {key:req.session.key})
	else if(req.session.jar&&req.query.get)
		switch(req.query.get){
			case 'result':
				return res.render('result')
			break
		}
	else
		res.render('login')
})

module.exports = router;
