module.exports = function(mongoose, config){
	var wrapper = {};
	var db = mongoose.createConnection(config.mongodb.uri);
	db.on('error', console.error.bind(console, 'mongoose connection error: '));
	db.once('open', function () {
	  //and... we have a data store
	  console.log('datastore opened');
	});

	wrapper.add = function(clientID,roomID){
		var ObjectID = db.ObjectID;
		db.collection('game').insert({
			_id: ObjectID,
			clientId: clientID,
			roomId: roomID
		}, 
		function (err, inserted) {
    	if ( err )
    		console.log(err);
    	else
    		console.log(inserted);
		});


	}
	wrapper.get = function (clientID){
		if(this.hasOwnProperty(clientID))
			return this[clientID];
		else{
			console.log("Error: no such player");
			return "";
		}
	}
	return wrapper;
};