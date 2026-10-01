// p-smartPtr.js

import { ObjectRegistry } from "./p-objectRegistry.js";

export class SmartPtr
{
    constructor(
        object = null
    )
    {
        this.objectId =
            null;

        this.cachedObject =
            null;

        if (object)
        {
            this.setObject(
                object
            );
        }
    }

    setObject(
        object
    )
    {
        if (!object)
        {
            this.objectId =
                null;

            this.cachedObject =
                null;

            return;
        }

        this.objectId =
            object.objectId;

        this.cachedObject =
            object;
    }


    getObject()
    {
        if (
            this.objectId === null
        )
        {
            return null;
        }

        if (
            this.cachedObject === null
        )
        {
            this.cachedObject =
                ObjectRegistry.getObject(
                    this.objectId
                );
        }

        return this.cachedObject;
    }


    getObjectId()
    {
        return this.objectId;
    }

    clear()
    {
        this.objectId = null;
        this.cachedObject = null;
    }

    toJSON()
    {
        return {
            objectId :
                this.objectId
        };
    }

    fromJSON(
        json
    )
    {
        this.objectId =
            json.objectId;

        this.cachedObject =
            null;
    }
}