// ps-Sets.js

import { Index } from "./p-Index.js";
import { AssertNotImplemented } from "./p-assertions.js";

export class Set {           // a bit like a Table in database.
    constructor() { 
        this.indexes = new Map
    }

    addElement(identity, element) {  // add the Element to the Set, and and index it accordingto identity
        for (const [fieldName, index] of this.indexes) {
            const value = this._getFieldValue(Element, fieldName);
            index.addSlotEntry(value, slot);
        }
    }


    // start indexing the field, by fieldName, so that we can find things by that field.
    indexField (fieldName) {
        this.indexes.set(fieldName, new Index(fieldName,this));
    }


    findThing (fieldName, key) {
        // search for a thing in the Set that matches the criteria, and return it.
        const index= this.indexes.get(fieldName ?? "id")
        return this.index[key];
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

