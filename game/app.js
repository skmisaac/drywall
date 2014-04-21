var express = require('express');
var path = require('path');
var config = require('../config');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// var routes = require('./routes/index');
// var users = require('./routes/users');

var mongoose = require('mongoose');
var db = require('./ludo/database')(mongoose, config);


/*
 * Global Variables made:
 * 
 * var devMode = "production";
 * function JOIN_ROOM(clientID,side);
 * function ROLL(clientID,turnID,forceDice);
 * function MOVE(clientID,turnID,planeID);
 * function START();
 * function CHECK(clientID,turnID);
 */


var mapp = module.exports = express();
mapp.config = config;

var rooms = require('./ludo/rooms');
var ludo = require('./ludo/ludoInterface')(db,rooms);


mapp.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

mapp.get('/testing', function(req, res, next) {
	res.json({
		_id: 1,
		param: req.param('test')
	})
})


mapp.post('/clear',function(req,res){
	res.setHeader('Content-Type', 'mapplication/json');
	var secret = req.param("secret");
	var roomID = req.param("roomID");

	if(secret == "Dickson's eraser"){
		res.end(JSON.stringify(ludo.CLEAR(roomID)));
	}else{
		res.end(JSON.stringify({msg:"no cheats allowed"}));
	}
});

mapp.post('/check',function(req,res){
	res.setHeader('Content-Type', 'mapplication/json');
	var clientID = req.param("clientID");
	var turnID = req.param("turnID");

	res.end(JSON.stringify(ludo.CHECK(clientID,turnID)));
});

mapp.post('/move',function(req,res){
	res.setHeader('Content-Type', 'mapplication/json');
	var clientID = req.param("clientID");
	var turnID = req.param("turnID");
	var planeID = req.param("planeID"); // {secret,forceDice};

	res.end(JSON.stringify(ludo.MOVE(clientID,turnID,planeID)));

});

mapp.post('/start',function(req,res){
	res.setHeader('Content-Type', 'mapplication/json');
	var clientID = req.param("clientID");
	var turnID = req.param("turnID");
	var planeID = req.param("planeID"); // {secret,forceDice};

	res.end(JSON.stringify(ludo.START(clientID,turnID,planeID)));

});

mapp.post('/roll',function(req,res){
	res.setHeader('Content-Type', 'mapplication/json');
	var clientID = req.param("clientID");
	var turnID = req.param("turnID");
	var cheat = req.param("cheat"); // {secret,forceDice};

	if(cheat!==undefined &&
		cheat.secret == "Dickson is dice king!"){
			ludo.devMode = cheat.secret;
		res.end(JSON.stringify(ludo.ROLL(clientID,turnID,cheat.forceDice)));
	}else{
		res.end(JSON.stringify(ludo.ROLL(clientID,turnID)));
	}
});

mapp.post('/join_room',function(req,res){
	res.setHeader('Content-Type', 'mapplication/json');
	var clientID = req.param("clientID");
	var side = letterToColor(req.param("side"));

	res.setHeader('Content-Type', 'mapplication/json');
	res.end(JSON.stringify(ludo.JOIN_ROOM(clientID,side)));

	function letterToColor(i){
		var color = {"R":0,"Y":1,"G":2,"B":3};
		return color[i];
	}
});


mapp.post('/register',function(req,res){
	res.setHeader('Content-Type', 'mapplication/json');
	if( req.param('secret') != "Dickson is amazing!"){
		res.json({msg:"cheat not allowed"});
	}
	var client_id = 12;
	var room_id = 12;

	res.json({
		_id: 1,
		cid: client_id,
		rid: room_id,
		msg: "account added"
	});

});

// mapp.post('/testInterface',function(req,res){
// 	res.end(ludo.JOIN_ROOM.toString());

// });

// mapp.post('/testPassVar',function(req,res){
// 	res.setHeader('Content-Type', 'mapplication/json');
// 	var n = req.param("name");
// 	res.json({name:n});

// });

// mapp.post('/testDB',function(req,res){
// 	res.setHeader('Content-Type', 'mapplication/json');
// 	db.add(10,100);
// 	res.end(JSON.stringify(db,null,4));

// });


/// catch 404 and forwarding to error handler
mapp.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (mapp.get('env') === 'development') {
	mapp.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
mapp.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});




module.exports = mapp;
