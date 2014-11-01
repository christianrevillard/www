var startApplication = function(socketName) {

	var chat = exports.applicationSocket = socketName;
	
	chat.on('connection', function(socket){
		console.log('user connected');
		
		socket.broadcast.emit('chat message', 'hi !');
	  
		socket.on('disconnect', function(){
			socket.broadcast.emit('chat message', 'bye !');
			console.log('user disconnected');
		});
  
		socket.on('chat message', function(msg){
			console.log('message: ' + msg);
			chat.emit('chat message', msg);
		});
	}); 
};

exports.startApplication = startApplication;
exports.applicationSocket = null;