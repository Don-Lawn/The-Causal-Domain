// ps-Container.js
// Containers and describes Locations in containers.  each location can hold a Thing.
// some things are fixed size, and so can be found quickly in arrays, but others are variable size, 
// and so must be found by searching through a list of locations on the heap,  or using indexes.
// containers are also things, so containers can hold containers.

import { Thing } from "./ps-Thing.js";
import { Index } from "./ps-Index.js";
import { SmartPtr } from "./ps-SmartPtr.js";
import { AssertNotImplemented } from "../p-assertions.js";

export class App extends Thing{           // a bit like a Table in database.
    constructor(type, name, payload, extras) {
        super(type, name,payload, extras);
        this.storage = new Array();  // the storage for the things in this container.  can be an array, a linked list, or something else.
        this.indexes = new Map();  // map of field names to indexes for those fields in the container.
        this.type = type ?? "Type:Thing.Axis";
        this.name = name;
        this.payload = payload;
        this.extras = extras;
    }

    getObject(slot) {        // return the object at the specified slot in the container.
        return this.storage[slot];
    }
    setObject(slot, object) {  // set the object at the specified slot in the container.
        this.storage[slot] = object;
    }
    addObject(object) {  // add the object to the container, and return a location for it.
        const slot = this.storage.push(object) - 1;
        for (const [fieldName, index] of this.indexes) {
            const value = this._getFieldValue(object, fieldName);
            index.addSlotEntry(value, slot);
        }
        return slot;
    }
    removeObject(slot) {  // remove the object at the specified slot in the container.
        this.storage.splice(slot, 1);
    }   





    findThing (fieldName, value) {
        // search for a thing in the container that matches the criteria, and return its location.
        const index= this.indexes.get(fieldName ?? "id")
        const slot = index.findSlotByKey(value);
        return this.storage[slot];
    }

    _getFieldValue(obj, path) {
        let current = obj;

        for (const key of path.split('.')) {
            if (current == null) {
                return undefined;
            }
            current = current[key];
        }

        return current;
    }
}

