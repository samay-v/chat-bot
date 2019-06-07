//getting API keys from .env using dotenv
require('dotenv').config();
var apiai_key = process.env.apiai_key;

//instantiate Express
var express = require('express'),
    app = express();
var apiai = require('apiai')(apiai_key);

// serve files from within the root directory
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

//instantiate socket.io
var io = require('socket.io')(app.listen(3000));

//listen to when a new user is connected
io.on('connection', function(socket){
  console.log('a user connected');
});


io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    
    //build a reply using aiAPI
    let apiaiReq = apiai.textRequest(text, {
      sessionId: apiai_key
    });

    //send the reply back to the browser
    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      socket.emit('bot reply', aiText); 
    });

    //handling errors
    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});


