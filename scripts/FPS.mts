import { registerPropsOnClass } from "./registerPropsOnClass.mjs";
import { PlayerSpec } from "../scenes/Player.tscn";
import { Node3DSpec } from "../Test.tscn";

export default class FPS extends godot.Node3D<Node3DSpec> {
    direction = new godot.Vector2(0, 0);
    speed = 0;
    private hiddenThing = 0;
    _ready() {
        var camera = this.get_node("./Camera3D")
        camera.set_current(true);
        var animationPlayer = this.get_node("./FPS Rig").get_node("./AnimationPlayer");
        animationPlayer.play("Idle");
        console.log("FPS ready");
        this.hiddenThing = 1;
        var newScene = godot.ResourceLoader.load("res://scenes/Player.tscn") as godot.PackedScene;
        var player = newScene.instantiate() as any as godot.Node<PlayerSpec>;
        var result = player.get_node("./FPS Rig").get_node("./Armature/Skeleton3D/Arm");
        var mesh = result.get_mesh();
        console.log(mesh.get_surface_count());
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