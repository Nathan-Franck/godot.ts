import { registerPropsOnClass } from "./registerPropsOnClass.mjs";

export default class FPS extends godot.Node3D {
    direction = new godot.Vector2(0, 0);
    speed = 0;
    private hiddenThing = 0;
    _ready() {
        console.log("FPS ready");
        this.hiddenThing = 1;
        var newScene = godot.ResourceLoader.load("res://scenes/Player.tscn");
        // attach to current node
        // console.log("newScene", Object.getPrototypeOf(newScene));
        var player = newScene.instantiate() as godot.Node;
        console.log("player", player);
        this.add_child(player);
        console.log("player", player);
    }
    _process(delta: number) {
        this.hiddenThing += delta;
        // console.log("FPS process", this.hiddenThing);
    }
}

registerPropsOnClass(FPS, {
    direction: true,
    speed: true,
}); 