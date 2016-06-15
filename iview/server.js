var app = require('express')();
var http = require('http').Server(app);
http.on("foo",function(req, res){

res.send("hey");
});

//http.emit("foo");

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(80, function(){
  console.log('listening on *:3000');
});
//dfds