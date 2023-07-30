import { registerPropsOnClass } from "../scripts/registerPropsOnClass.mjs";

export default class Player extends godot.Node {

    test = 0;
    
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

registerPropsOnClass(Player, {
    test: true,
});
