@tool # Needed so it runs in editor.
extends EditorScenePostImport

# This sample changes all node names.
# Called right after the scene is imported and gets the root node.
func _post_import(scene):
    # Change all node names to "modified_[oldnodename]"
    iterate(scene)
    return scene # Remember to return the imported scene

func iterate(node):
    if node != null:
        node.name = "modified_" + node.name
        for child in node.get_children():
            iterate(child)