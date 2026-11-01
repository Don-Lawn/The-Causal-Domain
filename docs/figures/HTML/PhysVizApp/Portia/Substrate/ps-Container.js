// ps-Container.js
// Containers and describes Locations in containers.  each location can hold a Thing.
// some things are fixed size, and so can be found quickly in arrays, but others are variable size, 
// and so must be found by searching through a list of locations on the heap,  or using indexes.
// containers are also things, so containers can hold containers.

import { Thing } from "./ps-Thing.js";
import { DoublyLinkedList, DoublyLinkedListIterator } from "./ps-DoublyLinkedList.js";
import { AssertNotImplemented } from "../p-assertions.js";
import { Code } from "./ps-Thing.Code.js";

export class IdRef{
    constructor (identity, location) {
        this.identity = identity;
        this.location = location;
    }
}

export class Location {
    constructor(container, index) {
        this.container = container;
        this.index = index;
    }
}

export class Container extends Thing{           // a bit like a Table in database.
    constructor(type, name, payload, extras) {
        super(type, name,payload, extras);
        this.containerType = type ?? new Code ("Type.Container");
        this.Load(this.containerType, payload, extras);
    }

    Load (type, name, payload, extras) {// override for different implementations
        this.storage =  new DoublyLinkedList();     // first and default is DoubleLinkedList
        this.type = type;
        this.name = name;
        this.payload = payload;
        this.extras = extras;
//        this.allowedContents = new DoublyLinkedList(extras.allowedContents??null);  // list of types of things that can be contained in this container.
    }
    
    addIndex (index) {
        // add the thing at the specified index in the container
        return location;
    }

    storeThing (thing, iterator = null) {
        // add the thing to the container, and return a location for it.
        const handle = this.storage.insertAfter(thing, iterator);
        return handle;
    }

    removeThing (location) {
        AssertNotImplemented("Container.removeThing", "This method has not yet been implemented"); 
    }

    findThing (identity) {
        // search for a thing in the container that matches the criteria, and return its location.
        AssertNotImplemented("Container.findThing", "This method has not yet been implemented");
        return location;
    }
}

