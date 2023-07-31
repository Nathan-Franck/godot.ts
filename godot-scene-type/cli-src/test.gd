extends SceneTree

func _init():
    var args = OS.get_cmdline_user_args()
    var path = args[0]
    print(path)
    var scene = ResourceLoader.load(path)
    var result = parseScene(scene)
    print(result)
    #output to json file beside the scene file
    var jsonPath = path.left(-5) + ".json"
    print(jsonPath)
    var file = FileAccess.open(jsonPath, FileAccess.WRITE)
    file.store_string(JSON.stringify(result, "\t"))
    file.close()
    quit()

func parseScene(scene):
    var state = scene.get_state()
    print(state.get_node_count())
    var result = {};
    for i in range(state.get_node_count()):
        var node_path = "%s" % state.get_node_path(i)
        if (state.get_node_instance(i)):
            var innerResult = parseScene(state.get_node_instance(i));
            for key in innerResult:
                result["%s/%s" % [node_path, key.right(-2)]] = innerResult[key];
        else:
            result[node_path] = "%s" % state.get_node_type(i);
    return result;