var net = require('net');

var client = new net.Socket();
// get back a message
client.on('data', function(data) {
    console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
});
client.connect(8092, '127.0.0.1', function() {
    console.log('Connected');
    client.write(JSON.stringify({
        scenePath: "res://scenes/Player.tscn",
        sceneType: "PlayerSpec"
    }));
});