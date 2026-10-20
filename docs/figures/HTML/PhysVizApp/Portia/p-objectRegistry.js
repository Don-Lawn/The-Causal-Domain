// p-objectRegistry.js

export class ObjectRegistry
{
    static registry =
        new Map();

    static addObject(
        object
    )
    {
        this.registry.set(
            object.objectId,
            object
        );
    }

    static getObject(
        objectId
    )
    {
        return this.registry.get(
            objectId
        );
    }

    static removeObject(
        objectId
    )
    {
        this.registry.delete(
            objectId
        );
    }
}