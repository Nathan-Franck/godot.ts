// Starts a TCPServer on port 8091 and listens for connections. A client can request that a scene get reimported and the type will be built inside the .godot folder

export default class Plugin extends godot.EditorPlugin {
    constructor() {
        console.log("Plugin constructor");
        super();
    }

    _enter_tree() {
        console.log("Plugin entered tree");

        // Create the TCPServer
        this._server = new godot.TCPServer();
        this._server.listen(8092, "127.0.0.1");
    }

    _exit_tree() {
        console.log("Plugin exited tree");
    }

    _process(delta: number) {
        // Check for new connections
        var shouldHandleConnection = this._server.is_connection_available();
        if (shouldHandleConnection) {
            var peer = this._server.take_connection();
            peer.set_no_delay(true);
            console.log(`Connection established to client ${peer.get_connected_host()}`);
            var dataSize = peer.get_available_bytes();
            var [err, data] = peer.get_data(dataSize);
            console.log(err);
            console.log(data.size());
            console.log(data.get_string_from_ascii());
            console.log("Connection established");
            var message = "Hello from the server";
            var output = new godot.PackedByteArray();
            for (var i = 0; i < message.length; i++) {
                output.push_back(message.charCodeAt(i));
            }
            var err = peer.put_data(output);
            console.log(err);
            console.log("Data sent");
        }
    }
}

godot.set_script_tooled(Plugin, true);