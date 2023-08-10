var net = require('net');

var client = new net.Socket();
// get back a message
client.connect(8092, '127.0.0.1', function () {
    client.write(JSON.stringify({
        scenePath: "res://FPS Rig.glb",
        sceneType: "PlayerSpec"
    }));
    // client.destroy();
});
client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});
client.on('end', () => {
    console.log('disconnected from server');
}); 