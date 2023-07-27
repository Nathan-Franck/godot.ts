export default class FPS extends godot.Node3D {
    
    constructor() {
        super();
    }
    
    // Called when the node enters the scene tree for the first time.
    _ready() {
        
    }
    
    // Called every frame. 'delta' is the elapsed time since the previous frame.
    _process(delta) {
        
    }
}

godot.register_property(FPS, 'direction', new godot.Vector2(0, 0));
godot.register_property(FPS, 'speed', 0);