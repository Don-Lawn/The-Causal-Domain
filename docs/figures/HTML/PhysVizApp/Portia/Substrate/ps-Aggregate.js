// ps-Aggregate.js

import { ContainerMap_V1 }
    from "./ps-ContainerMap.js";

export class Aggregate
{
    constructor()
    {
        this.roleParts =
            new ContainerMap_V1();
    }

    getRole(identity)
    {
        return this.roleParts.findThing(
            identity
        );
    }

    setRole(role)
    {
        return this.roleParts.storeThing(
            role
        );
    }

    removeRole(identity)
    {
        return this.roleParts.removeThing(
            identity
        );
    }

    hasRole(identity)
    {
        return this.getRole(
            identity
        ) != null;
    }

    getRoleCount()
    {
        return this.roleParts.getCount();
    }

    getRoleIterator()
    {
        return this.roleParts.iterator();
    }
}