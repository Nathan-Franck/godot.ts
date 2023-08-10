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
            var messageFromClient = data.get_string_from_ascii();
            type Message = {
                scenePath: string,
                sceneType: string,
            };
            var message = <Message>JSON.parse(messageFromClient);
            var scene = godot.ResourceLoader.load(message.scenePath, "", 2) as godot.PackedScene;
            var sceneData = parseScene(scene);
            var response = JSON.stringify(sceneData);
            {
                var output = new godot.PackedByteArray();
                for (var i = 0; i < response.length; i++) {
                    output.push_back(response.charCodeAt(i));
                }
                var err = peer.put_data(output);
                if (err != godot.OK) {
                    console.log("Error sending data");
                }
            }
            console.log("Data sent");
        }
    }
}

function parseScene(scene: godot.PackedScene) {
    var state = scene.get_state();
    var result = {
        "exportName": `${state.get_node_name(0)}Spec`,
        "nodePathToType": {},
        "imports": {},
    };
    for (var i = 0; i < state.get_node_count(); i++) {
        var node_path = `${state.get_node_path(i)}`;
        if (state.get_node_instance(i)) {
            var scene_name = formatSceneName(state.get_node_instance(i).get_state().get_node_name(0));
            result.nodePathToType[node_path] = `godot.${state.get_node_instance(i).get_state().get_node_type(0)}<${scene_name}Spec>`;
            result.imports[scene_name] = state.get_node_instance(i).get_path();
        } else {
            result.nodePathToType[node_path] = `"${state.get_node_type(i)}"`;
        }
    }
    return result;
}

godot.set_script_tooled(Plugin, true);

function formatSceneName(theName: string) {
    return theName.replace(" ", "");
}