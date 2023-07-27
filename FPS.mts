import { register_class } from "./register_class.mjs";

export default register_class(class FPS extends godot.Node3D {
    direction = new godot.Vector2(0, 0);
    speed = 0;
    private _hiddenThing = 0;
    _ready() {
        console.log("FPS ready");
        this._hiddenThing = 1;
    }
    _process(delta: number) {
        this._hiddenThing += delta;
        console.log("FPS process", this._hiddenThing);
    }
}, ["direction", "speed"]);