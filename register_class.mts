export function register_class<T extends godot.GodotClass>(c: T, toRegister: Array<keyof InstanceType<T>>) {
    var defaultInstance = new c();
    toRegister.forEach(key => {
        godot.register_property(c, key as string, defaultInstance[key as string]);
    });
    return c;
}
