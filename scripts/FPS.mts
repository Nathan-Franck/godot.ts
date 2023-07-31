import { registerPropsOnClass } from "./registerPropsOnClass.mjs";
import { Player } from "../scenes/Player.tscn";

export default class FPS extends godot.Node3D {
    direction = new godot.Vector2(0, 0);
    speed = 0;
    private hiddenThing = 0;
    _ready() {
        console.log("FPS ready");
        this.hiddenThing = 1;
        var newScene = godot.ResourceLoader.load("res://scenes/Player.tscn") as godot.PackedScene;
        var player = newScene.instantiate(); // TODO: return a node that has full knowledge of the hierarchy (Language Service Plugin)
        this.add_child(player);
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