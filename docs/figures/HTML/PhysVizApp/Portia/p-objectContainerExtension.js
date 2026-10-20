// p-objectContainerExtension.js

export class ObjectContainerExtension
{
    constructor( owner = null, roleName = "objects" )
    {
        this.owner = owner;
        this.roleName = roleName;
        this.objectMap = new Map();
    }

    addObject( object )
    {
        if( !object )
        {
            throw new Error(
                "ObjectContainerExtension.addObject(): object is null."
            );
        }

        const objectId = object.getObjectId();

        if( !objectId )
        {
            throw new Error(
                "ObjectContainerExtension.addObject(): object has no id."
            );
        }

        this.objectMap.set( objectId, object );

        return object;
    }

    removeObject( objectId )
    {
        return this.objectMap.delete( objectId );
    }

    getObject( objectId )
    {
        return this.objectMap.get( objectId ) || null;
    }

    hasObject( objectId )
    {
        return this.objectMap.has( objectId );
    }

    getObjectCount()
    {
        return this.objectMap.size;
    }

    getObjects()
    {
        return Array.from( this.objectMap.values() );
    }

    clear()
    {
        this.objectMap.clear();
    }
}