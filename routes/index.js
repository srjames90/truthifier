var express = require('express');
var router = express.Router();
var truthifier = require('../backend/truthifier.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Truthifier' });
});

/* POST do logic stuff on back end */
router.post('/', function(req,res,next) {
	res.send(truthifier.generateTruthTableData(req.body.logicStatement));
});

module.exports = router;
