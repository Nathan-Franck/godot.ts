export function register_class<T extends godot.GodotClass>(props: { register: { [key in keyof InstanceType<T>]?: true}, node: T }) {
    var defaultInstance = new props.node();
    Object.keys(props.register).forEach(key => {
        godot.register_property(props.node, key as string, defaultInstance[key as string]);
    });
    return props.node;
}
