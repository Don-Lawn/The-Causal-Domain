// pv-domainObjectRegistryExtension.js

import { BaseExtension } from "./pv-baseExtension.js";

export class DomainObjectRegistryExtension extends BaseExtension
{
    constructor()
    {
        super("domainObjectRegistry");

        this.objects = new Map();
    }

    registerObject(obj)
    {
        this.objects.set(obj.name, obj);
        return obj;
    }

    unregisterObject(name)
    {
        const obj = this.objects.get(name);

        this.objects.delete(name);

        return obj;
    }

    getObject(name)
    {
        return this.objects.get(name);
    }

    getObjects()
    {
        return Array.from(this.objects.values());
    }

    onAttach(host)
    {
        // Extension alias
        host.domainObjects = this;

        // Legacy compatibility
        host.objects = this.objects;

        host.registerObject = (key, value) =>
        {
            this.objects.set(key, value);
            return value;
        };

        host.unregisterObject = (key) =>
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