extends SceneTree
func _init():

    
    var args = OS.get_cmdline_user_args()
    var input_path = args[0]
    var output_path = args[1]
    print(input_path)

    var scene = ResourceLoader.load(input_path, "", 2)
    var result = parseScene(scene)
    print(result)

    # strip res:// from input path and replace / with .
    var strippedInput = input_path.right(-6).replace("/", ".")
    print(strippedInput)
    var jsonPath = "%s/%s.d.ts" % [output_path, strippedInput]
    print(jsonPath)

    #ensure output folder exists
    DirAccess.open("res://").make_dir_recursive(jsonPath.get_base_dir())
    var file = FileAccess.open(jsonPath, FileAccess.WRITE)
    var importString = ""

    # map imports to `import { ClassName } from "path/to/ClassName"`
    for key in result.imports.keys():
        importString += "import { %sSpec } from \"%s\"\n" % [key, result.imports[key]]

    # map path->type to `path: type`
    var exportType = "";
    for key in result.nodePathToType.keys():
        exportType += '\t"%s": %s\n' % [key, result.nodePathToType[key]]

    file.store_string("%s\nexport type %sSpec = {\n%s}" % [
        importString,
        formatSceneName(result.exportName),
        exportType,
    ])
    file.close()
    quit()

func parseScene(scene):
    var state = scene.get_state()
    print(state.get_node_count())
    var result = {
        "exportName": state.get_node_name(0),
        "nodePathToType": {},
        "imports": {},
    };
    for i in range(state.get_node_count()):
        var node_path = "%s" % state.get_node_path(i)
        if (state.get_node_instance(i)):
            # Remove spaces from node name
            var scene_name = formatSceneName(state.get_node_instance(i).get_state().get_node_name(0))
            result.nodePathToType[node_path] = "godot.%s<%sSpec>" % [
                state.get_node_instance(i).get_state().get_node_type(0),
                scene_name
            ]
            result.imports[scene_name] = state.get_node_instance(i).get_path()
        else:
            result.nodePathToType[node_path] = '"%s"' % state.get_node_type(i)
    return result

func formatSceneName(name):
    return name.replace(" ", "")