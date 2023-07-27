type Properties<T> = { [key in keyof T as T[key] extends Function ? never : key]?: true };

export function godotClass<
    T extends godot.GodotClass,
>(props: {
    inspectableProperties: Properties<InstanceType<T>>,
    definition: T
}) {
    var defaultInstance = new props.definition();
    Object.keys(props.inspectableProperties).forEach(key => {
        godot.register_property(props.definition, key as string, defaultInstance[key as string]);
    });
    return props.definition;
}
