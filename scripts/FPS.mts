import { godotClass } from "./godotClass.mjs";

export default godotClass({
    inspectableProperties: {
        direction: true,
        speed: true,
    },
    definition: class FPS extends godot.Node3D {
        direction = new godot.Vector2(0, 0);
        speed = 0;
        private hiddenThing = 0;
        _ready() {
            console.log("FPS ready");
            this.hiddenThing = 1;
        }
        _process(delta: number) {
            this.hiddenThing += delta;
            console.log("FPS process", this.hiddenThing);
        }
    }
});