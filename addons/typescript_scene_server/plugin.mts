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
            console.log(`Connection established to client ${peer.get_connected_host()}`);
            var [err, data] = peer.get_data(512);
            console.log(err);
            console.log(data.size());
            console.log(data.get_string_from_ascii());
            console.log("Connection established");
            peer.put_data(new godot.PackedByteArray("Hello from Godot"));
        }
    }
}

godot.set_script_tooled(Plugin, true);