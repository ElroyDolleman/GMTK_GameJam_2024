import { Constructor } from "./ConstructorGeneric";

export interface IComponentManager<T>
{
    addComponent(component: T): void;

    getComponent<K extends T>(type: Constructor<K>): K | undefined;
    getComponents<K extends T>(type: Constructor<K>): K[];

    removeComponents<K extends T>(type: Constructor<K>): void;
}