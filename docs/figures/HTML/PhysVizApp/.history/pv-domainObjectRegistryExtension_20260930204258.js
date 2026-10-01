// pv-domainObjectRegistryExtension.js

import { BaseExtension } from "./pv-baseExtension.js";

export class DomainObjectRegistryExtension extends BaseExtension
{
    constructor()
    {
        super("domainObjectRegistry");

        this.objects = new Map();
    }

    register(obj)
    {
        this.objects.set(obj.id, obj);
        return obj;
    }

    unregister(id)
    {
        const obj = this.objects.get(id);

        this.objects.delete(id);

        return obj;
    }

    getObject(id)
    {
        return this.objects.get(id);
    }

    getObjects()
    {
        return Array.from(this.objects.values());
    }

    onAttach(object)
    {
        // Extension alias
        object.domainObjects = this;

        // Legacy compatibility
        object.objects = this.objects;

        object.registerObject = (key, value) =>
        {
            this.objects.set(key, value);
            return value;
        };

        object.unregisterObject = (key) =>
        {
            const value = this.objects.get(key);

            this.objects.delete(key);

            return value;
        };
    }

    onDetach(object)
    {
        delete object.domainObjects;
        delete object.objects;

        delete object.registerObject;
        delete object.unregisterObject;
    }
}