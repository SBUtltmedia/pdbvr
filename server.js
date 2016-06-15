//var http = require('http');
//var server = http.createServer(function(request, response) {});


const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


var eventEmitter = require('events').EventEmitter;

var custom = new eventEmitter();
var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});
var WebSocketServer = require('websocket').server;
wsServer = new SocketServer(
    { server });

var count = 0;
var clients = {};

wsServer.on('request', function(r){
   var connection = r.accept('echo-protocol', r.origin);
   var id = count++;
	// Store the connection method so we can loop through & contact all clients
	clients[id] = connection;
	 console.log((new Date()) + ' Connection accepted [' + id + ']');
   sendText("id", id, connection, "Hi");
   

custom.on('dog', function(message)
{
	sendText("dog", id, connection, "BARK!");
}); 
connection.on('message', function(event) {

  console.log("Received something.");
  console.log(event);
  
  custom.emit('dog', null);
  
});
});



function sendText(mType, id, connection, mData)
{
	var msg = {
	type: mType,
	data: mData,
	id: id,
	date: Date.now()
	};
	
	connection.send(JSON.stringify(msg));
}








 
 