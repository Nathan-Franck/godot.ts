function register_class<T extends godot.GodotClass>(c: T, toRegister: Array<keyof InstanceType<T>>) {
    var defaultInstance = new c();
    toRegister.forEach(key => {
        godot.register_property(c, key as string, defaultInstance[key as string]);
    });
    return c;
}

export default register_class(class FPS extends godot.Node3D {
    direction = new godot.Vector2(0, 0);
    speed = 0;
    private _hiddenThing = 0;
    _ready() {
        console.log("FPS ready");
        this._hiddenThing = 1;
    }
}, ["direction", "speed"]);