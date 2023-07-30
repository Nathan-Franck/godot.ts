type Properties<T> = { [key in keyof T as T[key] extends Function ? never : key]?: true };

export function registerPropsOnClass<T extends godot.GodotClass>(
    classDefinition: T,
    inspectableProperties: Properties<InstanceType<T>>,
) {
    var defaultInstance = new classDefinition();
    Object.keys(inspectableProperties).forEach(key => {
        godot.register_property(classDefinition, key as string, defaultInstance[key as string]);
    });
}