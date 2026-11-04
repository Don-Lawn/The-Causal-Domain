// ps-IContainer.js

import { AssertNotImplemented }
    from "../p-assertions.js";

export class IContainer
{
    constructor()
    {
        if (new.target === IContainer)
        {
            throw new Error(
                "IContainer is abstract and cannot be instantiated."
            );
        }
    }

    storeThing(thing)
    {
        AssertNotImplemented(
            "IContainer.storeThing",
            "Derived class must implement storeThing()."
        );
    }

    removeThing(idRef)
    {
        AssertNotImplemented(
            "IContainer.removeThing",
            "Derived class must implement removeThing()."
        );
    }

    findThing(idRef)
    {
        AssertNotImplemented(
            "IContainer.findThing",
            "Derived class must implement findThing()."
        );
    }

    findById(id)
    {
        AssertNotImplemented(
            "IContainer.findById",
            "Derived class must implement findById()."
        );
    }

    findByName(name)
    {
        AssertNotImplemented(
            "IContainer.findByName",
            "Derived class must implement findByName()."
        );
    }

    findByTypeAndName(type, name)
    {
        AssertNotImplemented(
            "IContainer.findByTypeAndName",
            "Derived class must implement findByTypeAndName()."
        );
    }

    contains(idRef)
    {
        AssertNotImplemented(
            "IContainer.contains",
            "Derived class must implement contains()."
        );
    }

    clear()
    {
        AssertNotImplemented(
            "IContainer.clear",
            "Derived class must implement clear()."
        );
    }

    getIterator()
    {
        AssertNotImplemented(
            "IContainer.getIterator",
            "Derived class must implement getIterator()."
        );
    }

    getCount()
    {
        AssertNotImplemented(
            "IContainer.getCount",
            "Derived class must implement getCount()."
        );
    }
}